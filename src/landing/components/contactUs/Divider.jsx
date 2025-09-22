// Divider.jsx
// This component renders a visually appealing divider with a horizontal line
// on small screens and a vertical orientation on medium and larger screens.
// The divider includes the text "Or" centered between the two lines,
// providing a clear separation of content.

import React from 'react';

const Divider = () => {
  return (
    // Main container for the divider
    <div className="flex flex-col justify-center items-center">
      
      {/* Main Divider Container */}
      {/* Horizontal on small screens, vertical on medium and larger screens */}
      <div className="flex md:flex-col w-[294px] md:w-auto md:h-[18rem] lg:h-[22.5rem] justify-between">

        {/* Left/Top Divider Line */}
        <div 
          className="block border-[1px] w-full md:w-[1px] border-[#E0E0E0] h-[1px] my-auto md:h-full mx-auto"
        ></div>

        {/* Divider Text ("Or") */}
        <div className="text-base md:text-lg lg:text-xl font-body text-GreenBlack px-4 md:px-0 md:py-2">
          Or
        </div>

        {/* Right/Bottom Divider Line */}
        <div 
          className="block border-[1px] w-full md:w-[1px] border-[#E0E0E0] h-[1px] my-auto md:h-full mx-auto"
        ></div>

      </div>
    </div>
  );
};

export default Divider;
