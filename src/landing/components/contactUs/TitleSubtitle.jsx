// TitleSubtitle.jsx

import React from 'react';

const TitleSubtitle = ({ title, subtitle }) => {
  return (
    <div className='flex flex-col gap-4 md:gap-6 lg:gap-7 items-center'>
      
      {/* Badge Section (Contact Us Badge) */}
      <div className="flex items-center bg-gray-200 text-ShadedGrey py-1 px-4 md:py-1 md:px-5 lg:py-2 lg:px-6 rounded-full w-fit">
        {/* Badge Text */}
        <p className="flex items-center text-label-xs md:text-label-sm lg:text-label-md font-body">
          Contact Us {/* Text inside the badge */}
        </p>
      </div>

      {/* Main Content Area (Title and Subtitle) */}
      <div className="gap-3 md:gap-4 lg:gap-5 flex flex-col">
        
        {/* Title Section */}
        <h2 className="text-display-sm md:text-display-md lg:text-display-lg font-heading text-GreenBlack">
          {title} {/* The main title passed as a prop */}
        </h2>

        {/* Subtitle Section */}
        <p className="text-heading-medium-xxs md:text-heading-medium-sm lg:text-heading-medium-md text-gray-800 md:max-w-xl lg:max-w-4xl font-subheading">
          {subtitle} {/* The subtitle passed as a prop */}
        </p>
      </div>
    </div>
  );
};

export default TitleSubtitle;
