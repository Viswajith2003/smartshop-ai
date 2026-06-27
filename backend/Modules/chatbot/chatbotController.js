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
                    const date = new Date(matchedOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                    // Provide order details as context to Gemini
                    contextData = `The user is asking about order #${shortId}. Found order details: Order ID: #${shortId}, Placed on: ${date}, Status: ${matchedOrder.orderStatus}, Total Price: ₹${matchedOrder.pricing?.totalPrice}. Let the user know these details deeply and in a friendly, attractive way. IMPORTANT: You MUST format the Order ID and Status by wrapping them in double asterisks (like **#${shortId}** and **${matchedOrder.orderStatus}**) so they are highlighted. IMPORTANT: You MUST append the following exact markdown link at the very end of your response to provide a navigation button: [View Order Details](/orders/#${shortId})`;
                } else {
                    contextData = `The user asked about order #${shortId}, but no matching order was found in their account. Ask them to double-check the ID politely.`;
                }
            } else {
                // Fetch the top 3 latest orders if no specific ID is provided
                const recentOrders = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(3);
                if (recentOrders.length > 0) {
                    let ordersContext = "The user is asking a general question about their orders. Here are their most recent orders:\\n";
                    recentOrders.forEach(order => {
                        const shortId = order.paymentDetails?.razorpayOrderId || order._id.toString().slice(-8).toUpperCase();
                        ordersContext += `- Order ID: #${shortId}, Status: ${order.orderStatus}\\n`;
                    });
                    
                    contextData = `${ordersContext}\\nTell them about these recent orders in a friendly way. IMPORTANT: You MUST format the Order IDs and Statuses by wrapping them in double asterisks (like **#ID** and **Status**) so they are highlighted. IMPORTANT: Do not group all text together and all buttons at the end. Instead, you MUST structure your response so that each order has its own separate block. For each order, explain its status and then IMMEDIATELY follow it with its specific navigation button on a new line using the exact markdown link format: [View Order #ID](/orders/#ID). Separate each order's block with an empty line.`;
                } else {
                    contextData = `The user asked about their orders, but they don't have any recent orders in their account yet. Let them know nicely.`;
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
