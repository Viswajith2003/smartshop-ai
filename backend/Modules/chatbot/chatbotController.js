const { sendSuccess, sendError } = require("../../utils/response");
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const processChatMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user._id;

        if (!message) {
            return sendError(res, "Message is required", 400);
        }

        const lowerMessage = message.toLowerCase();
        let contextData = "";

        // --- LAYER 1: Small talk / Greetings (Rule-based, No DB, No GPT) ---
        const greetings = ["hi", "hello", "hey", "how are you", "good morning", "good evening", "hai", "halo"];
        const isGreeting = greetings.some(word => {
            const regex = new RegExp(`^\\b${word}\\b[!?]*$`, 'i');
            return regex.test(lowerMessage) || lowerMessage === word || lowerMessage.startsWith(word + " ");
        });

        if (isGreeting) {
            return sendSuccess(res, "Message processed successfully", { 
                reply: "Hello 👋 I'm the SmartShop Assistant. How can I help you today?" 
            });
        }

        const goodbyes = ["bye", "goodbye", "thanks", "thank you"];
        const isGoodbye = goodbyes.some(word => lowerMessage === word || lowerMessage.startsWith(word + " "));
        if (isGoodbye) {
            return sendSuccess(res, "Message processed successfully", { 
                reply: "You're welcome! Feel free to ask if you need anything else. Have a great day! 👋" 
            });
        }

        // --- LAYER 2: Business Queries (DB + GPT) ---
        // Intent Detection: Order Lookups
        if (lowerMessage.includes("order") || lowerMessage.includes("track") || lowerMessage.includes("#")) {
            const orderIdMatch = message.match(/#([a-zA-Z0-9]+)/);
            
            if (orderIdMatch && orderIdMatch[1]) {
                const shortId = orderIdMatch[1].toUpperCase();
                
                const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate('items.product');
                const matchedOrder = orders.find(o => {
                    const razorpayId = o.paymentDetails?.razorpayOrderId;
                    const objectIdFull = o._id.toString().toUpperCase();
                    return (razorpayId && razorpayId.toUpperCase().includes(shortId)) || objectIdFull.includes(shortId);
                });

                if (matchedOrder) {
                    const date = new Date(matchedOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                    const productNames = matchedOrder.items.map(item => item.product?.name || "Unknown Item").join(', ');
                    
                    const reply = `Here are the details for your order! 😊\n\n📦 **Order #${shortId}**\n🔹 Product(s): **${productNames}**\n📅 Date: **${date}**\n📌 Status: **${matchedOrder.orderStatus}**\n\n[View Order Details](/orders/#${shortId})`;
                    return sendSuccess(res, "Message processed successfully", { reply });
                } else {
                    const reply = `I couldn't find order #${shortId} in your account. Please double-check the ID politely.`;
                    return sendSuccess(res, "Message processed successfully", { reply });
                }
            } else {
                // Handle "all orders" vs "recent order"
                const isAllOrders = lowerMessage.includes("all") || lowerMessage.includes("orders");
                const limit = isAllOrders ? 5 : 1;
                const recentOrders = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(limit).populate('items.product');
                
                if (recentOrders.length > 0) {
                    if (isAllOrders && recentOrders.length > 1) {
                        let finalReply = "Here are your orders! 😊\n\n";
                        recentOrders.forEach((order, index) => {
                            const productNames = order.items.map(item => item.product?.name || "Unknown Item").join(', ');
                            const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                            finalReply += `📦 **Order ${index + 1}**\n🔹 Product(s): **${productNames}**\n📅 Date: **${date}**\n📌 Status: **${order.orderStatus}**\n\n`;
                        });
                        finalReply += `[View All Orders](/orders)`;
                        
                        return sendSuccess(res, "Message processed successfully", { reply: finalReply });
                    } else {
                        const order = recentOrders[0];
                        const productNames = order.items.map(item => item.product?.name || "Unknown Item").join(', ');
                        const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                        
                        const finalReply = `Here is your most recent order! 😊\n\n📦 **Order Details**\n🔹 Product(s): **${productNames}**\n📅 Date: **${date}**\n📌 Status: **${order.orderStatus}**\n\n[View Order](/orders)`;
                        return sendSuccess(res, "Message processed successfully", { reply: finalReply });
                    }
                } else {
                    const reply = `You don't have any recent orders in your account yet!`;
                    return sendSuccess(res, "Message processed successfully", { reply });
                }
            }
        }
        else if (lowerMessage.includes("price") || lowerMessage.includes("product") || lowerMessage.includes("cost")) {
            contextData = "The user is asking about products or pricing. Use your general knowledge or politely mention that you can help with specific order issues. (e.g. 'Please specify the product you are looking for').";
        }
        // --- LAYER 3: Complex Conversation (GPT Only) ---
        else {
            contextData = "The user is asking a general question (e.g., refund policy, general support, or recommendations). Answer politely like a customer support agent.";
        }

        // Generate AI Response using Gemini API
        const prompt = `
            System Instructions: You are SmartShop's warm and friendly customer support assistant. You love helping people and always use emojis.
            
            Task Instructions: You are a helpful, warm, and highly friendly customer support chatbot for an e-commerce store named "SmartShop".
            Be friendly, concise, and professional, and use emojis naturally to make the conversation engaging.
            
            Here is the context retrieved from the database based on the user's intent:
            ---
            ${contextData}
            ---
            
            User's message: "${message}"
            
            Respond directly to the user's message based on the context provided above. Make sure your tone is warm and inviting!
            Do not mention "database context" or "backend" in your reply to the user.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                maxOutputTokens: 500,
                temperature: 0.7,
            }
        });

        const reply = response.text.trim();

        sendSuccess(res, "Message processed successfully", { reply });
        
    } catch (error) {
        console.error("Chatbot Error:", error.message || error);
        // Instead of sending a 500 which triggers global redirect, return a 200 with a fallback message
        sendSuccess(res, "Message processed with fallback", { 
            reply: "I'm currently experiencing high traffic or a temporary issue. Please try again in a moment, or contact our support team directly." 
        });
    }
};

module.exports = {
    processChatMessage
};
