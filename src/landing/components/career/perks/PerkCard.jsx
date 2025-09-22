import React from 'react';

const PerkCard = ({ icon, title, description }) => {
  return (
    <div 
      className="bg-white rounded-2xl py-6 lg:py-8 px-7 lg:px-10 flex flex-col items-start gap-4 lg:gap-5 w-full max-w-xs md:max-w-sm text-left transition duration-300 ease-in-out hover:shadow-xl" 
      style={{ 
        mixBlendMode: 'normal', 
        boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.08)' // Adding box-shadow directly as inline style
      }}
    >
      {/* Icon */}
      <div className="w-9 lg:w-12 h-9 lg:h-12 flex items-center justify-center">
        <img src={icon} alt={`${title} icon`} className="w-full h-full object-contain" />
      </div>

      <div className='flex flex-col gap-2 md:gap-1.5 lg:gap-2'>
        {/* Title */}
        <h3 className="font-subheading text-heading-semibold-xs md:text-heading-semibold-xs lg:text-heading-semibold-sm text-black">
          {title}
        </h3>

        {/* Description */}
        <p className="text-paragraph-xs md:text-paragraph-md font-body text-ShadedGrey">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PerkCard;
