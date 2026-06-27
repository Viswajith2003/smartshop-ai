import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import api from '../../services/axiosInstance'; // Using the standard configured axios instance
import { API_CONFIG } from '../../config/app';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello there! 👋 I'm your friendly SmartShop AI Assistant. How can I brighten your day? ✨ You can ask about your order status (e.g., 'Check order #123') or simply ask me any questions you have!", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        return `${API_CONFIG.baseURL.replace('/api', '')}${imagePath}`;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
        setIsLoading(true);

        try {
            const response = await api.post('/chatbot/message', { message: userMessage });
            
            if (response.data && response.data.data && response.data.data.reply) {
                setMessages(prev => [...prev, { text: response.data.data.reply, isBot: true }]);
            } else {
                setMessages(prev => [...prev, { text: "Sorry, I couldn't understand the response.", isBot: true }]);
            }
        } catch (error) {
            console.error("Chatbot API Error:", error);
            setMessages(prev => [...prev, { text: "I'm having trouble connecting right now. Please try again later.", isBot: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chatbot Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                    aria-label="Open chat"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            )}

            {/* Chatbot Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-[400px] sm:w-[500px] h-[600px] max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
                    {/* Header */}
                    <div className="bg-[#2b0475] p-4 flex items-center justify-between text-white shrink-0 rounded-t-2xl border-b-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#411b93] w-10 h-10 rounded-xl flex items-center justify-center shadow-inner border border-white/5 text-yellow-400">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[15px] tracking-wide">SmartShop ChatBot</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                                    <p className="text-[10px] text-white/90 uppercase tracking-widest font-bold">Online</p>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-white space-y-5">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 fade-in duration-200`}>
                                <div className={`flex gap-3 max-w-[85%] ${msg.isBot ? 'flex-row items-start' : 'flex-row-reverse items-center'}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.isBot ? 'bg-white border border-slate-200' : 'bg-[#2b0475] text-white'}`}>
                                        {msg.isBot ? (
                                            <Bot className="w-6 h-6 text-yellow-500" />
                                        ) : user?.avatar ? (
                                            <img src={getImageUrl(user.avatar)} alt="User" className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <User className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div className={`px-5 py-3.5 rounded-2xl text-[15px] ${msg.isBot ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm leading-relaxed' : 'bg-[#2b0475] text-white rounded-br-none shadow-md'}`}>
                                        <span onClick={(e) => {
                                            if(e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('/')) {
                                                e.preventDefault();
                                                const path = e.target.getAttribute('href');
                                                navigate(path);
                                                setIsOpen(false); // Optionally close the chatbot when navigating
                                            }
                                        }} dangerouslySetInnerHTML={{ 

                                            __html: msg.text
                                                .replace(/&/g, "&amp;")
                                                .replace(/</g, "&lt;")
                                                .replace(/>/g, "&gt;")
                                                .replace(/"/g, "&quot;")
                                                .replace(/'/g, "&#039;")
                                                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#2b0475] font-bold bg-[#2b0475]/10 px-1.5 py-0.5 rounded-md border border-[#2b0475]/20">$1</strong>')
                                                .replace(/\[(.*?)\]\((.*?)\)/g, '<br><a href="$2" class="inline-block mt-3 px-4 py-2 bg-[#2b0475] text-white rounded-xl text-sm font-semibold hover:bg-[#411b93] transition-colors shadow-sm text-center">$1</a>')
                                                .replace(/\n/g, '<br />') 
                                        }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-3 max-w-[85%] flex-row items-start">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                        <Bot className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <div className="px-5 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-[#2b0475]" />
                                        <span className="text-sm text-slate-400">Typing...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-5 bg-white shrink-0 flex flex-col items-center">
                        <form onSubmit={handleSend} className="flex gap-3 w-full">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-white border border-slate-200 rounded-full px-5 py-3.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#2b0475]/20 focus:border-[#2b0475] transition-all"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-[#9086c8] text-white p-3.5 rounded-2xl hover:bg-[#7b71af] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 shadow-sm"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Powered by SmartShop</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
