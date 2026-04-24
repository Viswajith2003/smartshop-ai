import React from 'react';

const Loader = ({
  text = 'Loading...',
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        {text && <p className="mt-4 text-purple-600 font-semibold animate-pulse">{text}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-500 rounded-full animate-spin"></div>
      {text && <p className="mt-3 text-purple-500 text-sm font-medium">{text}</p>}
    </div>
  );
};

export default Loader;
