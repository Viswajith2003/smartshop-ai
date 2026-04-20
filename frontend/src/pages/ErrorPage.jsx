import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-100 z-50 overflow-hidden">
      <div className="text-center p-8 md:p-12 shadow-lg rounded-xl bg-white mx-4 w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <i className="bi bi-exclamation-triangle-fill text-red-500 text-6xl"></i>
        </div>
        <h1 className="text-4xl font-extrabold mb-2 text-gray-900">Oops!</h1>
        <h2 className="text-xl font-medium mb-4 text-gray-600">Something went wrong</h2>
        <p className="text-gray-500 mb-8">
            We're experiencing some technical difficulties. Please try again later.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-sm">
            <i className="bi bi-house mr-2"></i>
            Return Home
          </Link>
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
            <i className="bi bi-arrow-clockwise mr-2"></i>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
