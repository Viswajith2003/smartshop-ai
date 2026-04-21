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
        maxPrice: price,
        rating: selectedRating || 0,
      };

      if (selectedCategories.length > 0) {
        params.category = selectedCategories[0]; // Backend currently supports single category, or I can update it to support multiple
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
  }, [pagination.page, price, selectedCategories, selectedRating, sortBy, sortLabel]);

  // Reset to page 1 when filters change
  useEffect(() => {
    resetPage();
  }, [price, selectedCategories, selectedRating, sortBy]);

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
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-4 bg-[#060B19] p-4 sm:p-8 flex flex-col md:flex-row gap-6 min-h-[calc(100vh-80px)]">
      
      {/* Sidebar Filters */}
      <FilterSidebar 
        categories={categories} 
        price={price}
        setPrice={setPrice}
        selectedCategories={selectedCategories}
        handleCategoryChange={handleCategoryChange}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        handleClearAll={handleClearAll}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        <div className="bg-[#f2f5f9] rounded-2xl p-6 md:p-8 shadow-lg min-h-full flex flex-col">
          
          {selectedProduct ? (
          
            <ProductDetail products={selectedProduct} />
          ) : (
            
            <>
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Product Lists</h1>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm px-5 py-2 rounded-lg flex items-center shadow-md transition-colors"
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
                  <Link to={`/products/${product._id}`} key={product._id} className="bg-[#3b0b75] rounded-3xl overflow-hidden shadow-xl hover:-translate-y-1 transition-transform duration-300 flex flex-col group cursor-pointer">
                    {/* ... (rest of product card) */}
                    <div className="bg-white p-4 relative aspect-[4/3] flex items-center justify-center rounded-t-3xl border-b-4 border-[#3b0b75]">
                      <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        {product.stock}
                      </div>
                      <div 
                        onClick={(e) => handleWishlist(e, product)}
                        className={`absolute top-4 right-4 z-10 hover:scale-110 transition-transform ${isWishlisted(product._id) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                      >
                        <i className={`bi bi-heart${isWishlisted(product._id) ? '-fill' : ''} text-xl leading-none`}></i>
                      </div>
                      <img 
                        src={product.images && product.images[0]} 
                        alt={product.name} 
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-white font-bold text-sm mb-1 truncate">{product.name}</h3>
                      <div className="flex gap-1 mb-4">
                        {renderStars(product.rating)}
                      </div>
                      <div className="flex justify-between items-end mt-auto">
                        <div className="text-red-400 font-bold text-lg leading-none">
                          ₹{product.price?.toLocaleString()}
                        </div>
                        <button 
                          onClick={(e) => handleAddToCart(e, product)}
                          className="text-white hover:text-blue-300 transition-colors p-2"
                        >
                          <i className="bi bi-cart-plus text-xl"></i>
                        </button>
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
