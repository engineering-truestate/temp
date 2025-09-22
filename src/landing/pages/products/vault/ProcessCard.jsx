import React from "react";

// ProcessCard Component
const ProcessCard = ({ stepNumber, title, description }) => {
  return (
    <div className="pt-10 bg-white rounded-xl relative w-full max-w-[15rem] md:max-w-[20rem] h-[8rem] lg:h-[10rem] flex flex-col gap-6">
      {/* Step Number (e.g., "01") */}
      <div className="absolute top-4 left-0 text-6xl md:text-5xl lg:text-6xl text-[#E1E1E1]/60 font-bold font-heading">
        {stepNumber}
      </div>
      <div className="flex flex-col">
        {/* Title */}
        <h3 className="text-base lg:text-2xl font-subheading font-semibold relative z-10">
          {title}
        </h3>
        {/* Description */}
        <p className="text-ShadedGrey relative font-body text-xs lg:text-lg z-10">
          {description}
        </p>
      </div>

    </div>
  );
};

export default ProcessCard; 