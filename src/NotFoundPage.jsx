import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col font-lato justify-center items-center"  style={{ height: 'calc(100vh - 120px)' }}>
      <h1 className="text-6xl font-bold text-gray-800 font-montserrat">404</h1>
      <p className="text-xl text-gray-600 mt-4">Oops! Page not found.</p>
      <p className="text-center px-2 text-gray-500 mt-2">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/properties')} // Call the goHome function on click
        className="mt-6 px-6 py-2 bg-[#153E3B] text-white rounded-md text-[14px] font-semibold"
      >
        Go Back to Properties
      </button>
    </div>
  );
};

export default NotFound;
