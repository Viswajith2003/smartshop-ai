import React from 'react';

const FilterSidebar = ({ 
  categories = [], 
  price, 
  setPrice, 
  selectedCategories, 
  handleCategoryChange, 
  selectedRating, 
  setSelectedRating, 
  handleClearAll 
}) => {

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-[#f2f5f9] rounded-2xl p-6 shadow-lg h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Filters</h2>
          <button 
            onClick={handleClearAll}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-1.5 rounded-full font-medium transition-colors"
          >
            Clear All
          </button>
        </div>

        <hr className="border-slate-200 mb-6" />

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Price Range</h3>
          <div className="px-1">
            <input 
              type="range"
              min="0"
              max="300000"
              step="1000"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all"
              style={{
                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(price / 300000) * 100}%, #e2e8f0 ${(price / 300000) * 100}%, #e2e8f0 100%)`
              }}
            />
          </div>
          <div className="flex justify-between items-center mt-4 text-xs font-medium text-slate-500">
            <span>₹0 - ₹{price.toLocaleString('en-IN')}</span>
            <button className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-3 py-1 rounded-full text-[10px]">Filter</button>
          </div>
        </div>

        <hr className="border-slate-200 mb-6" />

        {/* Category */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Category</h3>
          <div className="space-y-3">
            {categories.map((cat) => (
              <label key={cat._id || cat.id} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${selectedCategories.includes(cat._id || cat.id) ? 'bg-blue-500 border-blue-500' : 'border-slate-300 group-hover:border-blue-500'}`}>
                      {selectedCategories.includes(cat._id || cat.id) && <i className="bi bi-check text-white text-lg leading-none"></i>}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedCategories.includes(cat._id || cat.id)}
                    onChange={() => handleCategoryChange(cat._id || cat.id)}
                  />
                  <span className="text-sm font-semibold text-slate-700">{cat.name}</span>
                </div>
                <span className="bg-slate-200 text-slate-500 text-xs px-2 py-0.5 rounded-full font-medium">
                  {cat.count || 0}
                </span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-slate-200 mb-6" />

        {/* Rating */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Rating</h3>
          <div className="flex flex-col gap-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label 
                key={rating} 
                className="flex items-center cursor-pointer group"
              >
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${selectedRating === rating ? 'border-amber-500' : 'border-slate-300 group-hover:border-amber-400'}`}>
                  {selectedRating === rating && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                </div>
                <input
                  type="radio"
                  name="rating"
                  className="hidden"
                  checked={selectedRating === rating}
                  onChange={() => setSelectedRating(rating === selectedRating ? null : rating)}
                  onClick={() => selectedRating === rating && setSelectedRating(null)}
                />
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`bi bi-star${i < rating ? '-fill' : ''} text-sm ${i < rating ? 'text-amber-400' : 'text-slate-300'}`}
                    ></i>
                  ))}
                  {rating < 5 && <span className="text-xs font-medium text-slate-500 ml-2">& up</span>}
                </div>
              </label>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
};

export default FilterSidebar;
