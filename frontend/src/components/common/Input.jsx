import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-4 py-3 rounded-2xl border-2 transition-all outline-none text-slate-900 font-medium ${
          error 
            ? 'border-rose-100 bg-rose-50/50 focus:border-rose-400' 
            : 'border-slate-100 focus:border-blue-400 bg-slate-50'
        }`}
        {...props}
      />
      {error && <span className="text-xs font-bold text-rose-500 ml-1 mt-0.5">{error}</span>}
    </div>
  );
};

export default Input;
