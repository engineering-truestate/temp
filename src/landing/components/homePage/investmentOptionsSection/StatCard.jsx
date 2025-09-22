/**
 * StatCard Component
 * 
 * Description:
 * A reusable React component that displays a statistical card with a title, value, and description.
 * It is styled using Tailwind CSS classes and is responsive across different screen sizes.
 * 
 * Props:
 * - title (string): The heading of the stat card.
 * - value (string): The main statistic or figure to display prominently.
 * - description (string): Additional information or context about the value.
 * 
 * Example Usage:
 * <StatCard 
 *   title="Total Users" 
 *   value="1,234" 
 *   description="Number of active users on the platform."
 * />
 */

import React from "react";

const StatCard = ({ title, value, description }) => {
  return (
    <div className="flex flex-col gap-3 border border-gray-200 rounded-2xl py-8 px-6 md:py-7 md:px-6 lg:py-8 lg:px-10 items-center justify-center max-w-80">
      
      {/* Title Section */}
      <div className="px-4 py-1 bg-[#F5F5F5] w-fit mx-auto rounded-lg">
        <div className="lg:text-heading-medium-xxxs md:text-heading-medium-xxxxs text-heading-medium-xxxxs font-subheading text-ShadedGrey">
          {title}
        </div>
      </div>
      
      {/* Value and Description Section */}
      <div className="flex flex-col gap-3 items-center justify-start ">
        <div className="lg:text-display-sm text-display-xs font-heading">
          {value}
        </div>
        <p className="text-gray-800 text-center text-paragraph-lg md:text-paragraph-xs lg:text-paragraph-lg font-body">
          {description}
        </p>
      </div>

    </div>
  );
};

export default StatCard;
