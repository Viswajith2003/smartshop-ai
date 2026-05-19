import React, { useState, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleWishlist } from '../../features/wishlist/wishlistSlice';
import { addToCart } from '../../features/cart/cartSlice';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import fetchProducts from '../../hooks/useFetchProducts';
import { categoryAPI, couponAPI } from '../../services/api';
import { toast } from 'react-toastify';

const GRADIENTS = [
    'from-orange-500 to-yellow-500',
    'from-indigo-600 to-indigo-400',
    'from-red-600 to-pink-500',
    'from-purple-600 to-indigo-500',
    'from-emerald-600 to-teal-500',
    'from-cyan-500 to-blue-600'
];

// Premium E-commerce Banner Images (Unsplash)
const BANNERS = [
    {
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000&h=800',
        tag: 'Tech Innovations',
        title: 'Next-Gen\nElectronics',
        subtitle: 'Upgrade your lifestyle with premium tech',
        btnText: 'Explore Tech'
    },
    {
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000&h=800',
        tag: 'Lifestyle & Care',
        title: 'Minimalist\nEssentials',
        subtitle: 'Curated additions for your home & life',
        btnText: 'View Essentials'
    },
    {
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000&h=800',
        tag: 'Spring Collection',
        title: 'Refresh Your\nWardrobe',
        subtitle: 'Discover the latest trends with up to 40% off',
        btnText: 'Shop Fashion'
    }
];


// Dynamic offers loaded from backend

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
        <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden rounded-2xl mt-6 group shadow-lg">
            {BANNERS.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                >
                    <img src={slide.image} alt={`Banner ${index}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent flex items-center px-12 md:px-20">
                         <div className="max-w-md space-y-4">
                            <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-1 rounded-lg uppercase tracking-widest">{slide.tag}</span>
                            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight whitespace-pre-line">{slide.title}</h2>
                            <p className="text-white/80 text-sm font-bold uppercase tracking-widest">{slide.subtitle}</p>
                            <button className="bg-white text-slate-900 font-black px-8 py-4 rounded-xl hover:bg-slate-100 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs mt-4">
                                {slide.btnText}
                            </button>
                         </div>
                    </div>
                </div>
            ))}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
                {BANNERS.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${index === current ? 'bg-white w-12' : 'bg-white/30 w-3 hover:bg-white/50'}`}
                    />
                ))}
            </div>
            
            {/* Nav Arrows */}
            <button 
                onClick={() => setCurrent((current - 1 + BANNERS.length) % BANNERS.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all"
            >
                <i className="bi bi-chevron-left text-2xl"></i>
            </button>
            <button 
                onClick={() => setCurrent((current + 1) % BANNERS.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all"
            >
                <i className="bi bi-chevron-right text-2xl"></i>
            </button>
        </div>
    );
};

const SectionHeader = ({ title, linkText = 'View All', to = '#' }) => (
    <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{title}</h2>
        <Link to={to} className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors flex items-center group">
            {linkText} <i className="bi bi-arrow-right-short text-2xl ml-1 group-hover:translate-x-1 transition-transform"></i>
        </Link>
    </div>
);

const HomePage = memo(() => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: wishlistItems } = useSelector((state) => state.wishlist);
    const { items: cartItems } = useSelector((state) => state.cart);

    const isWishlisted = (productId) => wishlistItems.some(item => item.product?._id === productId);
    const isInCart = (productId) => cartItems.some(item => (item.product?._id || item.product) === productId);

    const handleWishlist = (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleWishlist(productId));
    };

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInCart(product._id)) {
            navigate('/cart');
            return;
        }
        dispatch(addToCart({ productId: product._id, quantity: 1, price: product.price }));
    };

    const [products,setProducts]=useState([])
    const [categories,setCategories]=useState([])
    const [coupons, setCoupons] = useState([])

    const handleCopyCode = (e, code) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        toast.success(`Coupon code "${code}" copied to clipboard!`);
    };

    useEffect(() => {
        fetchProducts().then((res) => {
            if (res?.success) {
                setProducts(res.data)
            }
        })
    }, [])

    useEffect(()=>{
        const fetchCategories = async () => {
            try {
                const res = await categoryAPI.getCategories();
                if(res.success){
                    setCategories(res.data)
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        fetchCategories();
    },[])

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res = await couponAPI.getCoupons({ limit: 12 });
                if (res.success) {
                    // Only show active and unexpired coupons
                    const activeCoupons = (res.data || res.coupons || []).filter(
                        c => c.isActive && new Date(c.validUntil) > new Date()
                    );
                    setCoupons(activeCoupons);
                }
            } catch (error) {
                console.error("Error fetching coupons:", error);
            }
        };
        fetchCoupons();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="w-full pb-20">
                
                {/* Section 1: Banner Carousel */}
                <BannerCarousel />

                {/* Section 2: Shop by Category */}
                <section className="mt-20">
                    <SectionHeader title="Shop by Category" to="/products" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.slice(0, 4).map((cat) => {
                            const style = { icon: 'bi-grid-fill', color: 'from-indigo-600 to-indigo-400', bg: 'bg-indigo-50' };
                            return (
                                <div key={cat._id} className="relative group overflow-hidden bg-white rounded-2xl p-8 border border-slate-100 hover:border-indigo-100 transition-all duration-500 cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.1)] hover:-translate-y-2">
                                    <div className={`absolute -right-10 -top-10 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${style.color}`}></div>
                                    
                                    <div className={`w-16 h-16 rounded-2xl ${style.bg} flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 shadow-sm border border-indigo-100/50`}>
                                        <i className={`bi ${style.icon} text-3xl bg-gradient-to-br ${style.color} bg-clip-text text-transparent`}></i>
                                    </div>
                                    
                                    <div className="space-y-1 relative z-10">
                                        <h3 className="text-slate-800 font-black text-xl tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{cat.name}</h3>
                                        <div className="flex items-center space-x-2">
                                            <span className="h-1 w-8 bg-indigo-500 rounded-full transition-all duration-500 group-hover:w-12"></span>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Explore Collection</p>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                        <i className="bi bi-arrow-right text-indigo-600 text-2xl"></i>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Section 3: Featured Products */}
                <section className="mt-20">
                    <SectionHeader title="Featured Products" to="/products" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.slice(0, 4).map((prod) => (
                            <Link to={`/products/${prod._id}`} key={prod._id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 group transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.12)] hover:-translate-y-2 relative flex flex-col cursor-pointer">
                                {prod.tag && <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-lg z-20 shadow-sm">{prod.tag}</span>}
                                <button 
                                    onClick={(e) => handleWishlist(e, prod._id)} 
                                    className={`absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center transition-all shadow-sm hover:scale-110 ${isWishlisted(prod._id) ? 'text-pink-500' : 'text-slate-300 hover:text-pink-500'}`}
                                >
                                    <i className={`bi bi-heart${isWishlisted(prod._id) ? '-fill' : ''} text-lg mt-0.5`}></i>
                                </button>
                                <div className="h-72 bg-slate-50/50 overflow-hidden flex items-center justify-center p-8 relative">
                                    <img src={prod.images && prod.images[0]} alt={prod.name} className="w-full h-full object-contain filter drop-shadow-xl transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2 z-10" />
                                </div>
                                <div className="p-8 bg-white flex flex-col flex-grow relative">
                                    <div className="flex text-amber-400 mb-3">
                                        {[...Array(Math.round(prod.rating || 0))].map((_, i) => (
                                            <i key={i} className="bi bi-star-fill text-sm mr-1"></i>
                                        ))}
                                    </div>
                                    <h3 className="text-slate-800 font-extrabold text-lg leading-tight mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2">{prod.name}</h3>
                                    <div className="flex justify-between items-end mt-auto pt-4 border-t border-slate-50">
                                        <div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Price</span>
                                            <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{prod.price?.toLocaleString()}</span>
                                        </div>
                                            <button 
                                                onClick={(e) => handleAddToCart(e, prod)} 
                                                className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95 group-hover:-translate-y-1 ${isInCart(prod._id) ? 'bg-indigo-600' : 'bg-black hover:bg-indigo-600'}`}
                                                title={isInCart(prod._id) ? "View in Cart" : "Add to Cart"}
                                            >
                                                <i className={`bi ${isInCart(prod._id) ? 'bi-bag-check-fill' : 'bi-cart-plus-fill'} text-xl text-white`}></i>
                                            </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>                {/* Section 4: Exclusive Offers */}
                <section className="mt-20 animate-in fade-in slide-in-from-bottom duration-700">
                    <SectionHeader title="Exclusive Offers" linkText="All Coupons" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coupons.length > 0 ? (
                            coupons.map((coupon, index) => {
                                const gradient = GRADIENTS[index % GRADIENTS.length];
                                const discountLabel = coupon.discountType === 'percentage' 
                                    ? `${coupon.discountValue}% OFF` 
                                    : `₹${coupon.discountValue} OFF`;
                                const capLabel = coupon.discountType === 'percentage' && coupon.maxDiscountAmount > 0
                                    ? `UP TO ₹${coupon.maxDiscountAmount}`
                                    : `FLAT DISCOUNT`;
                                return (
                                    <div 
                                        key={coupon._id} 
                                        onClick={(e) => handleCopyCode(e, coupon.code)}
                                        className={`bg-gradient-to-br ${gradient} p-8 rounded-2xl shadow-xl relative overflow-hidden group hover:-translate-y-2 transition-all cursor-pointer`}
                                    >
                                        <div className="absolute -right-4 -bottom-4 bg-white/20 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                        <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
                                            <div>
                                                <div className="flex justify-between items-start mb-6">
                                                    <span className="text-white font-black text-2xl tracking-tighter drop-shadow-md">
                                                        {discountLabel}
                                                    </span>
                                                    <i className="bi bi-gift text-3xl text-white/40 group-hover:text-white group-hover:rotate-12 group-hover:scale-110 transition-all duration-500"></i>
                                                </div>
                                                <p className="text-white font-bold text-xs uppercase tracking-wider mb-2">
                                                    Code: <span className="bg-white/25 px-2 py-0.5 rounded text-white font-black">{coupon.code}</span>
                                                </p>
                                                <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mb-4">
                                                    Min Order: ₹{coupon.minPurchaseAmount} | {capLabel}
                                                </p>
                                            </div>
                                            <button 
                                                className="w-full bg-white/20 hover:bg-white text-white hover:text-slate-900 text-[10px] font-extrabold px-4 py-3 rounded-lg backdrop-blur-md transition-all uppercase tracking-widest text-center shadow-sm"
                                            >
                                                Copy Code
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            [
                                { code: 'WELCOME200', discountType: 'fixed', discountValue: 200, minPurchaseAmount: 1000, maxDiscountAmount: 0 },
                                { code: 'FESTIVE15', discountType: 'percentage', discountValue: 15, minPurchaseAmount: 1500, maxDiscountAmount: 300 },
                                { code: 'SUPERFLAT500', discountType: 'fixed', discountValue: 500, minPurchaseAmount: 3000, maxDiscountAmount: 0 },
                                { code: 'QUICK25', discountType: 'percentage', discountValue: 25, minPurchaseAmount: 800, maxDiscountAmount: 200 }
                            ].map((coupon, index) => {
                                const gradient = GRADIENTS[index % GRADIENTS.length];
                                const discountLabel = coupon.discountType === 'percentage' 
                                    ? `${coupon.discountValue}% OFF` 
                                    : `₹${coupon.discountValue} OFF`;
                                const capLabel = coupon.discountType === 'percentage' && coupon.maxDiscountAmount > 0
                                    ? `UP TO ₹${coupon.maxDiscountAmount}`
                                    : `FLAT DISCOUNT`;
                                return (
                                    <div 
                                        key={coupon.code} 
                                        onClick={(e) => handleCopyCode(e, coupon.code)}
                                        className={`bg-gradient-to-br ${gradient} p-8 rounded-2xl shadow-xl relative overflow-hidden group hover:-translate-y-2 transition-all cursor-pointer`}
                                    >
                                        <div className="absolute -right-4 -bottom-4 bg-white/20 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                        <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
                                            <div>
                                                <div className="flex justify-between items-start mb-6">
                                                    <span className="text-white font-black text-2xl tracking-tighter drop-shadow-md">
                                                        {discountLabel}
                                                    </span>
                                                    <i className="bi bi-gift text-3xl text-white/40 group-hover:text-white group-hover:rotate-12 group-hover:scale-110 transition-all duration-500"></i>
                                                </div>
                                                <p className="text-white font-bold text-xs uppercase tracking-wider mb-2">
                                                    Code: <span className="bg-white/25 px-2 py-0.5 rounded text-white font-black">{coupon.code}</span>
                                                </p>
                                                <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mb-4">
                                                    Min Order: ₹{coupon.minPurchaseAmount} | {capLabel}
                                                </p>
                                            </div>
                                            <button 
                                                className="w-full bg-white/20 hover:bg-white text-white hover:text-slate-900 text-[10px] font-extrabold px-4 py-3 rounded-lg backdrop-blur-md transition-all uppercase tracking-widest text-center shadow-sm"
                                            >
                                                Copy Code
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* Section 5: Happy Customers */}
                <section className="mt-20">
                    <SectionHeader title="Happy Customers" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {REVIEWS.map((rev) => (
                            <div key={rev.id} className="bg-white p-10 rounded-2xl border border-slate-100 relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform">
                                <i className="bi bi-quote text-6xl text-slate-100 absolute top-8 right-10"></i>
                                <div className="flex text-amber-400 mb-6 relative z-10">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className="bi bi-star-fill text-lg mr-1"></i>
                                    ))}
                                </div>
                                <p className="text-slate-600 text-sm italic leading-relaxed mb-8 relative z-10">"{rev.comment}"</p>
                                <div className="flex items-center space-x-4 pt-6 border-t border-slate-50">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg">
                                        {rev.avatar}
                                    </div>
                                    <div>
                                        <h4 className="text-slate-800 text-base font-black tracking-tight">{rev.name}</h4>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">{rev.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>

        </div>
    );
});

HomePage.displayName = 'HomePage';
export default HomePage;
