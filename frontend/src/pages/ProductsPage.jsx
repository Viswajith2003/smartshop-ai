import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FilterSidebar, ProductDetail } from '../components/ui';
import { categoryAPI, productAPI } from '../utils/api';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { toast } from 'react-toastify';
import fetchProducts from '../hooks/useFetchProducts';
import usePagination from '../hooks/usePagination';
import { Pagination } from '../components/ui';



const ProductsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  
  const isWishlisted = (productId) => wishlistItems.some(item => item._id === productId);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    if (isWishlisted(product._id)) {
        toast.info(`Removed ${product.name} from wishlist`);
    } else {
        toast.success(`Added ${product.name} to wishlist`);
    }
  };
  const [price, setPrice] = useState(300000);
  const [appliedPrice, setAppliedPrice] = useState(300000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortLabel, setSortLabel] = useState('Default');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const { pagination, handlePageChange, updatePagination, resetPage } = usePagination(6);

  const handleCategoryChange = (catId) => {
    setSelectedCategories(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const handleClearAll = () => {
    setPrice(300000);
    setAppliedPrice(300000);
    setSelectedCategories([]);
    setSelectedRating(null);
  };

  // Effect to fetch products when filters or page change
  useEffect(() => {
    const getProducts = async () => {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: sortBy,
        sortOrder: sortBy === 'price' ? (sortLabel.includes('High to Low') ? 'desc' : 'asc') : 'desc',
        minPrice: 0,
        maxPrice: appliedPrice,
      };

      if (selectedRating !== null) {
        params.rating = selectedRating;
      }

      if (selectedCategories.length > 0) {
        params.category = selectedCategories.join(',');
      }

      if (sortBy === 'Highest Rated') {
        params.sortBy = 'rating';
        params.sortOrder = 'desc';
      }

      const res = await fetchProducts(params);
      if (res?.success) {
        setProducts(res.data);
        updatePagination(res.meta);
      }
    };
    getProducts();
  }, [pagination.page, appliedPrice, selectedCategories, selectedRating, sortBy, sortLabel]);

  // Reset to page 1 when filters change
  useEffect(() => {
    resetPage();
  }, [appliedPrice, selectedCategories, selectedRating, sortBy]);

  // Categories fetch on mount
  useEffect(() => {
    const fetchCategroiesItems = async () => {
      try {
        const res = await categoryAPI.getCategories();
        if (res.success) {
          setCategories(res.data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategroiesItems();
  }, []);




  const sortOptions = [
    'Default',
    'Price: Low to High',
    'Price: High to Low',
    'Highest Rated',
  ];

  const selectedProduct = id ? products.find(p => p._id === id) : null;

  // Helper to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<i key={i} className="bi bi-star-fill text-yellow-400 text-sm"></i>);
        } else if (i - 0.5 <= rating) {
            stars.push(<i key={i} className="bi bi-star-half text-yellow-400 text-sm"></i>);
        } else {
            stars.push(<i key={i} className="bi bi-star text-yellow-400 text-sm"></i>);
        }
    }
    return stars;
  };

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-4 bg-slate-50 p-4 sm:p-8 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-80px)]">
      
      {/* Sidebar Filters */}
      <FilterSidebar 
        categories={categories} 
        price={price}
        setPrice={setPrice}
        setAppliedPrice={setAppliedPrice}
        selectedCategories={selectedCategories}
        handleCategoryChange={handleCategoryChange}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        handleClearAll={handleClearAll}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        <div className="min-h-full flex flex-col">
          
          {selectedProduct ? (
          
            <ProductDetail products={selectedProduct} />
          ) : (
            
            <>
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Product Lists</h1>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm px-5 py-2.5 rounded-xl flex items-center shadow-sm transition-colors"
                  >
                    {sortLabel} <i className={`bi bi-chevron-down ml-2 text-xs transition-transform ${isSortOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {/* Dropdown Menu */}
                  {isSortOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden transform origin-top-right transition-all z-50">
                      <ul className="py-2">
                        {sortOptions.map((option) => (
                          <li 
                            key={option}
                            onClick={() => { 
                              setSortLabel(option); 
                              if(option === 'Default') setSortBy('createdAt');
                              if(option.includes('Price')) setSortBy('price');
                              if(option === 'Highest Rated') setSortBy('rating');
                              setIsSortOpen(false); 
                            }}
                            className={`px-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between
                              ${sortLabel === option 
                                ? 'bg-blue-50 text-blue-600 font-bold border-l-4 border-blue-500' 
                                : 'text-slate-700 hover:bg-slate-50 border-l-4 border-transparent'
                              }`}
                          >
                            {option}
                            {sortLabel === option && <i className="bi bi-check text-lg leading-none"></i>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 flex-grow">
                {products.length > 0 ? products.map((product) => (
                  <Link 
                    to={product.isActive === false ? '#' : `/products/${product._id}`} 
                    key={product._id} 
                    onClick={(e) => { if(product.isActive === false) e.preventDefault() }}
                    className={`bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] flex flex-col group ${product.isActive === false ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] transition-all duration-500 cursor-pointer'}`}
                  >
                    <div className="bg-slate-50/50 p-8 relative aspect-square flex items-center justify-center overflow-hidden">
                      {product.isActive === false && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-sm">
                          <span className="bg-slate-900 text-white font-black tracking-widest px-6 py-2 text-xs rounded-xl shadow-2xl transform -rotate-12 border-2 border-slate-800">UNAVAILABLE</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full shadow-sm border border-slate-200 uppercase">
                        {product.stock} Left
                      </div>
                      <div 
                        onClick={(e) => {
                          if(product.isActive === false) { e.preventDefault(); return; }
                          handleWishlist(e, product);
                        }}
                        className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform ${isWishlisted(product._id) ? 'text-pink-500' : 'text-slate-300 hover:text-pink-500'} ${product.isActive === false ? 'hidden' : ''}`}
                      >
                        <i className={`bi bi-heart${isWishlisted(product._id) ? '-fill' : ''} text-sm mt-0.5`}></i>
                      </div>
                      <img 
                        src={product.images && product.images[0]} 
                        alt={product.name} 
                        className={`max-h-full max-w-full object-contain filter drop-shadow-xl transition-transform duration-700 ${product.isActive !== false && 'group-hover:scale-110 group-hover:-rotate-2'}`}
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow relative bg-white">
                      <div className="flex gap-1 mb-3">
                        {renderStars(product.rating)}
                      </div>
                      <h3 className="text-slate-800 font-extrabold text-lg leading-tight mb-4 line-clamp-2">{product.name}</h3>
                      <div className="flex justify-between items-end mt-auto pt-4 border-t border-slate-100">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Price</span>
                          <div className={`font-black text-2xl tracking-tighter ${product.isActive === false ? 'text-slate-400' : 'text-slate-900'}`}>
                            ₹{product.price?.toLocaleString()}
                          </div>
                        </div>
                        {product.isActive !== false && (
                          <button 
                            onClick={(e) => handleAddToCart(e, product)}
                            className="bg-black hover:bg-blue-600 text-white transition-colors duration-300 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transform"
                          >
                            <i className="bi bi-cart-plus-fill text-xl"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>
                )) : (
                  <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-400 font-bold">
                    <i className="bi bi-search text-4xl mb-4 opacity-20"></i>
                    No products found matching your filters.
                  </div>
                )}
              </div>

              {pagination.totalPages > 0 && (
                <Pagination pagination={pagination} onPageChange={handlePageChange} />
              )}
            </>
          )}
        </div>
      </main>

    </div>
  );
};

export default ProductsPage;
