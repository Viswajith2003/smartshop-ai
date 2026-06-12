const { sendSuccess, sendError } = require("../../utils/response");
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
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
                    // Return the exact ID they searched for to avoid confusion
                    const reply = `I found your order #${shortId} placed on ${date}. \n\nStatus: **${matchedOrder.orderStatus}**\nTotal Price: ₹${matchedOrder.pricing?.totalPrice}\n\n${matchedOrder.orderStatus === 'Shipped' ? 'It is currently on its way!' : ''}`;
                    return sendSuccess(res, "Message processed successfully", { reply });
                } else {
                    return sendSuccess(res, "Message processed successfully", { 
                        reply: `I couldn't find any order matching #${shortId} in your account. Please double-check the Order ID and try again.` 
                    });
                }
            } else {
                // Fetch the latest order if no specific ID is provided
                const latestOrder = await Order.findOne({ user: userId }).sort({ createdAt: -1 });
                if (latestOrder) {
                    const shortId = latestOrder.paymentDetails?.razorpayOrderId || latestOrder._id.toString().slice(-8).toUpperCase();
                    return sendSuccess(res, "Message processed successfully", { 
                        reply: `Your most recent order #${shortId} is currently **${latestOrder.orderStatus}**. If you meant a different order, please provide the exact Order ID (like #123).` 
                    });
                } else {
                    return sendSuccess(res, "Message processed successfully", { 
                        reply: "It looks like you don't have any recent orders in your account yet." 
                    });
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

        // Generate AI Response using OpenAI API
        const prompt = `
            You are a helpful customer support chatbot for an e-commerce store named "SmartShop".
            Be friendly, concise, and professional.
            
            Here is the context retrieved from the database based on the user's intent:
            ---
            ${contextData}
            ---
            
            User's message: "${message}"
            
            Respond directly to the user's message based on the context provided above.
            Do not mention "database context" or "backend" in your reply to the user.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are SmartShop's customer support assistant." },
                { role: "user", content: prompt }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        const reply = completion.choices[0].message.content.trim();

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
