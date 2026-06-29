import React from 'react';
import { Star, User, MessageSquare } from 'lucide-react';

const ProductReviews = ({ product }) => {
  return (
    <div className="mt-16 pt-16 border-t border-slate-100">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="w-full">
          <h3 className="text-2xl font-black text-slate-900 mb-2">Customer Reviews</h3>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1 text-amber-500 font-black text-xl">
              <Star className="w-6 h-6 fill-amber-500" />
              {product.rating?.toFixed(1) || '0.0'}
            </div>
            <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">
              Based on {product.numReviews || 0} reviews
            </span>
          </div>
        </div>

        {/* Reviews List Section */}
        <div className="w-full">
          <div className="space-y-6">
            {!product.reviews || product.reviews.length === 0 ? (
              <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No reviews yet.</p>
              </div>
            ) : (
              product.reviews.map((review, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-50 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:scale-110 transition-transform">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="text-sm font-black text-slate-900">{review.name}</h5>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-black text-amber-600">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed text-sm italic pl-16">
                    "{review.comment}"
                  </p>
                </div>
              )).reverse()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
