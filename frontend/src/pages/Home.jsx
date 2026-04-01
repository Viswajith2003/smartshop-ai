import React, { useState, useEffect, memo } from 'react';
import { Navbar, Footer } from '../components/ui';

// Banner Images (Generated)
const BANNERS = [
    '/home/tufa15/.gemini/antigravity/brain/7efec2d0-a3fb-4c75-a84f-77ca72d56356/ecommerce_banner_1_1775041929647.png',
    '/home/tufa15/.gemini/antigravity/brain/7efec2d0-a3fb-4c75-a84f-77ca72d56356/ecommerce_banner_2_1775041946701.png',
    '/home/tufa15/.gemini/antigravity/brain/7efec2d0-a3fb-4c75-a84f-77ca72d56356/ecommerce_banner_3_1775041964462.png'
];

const CATEGORIES = [
    { id: 1, name: 'Mobiles', icon: 'bi-phone', count: '20+ items', color: 'bg-blue-50' },
    { id: 2, name: 'Laptops', icon: 'bi-laptop', count: '15+ items', color: 'bg-green-50' },
    { id: 3, name: 'Home', icon: 'bi-speaker', count: '50+ items', color: 'bg-orange-50' },
    { id: 4, name: 'Fashion', icon: 'bi-bag-heart', count: '100+ items', color: 'bg-pink-50' }
];

const PRODUCTS = [
    { id: 1, name: 'Apple Watch Ultra 2 (GPS)', price: '₹74,999', rating: 5, image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=300&h=300', tag: '20% OFF' },
    { id: 2, name: 'Noise Quantum Pro 3', price: '₹14,999', rating: 5, image: 'https://images.unsplash.com/photo-1546435770-a3e426da473b?auto=format&fit=crop&q=80&w=300&h=300', tag: 'HOT' },
    { id: 3, name: 'Samsung Galaxy S24 Ultra', price: '₹1,24,999', rating: 5, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=300&h=300', tag: 'NEW' }
];

const OFFERS = [
    { id: 1, title: 'SAVE 20', desc: 'EXTRA 20% DISCOUNT', icon: 'bi-gift', color: 'from-orange-500 to-yellow-500' },
    { id: 2, title: 'FIRST 100', desc: '1ST 100 CUSTOMERS', icon: 'bi-rocket-takeoff', color: 'from-indigo-600 to-blue-400' },
    { id: 3, title: 'FLASH 25', desc: 'LIMITES TIME DEAL', icon: 'bi-lightning-charge', color: 'from-red-600 to-pink-500' },
    { id: 4, title: 'SAVE 30', desc: 'OFF ON ALL JEANS', icon: 'bi-bag-check', color: 'from-purple-600 to-indigo-500' }
];

const REVIEWS = [
    { id: 1, name: 'Alex Cooper', date: 'Oct 12, 2024', comment: 'The product quality exceeded my expectations. Fast delivery and great support! Highly recommended for everyone.', avatar: 'AC' },
    { id: 2, name: 'Mila Kunis', date: 'Sep 28, 2024', comment: 'Absolutely love the new collection. The items are so unique and well-crafted. Will definitely shop again.', avatar: 'MK' },
    { id: 3, name: 'Ryan Gosling', date: 'Sep 15, 2024', comment: 'Competitive prices and an amazing selection of tech gadgets. The UI of the app is very smooth as well.', avatar: 'RG' }
];

const BannerCarousel = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % BANNERS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden rounded-3xl mt-6">
            {BANNERS.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img src={img} alt={`Banner ${index}`} className="w-full h-full object-cover" />
                </div>
            ))}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {BANNERS.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${index === current ? 'bg-white w-8' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
};

const SectionHeader = ({ title, linkText = 'View All' }) => (
    <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
        <a href="#" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center">
            {linkText} <i className="bi bi-arrow-right-short text-xl ml-1"></i>
        </a>
    </div>
);

const Home = memo(() => {
    return (
        <div className="min-h-screen bg-[#020c1b]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                
                {/* Section 1: Banner Carousel */}
                <BannerCarousel />

                {/* Section 2: Shop by Category */}
                <section className="mt-20">
                    <SectionHeader title="Shop by Category" linkText="All Categories" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {CATEGORIES.map((cat) => (
                            <div key={cat.id} className="bg-[#051630] p-8 rounded-[2rem] border border-white/5 hover:border-indigo-500/50 transition-all group flex flex-col items-center cursor-pointer shadow-xl hover:-translate-y-2">
                                <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg`}>
                                    <i className={`bi ${cat.icon} text-3xl text-indigo-900 font-bold`}></i>
                                </div>
                                <h3 className="text-white font-black text-lg">{cat.name}</h3>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">{cat.count}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 3: Featured Products */}
                <section className="mt-20">
                    <SectionHeader title="Featured Products" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PRODUCTS.map((prod) => (
                            <div key={prod.id} className="bg-[#051630] rounded-[2.5rem] overflow-hidden border border-white/5 group hover:border-indigo-500/30 transition-all shadow-2xl relative">
                                <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full z-10">{prod.tag}</span>
                                <button className="absolute top-4 right-4 text-white/50 hover:text-red-500 transition-colors z-10 bg-black/20 p-2 rounded-full backdrop-blur-sm">
                                    <i className="bi bi-heart text-xl"></i>
                                </button>
                                <div className="h-64 bg-white/5 overflow-hidden flex items-center justify-center p-8 group-hover:p-4 transition-all">
                                    <img src={prod.image} alt={prod.name} className="w-full h-full object-contain mix-blend-lighten transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <div className="p-8 bg-gradient-to-t from-indigo-900/50 to-transparent">
                                    <div className="flex text-yellow-400 mb-2">
                                        {[...Array(prod.rating)].map((_, i) => (
                                            <i key={i} className="bi bi-star-fill text-xs mr-1"></i>
                                        ))}
                                    </div>
                                    <h3 className="text-white font-bold text-lg leading-tight mb-2 group-hover:text-indigo-400 transition-colors">{prod.name}</h3>
                                    <div className="flex justify-between items-center mt-6">
                                        <span className="text-2xl font-black text-white">{prod.price}</span>
                                        <button className="bg-white text-black h-12 w-12 rounded-2xl flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all shadow-lg active:scale-95">
                                            <i className="bi bi-cart-plus text-xl"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 4: Exclusive Offers */}
                <section className="mt-20">
                    <SectionHeader title="Exclusive Offers" linkText="All Coupons" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {OFFERS.map((offer) => (
                            <div key={offer.id} className={`bg-gradient-to-br ${offer.color} p-8 rounded-[2rem] shadow-xl relative overflow-hidden group hover:-rotate-2 transition-all cursor-pointer`}>
                                <div className="absolute -right-4 -bottom-4 bg-white/10 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="text-white font-black text-2xl tracking-tighter">{offer.title}</span>
                                        <i className={`bi ${offer.icon} text-3xl text-white/40 group-hover:text-white group-hover:scale-110 transition-all`}></i>
                                    </div>
                                    <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mb-4">{offer.desc}</p>
                                    <button className="bg-black/20 hover:bg-black/40 text-white text-[10px] font-extrabold px-4 py-2 rounded-xl backdrop-blur-md transition-colors uppercase tracking-widest">
                                        Copy Code
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 5: Happy Customers */}
                <section className="mt-20">
                    <SectionHeader title="Happy Customers" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {REVIEWS.map((rev) => (
                            <div key={rev.id} className="bg-[#051630] p-10 rounded-[3rem] border border-white/5 relative shadow-2xl">
                                <i className="bi bi-quote text-6xl text-indigo-500 absolute top-8 right-10 opacity-10"></i>
                                <div className="flex text-yellow-500 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className="bi bi-star-fill text-lg mr-1"></i>
                                    ))}
                                </div>
                                <p className="text-gray-400 text-sm italic leading-relaxed mb-8">"{rev.comment}"</p>
                                <div className="flex items-center space-x-4 border-t border-white/5 pt-6">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg">
                                        {rev.avatar}
                                    </div>
                                    <div>
                                        <h4 className="text-white text-base font-black tracking-tight">{rev.name}</h4>
                                        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mt-0.5">{rev.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>

            <Footer />
        </div>
    );
});

Home.displayName = 'Home';
export default Home;
