import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  ArrowRight, 
  ShoppingBag, 
  Download,
  Calendar,
  CreditCard,
  MapPin
} from 'lucide-react';

const OrderConfirmationPage = () => {
    const location = useLocation();
    
    const orderData = location.state?.order;
    
    // Map backend data to the structure expected by the UI
    const orderDetails = orderData ? {
        id: orderData._id || orderData.id,
        date: new Date(orderData.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        total: orderData.pricing?.totalPrice || orderData.total,
        status: orderData.orderStatus || orderData.status,
        subtotal: orderData.pricing?.subtotal,
        shippingPrice: orderData.pricing?.shippingPrice,
        taxPrice: orderData.pricing?.taxPrice,
        discount: orderData.pricing?.discount,
        items: orderData.items,
        address: {
            fullName: orderData.shippingAddress?.fullName || orderData.address?.fullName,
            street: orderData.shippingAddress?.street || orderData.shippingAddress?.address || orderData.address?.street || orderData.address?.address,
            city: orderData.shippingAddress?.city || orderData.address?.city,
            district: orderData.shippingAddress?.district || orderData.address?.district,
            state: orderData.shippingAddress?.state || orderData.address?.state,
            pincode: orderData.shippingAddress?.pincode || orderData.address?.pincode,
            phone: orderData.shippingAddress?.phone || orderData.address?.phone
        }
    } : {
        id: 'SS-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        total: 12599,
        status: 'Confirmed',
        items: [
            { 
                product: { name: 'iPhone 15 Pro', images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=200&auto=format&fit=crop'] }, 
                price: 129999, 
                quantity: 1 
            },
            { 
                product: { name: 'AirPods Pro (2nd Gen)', images: ['https://images.unsplash.com/photo-1588423770574-d4661858546f?q=80&w=200&auto=format&fit=crop'] }, 
                price: 24900, 
                quantity: 1 
            }
        ],
        address: {
            fullName: 'Jane Smith',
            street: '456 Innovation Drive, Tech Park',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560100',
            phone: '98765 43210'
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                
                {/* Header Section */}
                <div className="text-center mb-16 animate-slide-down">
                    <div className="relative inline-block animate-scale-in">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                        <div className="relative inline-flex items-center justify-center w-28 h-28 bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-500/30 mb-8 transform hover:scale-110 transition-transform cursor-default">
                            <CheckCircle className="w-14 h-14" strokeWidth={2.5} />
                        </div>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
                        Order <span className="text-indigo-600">Confirmed!</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-lg max-w-lg mx-auto leading-relaxed">
                        Thank you for your purchase! We've received your order and we'll notify you as soon as it's out for delivery.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Order Details */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Order Summary Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-indigo-100/50 transition-colors duration-700"></div>
                            
                            <div className="relative flex flex-wrap justify-between items-end gap-6 mb-10 pb-8 border-b border-slate-50">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Order Tracking ID</p>
                                    <h3 className="text-2xl font-black text-slate-900 leading-none">#{orderDetails.id}</h3>
                                </div>
                                <button className="flex items-center gap-2.5 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95">
                                    <Download className="w-4 h-4" /> Get Invoice
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
                                <div className="flex gap-5">
                                    <div className="w-14 h-14 bg-indigo-50 rounded-[1.25rem] flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-inner">
                                        <Calendar className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Placed On</p>
                                        <p className="font-bold text-slate-800 text-lg">{orderDetails.date}</p>
                                    </div>
                                </div>

                                <div className="flex gap-5">
                                    <div className="w-14 h-14 bg-amber-50 rounded-[1.25rem] flex items-center justify-center text-amber-600 flex-shrink-0 shadow-inner">
                                        <Truck className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expected By</p>
                                        <p className="font-bold text-slate-800 text-lg">May 02, 2026</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tracking Progress */}
                            <div className="mt-12 relative">
                                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                    <span className="text-indigo-600 flex items-center gap-1.5"><CheckCircle className="w-3 h-3" /> Confirmed</span>
                                    <span>Processing</span>
                                    <span>Shipped</span>
                                    <span>Delivered</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full p-0.5">
                                    <div className="h-full w-1/4 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)] relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-indigo-600 shadow-md"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Breakdown */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                           <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-4">
                             <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
                             Items in Package
                           </h3>
                           
                           <div className="space-y-8">
                             {orderDetails.items.map((item, idx) => (
                               <div key={idx} className="flex items-center gap-6 group">
                                 <div className="w-24 h-24 bg-slate-50 rounded-3xl overflow-hidden flex-shrink-0 border border-slate-100 p-3 group-hover:border-indigo-100 transition-colors">
                                    <img 
                                        src={item.product?.images?.[0]} 
                                        alt={item.product?.name} 
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                                    />
                                 </div>
                                 <div className="flex-grow">
                                    <h4 className="font-bold text-slate-900 text-base mb-1">{item.product?.name}</h4>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="font-black text-slate-900 text-lg">₹{item.price.toLocaleString('en-IN')}</p>
                                 </div>
                               </div>
                             ))}
                           </div>

                           <div className="mt-12 pt-8 border-t border-slate-50">
                              <div className="flex flex-col gap-4 max-w-sm ml-auto">
                                  <div className="flex justify-between text-sm font-bold text-slate-400">
                                    <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                                    <span className="text-slate-800">₹{(orderDetails.subtotal || (orderDetails.total - 120)).toLocaleString('en-IN')}</span>
                                  </div>
                                  <div className="flex justify-between text-sm font-bold text-slate-400">
                                    <span className="uppercase tracking-widest text-[10px]">Shipping Fee</span>
                                    <span className={(orderDetails.shippingPrice === 0 || !orderDetails.shippingPrice) ? 'text-emerald-500 font-black' : 'text-slate-800'}>
                                        {(orderDetails.shippingPrice === 0 || !orderDetails.shippingPrice) ? 'FREE' : `₹${orderDetails.shippingPrice.toLocaleString('en-IN')}`}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm font-bold text-slate-400">
                                    <span className="uppercase tracking-widest text-[10px]">Tax (GST 18%)</span>
                                    <span className="text-slate-800">₹{(orderDetails.taxPrice || 0).toLocaleString('en-IN')}</span>
                                  </div>
                                  {orderDetails.discount > 0 && (
                                    <div className="flex justify-between text-sm font-bold text-emerald-500">
                                        <span className="uppercase tracking-widest text-[10px]">Discount Applied</span>
                                        <span>-₹{orderDetails.discount.toLocaleString('en-IN')}</span>
                                    </div>
                                  )}
                                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-base font-black text-slate-900 uppercase tracking-tighter">Grand Total</span>
                                    <span className="text-3xl font-black text-indigo-600 tracking-tighter">₹{orderDetails.total.toLocaleString('en-IN')}</span>
                                  </div>
                              </div>
                           </div>
                        </div>
                    </div>

                    {/* Right Column: Footer Actions & Sidebar */}
                    <div className="space-y-8">
                        
                        {/* Delivery Location */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                                <MapPin className="w-32 h-32 text-indigo-600" />
                            </div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-indigo-600" /> Delivery To
                            </h3>
                            <div className="space-y-3 relative z-10">
                                <p className="font-black text-slate-900 text-lg leading-tight">{orderDetails.address.fullName}</p>
                                <p className="text-sm text-slate-500 font-bold leading-relaxed mb-4">
                                    {orderDetails.address.street},<br />
                                    {orderDetails.address.city}, {orderDetails.address.state} - {orderDetails.address.pincode}
                                </p>
                                <div className="pt-2 flex items-center gap-3 text-xs font-black text-slate-400">
                                    <span className="bg-slate-50 px-2 py-1 rounded-md">MOBILE</span>
                                    <span className="text-slate-800">{orderDetails.address.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Status */}
                        <div className="bg-[#0f172a] rounded-[2.5rem] p-8 shadow-2xl text-white">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-indigo-400" /> Payment {orderData?.paymentMethod === 'COD' ? 'Details' : 'Secure'}
                            </h3>
                            <div className="flex items-center gap-5 mb-6">
                                <div className="w-16 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
                                    {orderData?.paymentMethod === 'COD' ? (
                                        <Package className="w-5 h-5 text-emerald-400" />
                                    ) : (
                                        <span className="text-[10px] font-black italic tracking-tighter opacity-80 uppercase">Secure</span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white">{orderData?.paymentMethod === 'COD' ? 'Pay on Delivery' : 'Online Payment'}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                        {orderData?.paymentMethod === 'COD' ? 'Cash / UPI at doorstep' : 'Verified via Razorpay'}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase">Status</span>
                                <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${orderData?.paymentStatus === 'Completed' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                                    {orderData?.paymentStatus || 'Pending'}
                                </span>
                            </div>
                        </div>

                        {/* Quick Navigation */}
                        <div className="space-y-4 pt-4">
                            <Link 
                                to="/products" 
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 group transform active:scale-95 uppercase tracking-[0.15em] text-[11px]"
                            >
                                Continue Shopping
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link 
                                to="/my-orders" 
                                onClick={() => dispatch(setOrderId(null))}
                                className="w-full bg-white border border-slate-200 hover:border-indigo-600 text-slate-600 hover:text-indigo-600 font-black py-5 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-3 uppercase tracking-[0.15em] text-[11px] hover:bg-indigo-50/30"
                            >
                                <ShoppingBag className="w-4 h-4" /> View My Orders
                            </Link>
                        </div>
                    </div>

                </div>

                {/* Footer Assurance */}
                <div className="mt-20 text-center pb-12">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">You're Protected</p>
                    <div className="flex justify-center items-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-900 rounded-full"></div><span className="text-xs font-black">SECURE</span></div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-900 rounded-full"></div><span className="text-xs font-black">ORIGINAL</span></div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-900 rounded-full"></div><span className="text-xs font-black">TRUSTED</span></div>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-slide-down {
                        animation: slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }
                    @keyframes scaleIn {
                        from { opacity: 0; transform: scale(0.8); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-scale-in {
                        animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    }
                `}} />
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
