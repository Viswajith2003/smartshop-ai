import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FilterSidebar, ProductDetail } from '../components/ui';

const dummyCategories = [
  { id: 1, name: 'Electronics', count: 125 },
  { id: 2, name: 'Fashion', count: 60 },
  { id: 3, name: 'Home & Kitchen', count: 50 },
  { id: 4, name: 'Beauty', count: 75 },
];

const loremDescription = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr.\nConsetetur sadipscing elitr, sed diam nonumy eirmod.\nSuspendisse ultrices mauris diam\nDonec nunc nunc, gravida vitae diam vel, varius\ninterdum erat. Quisque a nunc vel diam auctor";

const dummyProducts = [
  {
    id: 1,
    name: 'Galaxy S24 Ultra',
    subtitle: 'SM-S928B • Titanium Violet • 256GB',
    description: loremDescription,
    ratingCount: '3,841',
    price: '1,04,999',
    originalPrice: '1,39,999',
    discount: '25',
    discountLabel: '15%',
    rating: 4.7,
    image: 'https://via.placeholder.com/400x500?text=Galaxy+S24+Ultra',
  },
  {
    id: 2,
    name: 'Apple Watch Ultra 2 GPS',
    subtitle: 'Titanium Case with Alpine Loop',
    description: loremDescription,
    ratingCount: '1,240',
    price: '42,999',
    originalPrice: '57,332',
    discount: '25',
    discountLabel: '25%',
    rating: 4.5,
    image: 'https://via.placeholder.com/400x500?text=Apple+Watch',
  },
  {
    id: 3,
    name: 'Apple Watch Ultra 2 GPS',
    subtitle: 'Titanium Case with Alpine Loop',
    description: loremDescription,
    ratingCount: '1,240',
    price: '42,999',
    originalPrice: '57,332',
    discount: '25',
    discountLabel: '25%',
    rating: 4,
    image: 'https://via.placeholder.com/400x500?text=Apple+Watch',
  },
  {
    id: 4,
    name: 'Apple Watch Ultra 2 GPS',
    subtitle: 'Titanium Case with Alpine Loop',
    description: loremDescription,
    ratingCount: '1,240',
    price: '42,999',
    originalPrice: '57,332',
    discount: '25',
    discountLabel: '25%',
    rating: 4,
    image: 'https://via.placeholder.com/400x500?text=Apple+Watch',
  },
  {
    id: 5,
    name: 'Apple Watch Ultra 2 GPS',
    subtitle: 'Titanium Case with Alpine Loop',
    description: loremDescription,
    ratingCount: '1,240',
    price: '42,999',
    originalPrice: '57,332',
    discount: '25',
    discountLabel: '25%',
    rating: 4,
    image: 'https://via.placeholder.com/400x500?text=Apple+Watch',
  },
  {
    id: 6,
    name: 'Apple Watch Ultra 2 GPS',
    subtitle: 'Titanium Case with Alpine Loop',
    description: loremDescription,
    ratingCount: '1,240',
    price: '42,999',
    originalPrice: '57,332',
    discount: '25',
    discountLabel: '25%',
    rating: 4,
    image: 'https://via.placeholder.com/400x500?text=Apple+Watch',
  },
  {
    id: 7,
    name: 'Apple Watch Ultra 2 GPS',
    subtitle: 'Titanium Case with Alpine Loop',
    description: loremDescription,
    ratingCount: '1,240',
    price: '42,999',
    originalPrice: '57,332',
    discount: '25',
    discountLabel: '25%',
    rating: 4,
    image: 'https://via.placeholder.com/400x500?text=Apple+Watch',
  },
  {
    id: 8,
    name: 'Apple Watch Ultra 2 GPS',
    subtitle: 'Titanium Case with Alpine Loop',
    description: loremDescription,
    ratingCount: '1,240',
    price: '42,999',
    originalPrice: '57,332',
    discount: '25',
    discountLabel: '25%',
    rating: 4,
    image: 'https://via.placeholder.com/400x500?text=Apple+Watch',
  },
  {
    id: 9,
    name: 'Apple Watch Ultra 2 GPS',
    subtitle: 'Titanium Case with Alpine Loop',
    description: loremDescription,
    ratingCount: '1,240',
    price: '42,999',
    originalPrice: '57,332',
    discount: '25',
    discountLabel: '25%',
    rating: 4,
    image: 'https://via.placeholder.com/400x500?text=Apple+Watch',
  },
];

const ProductsPage = () => {
  const { id } = useParams();
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Sort');

  const sortOptions = [
    'Default',
    'Price: Low to High',
    'Price: High to Low',
    'Highest Rated',
    'Most Popular'
  ];

  const selectedProduct = id ? dummyProducts.find(p => p.id === parseInt(id)) : null;

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
      <FilterSidebar categories={dummyCategories} />

      {/* Main Content Area */}
      <main className="flex-grow">
        <div className="bg-[#f2f5f9] rounded-2xl p-6 md:p-8 shadow-lg min-h-full flex flex-col">
          
          {selectedProduct ? (
            /* ================================== */
            /*        PRODUCT DETAIL VIEW         */
            /* ================================== */
            <ProductDetail product={selectedProduct} />
          ) : (
            /* ================================== */
            /*        PRODUCT LIST VIEW           */
            /* ================================== */
            <>
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Product Lists</h1>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm px-5 py-2 rounded-lg flex items-center shadow-md transition-colors"
                  >
                    {sortBy} <i className={`bi bi-chevron-down ml-2 text-xs transition-transform ${isSortOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {/* Dropdown Menu */}
                  {isSortOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden transform origin-top-right transition-all">
                      <ul className="py-2">
                        {sortOptions.map((option) => (
                          <li 
                            key={option}
                            onClick={() => { setSortBy(option); setIsSortOpen(false); }}
                            className={`px-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between
                              ${sortBy === option 
                                ? 'bg-blue-50 text-blue-600 font-bold border-l-4 border-blue-500' 
                                : 'text-slate-700 hover:bg-slate-50 border-l-4 border-transparent'
                              }`}
                          >
                            {option}
                            {sortBy === option && <i className="bi bi-check text-lg leading-none"></i>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 flex-grow">
                {dummyProducts.map((product) => (
                  <Link to={`/products/${product.id}`} key={product.id} className="bg-[#3b0b75] rounded-3xl overflow-hidden shadow-xl hover:-translate-y-1 transition-transform duration-300 flex flex-col group cursor-pointer">
                    
                    {/* Image Section */}
                    <div className="bg-white p-4 relative aspect-[4/3] flex items-center justify-center rounded-t-3xl border-b-4 border-[#3b0b75]">
                      {/* Discount Badge */}
                      <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        -{product.discount}%
                      </div>
                      {/* Wishlist Icon */}
                      <div className="absolute top-4 right-4 text-red-500 hover:scale-110 transition-transform">
                        <i className="bi bi-heart text-xl leading-none"></i>
                      </div>
                      {/* Product Image */}
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Details Section */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-white font-bold text-sm mb-1 truncate">{product.name}</h3>
                      <div className="flex gap-1 mb-4">
                        {renderStars(product.rating)}
                      </div>
                      <div className="flex justify-between items-end mt-auto">
                        <div className="text-red-400 font-bold text-lg leading-none">
                          ₹ {product.price}
                        </div>
                        <div className="text-white hover:text-blue-300 transition-colors">
                          <i className="bi bi-cart3 text-xl"></i>
                        </div>
                      </div>
                    </div>

                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center mt-12 gap-2">
                <button className="text-slate-400 hover:text-blue-600 text-xs font-semibold px-2 py-1 flex items-center transition-colors">
                  <i className="bi bi-chevron-left mr-1"></i> Previous
                </button>
                <button className="w-8 h-8 rounded-full bg-[#3b0b75] text-white font-bold text-sm shadow-md flex items-center justify-center">
                  1
                </button>
                <button className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center">
                  2
                </button>
                <button className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center">
                  3
                </button>
                <button className="text-slate-700 hover:text-blue-600 text-xs font-bold px-2 py-1 flex items-center transition-colors">
                  Next <i className="bi bi-chevron-right ml-1"></i>
                </button>
              </div>
            </>
          )}
        </div>
      </main>

    </div>
  );
};

export default ProductsPage;
