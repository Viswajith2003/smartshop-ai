import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { productAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { Star, User, Send, MessageSquare } from 'lucide-react';

const ProductReviews = ({ product, onReviewAdded }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.warning('Please enter a comment');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await productAPI.addReview(product._id, { rating, comment });
      if (res.success) {
        toast.success('Review submitted successfully!');
        setComment('');
        setRating(5);
        if (onReviewAdded) onReviewAdded(res.data); // Update parent state with new product data
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-slate-100">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Review Submission Section */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Customer Reviews</h3>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1 text-amber-500 font-black text-xl">
                <Star className="w-6 h-6 fill-amber-500" />
                {product.rating?.toFixed(1) || '0.0'}
              </div>
              <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                Based on {product.numReviews || 0} reviews
              </span>
            </div>

            {isAuthenticated ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  Leave a Review
                </h4>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="transition-transform active:scale-90"
                        >
                          <Star 
                            className={`w-8 h-8 ${
                              star <= (hoveredStar || rating) 
                                ? 'text-amber-400 fill-amber-400' 
                                : 'text-slate-200'
                            } transition-colors`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Your Thoughts</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all min-h-[120px] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Post Review
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-slate-200 text-center">
                <p className="text-slate-500 font-bold text-sm mb-4">Please log in to share your thoughts on this product.</p>
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline"
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews List Section */}
        <div className="flex-grow">
          <div className="space-y-6">
            {!product.reviews || product.reviews.length === 0 ? (
              <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No reviews yet. Be the first to review!</p>
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
