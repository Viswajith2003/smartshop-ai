import React from 'react';

const FilterSidebar = ({ categories = [] }) => {
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-[#f2f5f9] rounded-2xl p-6 shadow-lg h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Filters</h2>
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-1.5 rounded-full font-medium transition-colors">
            Clear All
          </button>
        </div>

        <hr className="border-slate-200 mb-6" />

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Price Range</h3>
          <div className="relative pt-1">
            {/* Dummy slider representation */}
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-full rounded-full"></div>
            </div>
            <div className="absolute top-0 w-4 h-4 bg-slate-800 rounded-full shadow -mt-1 -ml-2 left-0 border-2 border-white"></div>
            <div className="absolute top-0 w-4 h-4 bg-slate-800 rounded-full shadow -mt-1 -ml-2 left-full border-2 border-white"></div>
          </div>
          <div className="flex justify-between items-center mt-4 text-xs font-medium text-slate-500">
            <span>₹0 - ₹1,00,000</span>
            <button className="bg-blue-500 text-white px-3 py-1 rounded-full text-[10px]">Filter</button>
          </div>
        </div>

        <hr className="border-slate-200 mb-6" />

        {/* Category */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Category</h3>
          <div className="space-y-3">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded border-2 border-slate-300 mr-3 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                      {/* Checkbox mock */}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{cat.name}</span>
                </div>
                <span className="bg-slate-200 text-slate-500 text-xs px-2 py-0.5 rounded-full font-medium">
                  {cat.count}
                </span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-slate-200 mb-6" />

        {/* Rating */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Rating</h3>
          <div className="flex flex-wrap gap-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button key={rating} className="bg-amber-400 hover:bg-amber-500 text-white font-bold text-xs w-8 h-6 flex items-center justify-center rounded-full transition-colors shadow-sm">
                {rating}
              </button>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
};

export default FilterSidebar;
