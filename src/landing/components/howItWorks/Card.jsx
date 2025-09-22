import React from 'react';

const Card = ({ title, description, icon }) => {
  return (
    // Card container with padding, background color, and rounded corners
    <div className="p-5 pb-7 w-[30rem] md:w-[25rem] lg:w-[30rem] bg-DefaultWhite rounded-lg flex">
      
      <div className='flex flex-col lg:flex-row items-center md:items-center lg:items-start justify-start md:justify-center lg:justify-start gap-5 md:gap-3'>

      <div className=" w-auto">
        <img src={icon} alt={title} className="w-8 md:w-10 lg:w-12 h-8 md:h-7 lg:h-auto" />
      </div>

      
      <div className="flex flex-col gap-3 text-center lg:text-left">
        <h3 className="font-subheading text-lg md:text-heading-bold-xxs lg:text-heading-bold-sm text-GreenBlack ">
          {title}
        </h3>
        <p className="text-ShadedGrey font-body text-lg md:text-paragraph-xxs lg:text-paragraph-lg">
          {description}
        </p>
      </div>

      </div>
    </div>
  );
};

export default Card;
