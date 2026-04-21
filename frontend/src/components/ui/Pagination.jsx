import React from 'react';

const Pagination = ({ pagination, onPageChange, theme = 'light' }) => {
  if (pagination.totalPages <= 0) return null;

  return (
    <div className="flex justify-center items-center mt-8 gap-2 pb-4">
      <button
        disabled={pagination.page === 1}
        onClick={() => onPageChange(pagination.page - 1)}
        className={`text-xs font-semibold px-4 py-2 flex items-center transition-all rounded-xl border ${
          pagination.page === 1
            ? theme === 'dark' 
                ? 'text-slate-500 border-slate-700 cursor-not-allowed opacity-50'
                : 'text-slate-300 border-slate-100 cursor-not-allowed'
            : theme === 'dark'
                ? 'text-slate-300 border-slate-600 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/10'
                : 'text-slate-600 border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        <i className="bi bi-chevron-left mr-2"></i> Previous
      </button>

      <div className="flex items-center gap-2 mx-4">
        {[...Array(pagination.totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all shadow-sm ${
              pagination.page === i + 1
                ? theme === 'dark'
                    ? 'bg-purple-600 text-white scale-110 shadow-[0_0_15px_rgba(147,51,234,0.3)] border-transparent'
                    : 'bg-[#3b0b75] text-white scale-110 shadow-indigo-200 border-transparent'
                : theme === 'dark'
                    ? 'bg-[#1a1c3d]/50 text-slate-300 hover:bg-[#1a1c3d] border border-[#1a1c3d]'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        disabled={pagination.page === pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
        className={`text-xs font-semibold px-4 py-2 flex items-center transition-all rounded-xl border ${
          pagination.page === pagination.totalPages
            ? theme === 'dark' 
                ? 'text-slate-500 border-slate-700 cursor-not-allowed opacity-50'
                : 'text-slate-300 border-slate-100 cursor-not-allowed'
            : theme === 'dark'
                ? 'text-slate-300 border-slate-600 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/10'
                : 'text-slate-600 border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        Next <i className="bi bi-chevron-right ml-2"></i>
      </button>
    </div>
  );
};

export default Pagination;
