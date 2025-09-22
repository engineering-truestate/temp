import React from 'react';

const ServiceCard = ({ imageSrc, title, description }) => {
  
  return (
    // Main card container with flexible layout, padding, and border properties
    <div className="relative flex flex-col items-center justify-start bg-DefaultWhite border rounded-2xl border-[#D9D9D9] p-5 sm:p-6 md:p-7 lg:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex-grow overflow-hidden mx-auto">
      
      {/* Content area inside the card
        - Flexbox layout for responsive alignment and gap between elements
        - Items are aligned to the center with a column layout for all screens
        - Adjusted gap between elements based on screen size (gap-4, md:gap-4, lg:gap-5)
      */}
      <div className="flex flex-col items-center md:items-start text-center w-full gap-4 md:gap-4 lg:gap-5">
        
        {/* Image wrapper
          - A border and background is applied around the image for styling
          - The border and padding adjust based on screen size
        */}
        <div className="border rounded-lg md:rounded-md lg:rounded-lg bg-background border-gray-300 py-2 lg:py-2 px-2 lg:px-2">
          <img src={imageSrc} alt={title} className="h-full w-full lg:h-12 lg:w-auto" />
        </div>

        {/* Title and description container
          - Contains the title and description, which are spaced vertically with a gap that changes across screen sizes
        */}
        <div className="w-full flex flex-col gap-1 md:gap-0.5 lg:gap-1 items-center md:items-start">
          
          {/* Title
            - The font size changes depending on screen size (medium for small, large for desktop)
            - Uses the GreenBlack color for the title
          */}
          <h3 className="text-heading-semibold-xs text-gray-900 font-subheading text-center md:text-start">
            {title}
          </h3>

          {/* Description
            - Font size adjusts based on screen size
            - Uses ShadedGrey for text color
          */}
          <p className="text-paragraph-xs text-gray-800 font-body text-center md:text-start">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
