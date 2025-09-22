// MissionVision.jsx
// ========================
// This component renders the "Mission and Vision" section with reusable content sections.
// It displays two sections: Mission and Vision, with an image, title, description, and label.
// Each section can be configured to display the image on either the left or right side.
// ========================

import { useEffect } from 'react';

import MissionImg from '../../assets/about/icons/eye.svg'; // Icon for the Mission section
import VisionImg from '../../assets/about/icons/square.svg'; // Icon for the Vision section
import blog1 from '../../assets/about/citysmart.svg'; // Image for Mission section
import blog2 from '../../assets/about/globe.webp'; // Image for Vision section

// Reusable Content Section Component
const ContentSection = ({ title, description, label, labelImg, image, reverseOrder }) => {

  return (
    <div 
      className="flex flex-col-reverse md:flex-row gap-4 md:justify-between rounded-2xl bg-white py-8 px-4 md:p-10 lg:p-14"
      style={{ boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.08)" }}
    >
      
      {/* Text Content Section */}
      <div className={`flex flex-col justify-center gap-1.5 lg:gap-2 md:max-w-[50%] ${reverseOrder ? 'md:order-last' : ''}`}>
        <div className="flex gap-1 items-center">
          <div>
            <img src={labelImg} alt={label} />
          </div>
          {/* Label */}
          <p className="uppercase text-ShadedGrey font-body font-bold text-label-xs lg:text-label-md">
            {label}
          </p>
        </div>

        {/* Title and Description Section */}
        <div className="gap-2.5 md:gap-3 lg:gap-4 flex flex-col">
          <h2 className="text-display-xs lg:text-display-md font-heading text-GreenBlack">
            {title}
          </h2>
          <p className="text-paragraph-xs lg:text-paragraph-lg text-ShadedGrey font-body">
            {description}
          </p>
        </div>
      </div>

      {/* Image Content Section */}
      <div className="flex justify-center">
        <img src={image} alt={title} className="w-auto h-[17rem] md:h-[20rem] lg:h-[28rem] object-cover" />
      </div>
    </div>
  );
};

// Main Mission and Vision Section
const MissionVision = () => {
  // Data array for the Mission and Vision sections
  const sections = [
    {
      title: "Making Real Estate investing data-driven, digital and seamless",
      description: "TruEstate presents a range of free tools and services to evaluate, invest in & manage residential properties.",
      label: "Mission",
      labelImg: MissionImg,
      image: blog1,
      reverseOrder: false, // Image will be on the right
    },
    {
      title: "Invest with us to invest with trust and transparency",
      description: "Investment opportunities in Real Estate often hide more than they present. TruEstate ensures you get the full picture - no mis-selling, no misleading information, no false promises.",
      label: "Vision",
      labelImg: VisionImg,
      image: blog2,
      reverseOrder: true, // Image will be on the left
    }
  ];

  return (
    <div className="container">
      <div className="w-full flex flex-col px-4 md:px-20 lg:px-24 gap-10 md:gap-6 lg:gap-12 py-16 md:py-10 lg:py-14">
        {/* Map through the sections array */}
        {sections.map((section, index) => (
          <ContentSection
            key={index}
            title={section.title}
            label={section.label}
            labelImg={section.labelImg}
            description={section.description}
            image={section.image}
            reverseOrder={section.reverseOrder}
          />
        ))}
      </div>
    </div>
  );
};

export default MissionVision;
