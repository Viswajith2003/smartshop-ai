import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ProductDetail, ProductList, ProductFilter } from '../../components/product'; 
import { categoryAPI, productAPI } from '../../services/api';
import { addToCart } from '../../features/cart/cartSlice';
import { toggleWishlist } from '../../features/wishlist/wishlistSlice';
import { toast } from 'react-toastify';
import fetchProducts from '../../hooks/useFetchProducts';
import usePagination from '../../hooks/usePagination';
import { Pagination, Loader } from '../../components/common';
import { useDispatch } from 'react-redux';

const ProductsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);
  
  const isWishlisted = (productId) => wishlistItems.some(item => item.product?._id === productId);
  const isInCart = (productId) => cartItems.some(item => (item.product?._id || item.product) === productId);
  
  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInCart(product._id)) {
      navigate('/cart');
      return;
    }
    
    dispatch(addToCart({ productId: product._id, quantity: 1, price: product.price }));
  };

  const handleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product._id));
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
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: sortBy,
        sortOrder: sortBy === 'price' ? (sortLabel.includes('High to Low') ? 'desc' : 'asc') : 'desc',
        minPrice: 0,
        maxPrice: appliedPrice,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

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

      try {
        const res = await fetchProducts(params);
        if (res?.success) {
          setProducts(res.data);
          updatePagination(res.meta);
        }
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, [pagination.page, appliedPrice, selectedCategories, selectedRating, sortBy, sortLabel, searchQuery]);

  useEffect(() => {
    resetPage();
  }, [appliedPrice, selectedCategories, selectedRating, sortBy, searchQuery]);

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

  if (isLoading && !products.length) {
    return <Loader fullScreen text="Discovering Products..." />;
  }

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-4 bg-slate-50 p-4 sm:p-8 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-80px)]">
      
      <ProductFilter 
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

      <main className="flex-grow">
        <div className="min-h-full flex flex-col">
          {selectedProduct ? (
            <ProductDetail products={selectedProduct} />
          ) : (
            <>
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Products</h1>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm px-5 py-2.5 rounded-xl flex items-center shadow-sm transition-colors"
                  >
                    {sortLabel} <i className={`bi bi-chevron-down ml-2 text-xs transition-transform ${isSortOpen ? 'rotate-180' : ''}`}></i>
                  </button>

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

              <ProductList 
                products={products}
                isWishlisted={isWishlisted}
                isInCart={isInCart}
                handleWishlist={handleWishlist}
                handleAddToCart={handleAddToCart}
              />

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

