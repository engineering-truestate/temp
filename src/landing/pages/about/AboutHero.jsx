// AboutHero.jsx
// ========================
// This component renders the "About Us" hero section for the website.
// It includes a title, subtitle, numeric stats for investors, developers, and listings,
// and optionally, a background image and grid lines for visual enhancement.
// ========================

import React from 'react';

import GridLines from '../../assets/about/GridLines.webp'; // Import SVG for grid lines
import './AboutUs.css'

const AboutHero = () => {
  // Array to store numeric details (number and description)
  const details = [
    { number: "200+", description: "Investors" },
    { number: "50+", description: "Developers" },
    { number: "10,000+", description: "Listings" },
  ];

  return (
    <>
      {/* Content container */}
      <div className="relative h-fit mx-auto container py-16 md:py-14 lg:py-0">

        {/* Uncomment below for Background Image */}
        {/* 
        <div 
          className="hidden md:block absolute -top-28 left-0 w-full h-full bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${BGGrids})` }} // Background Image
        ></div> 
        */}

        <div className="relative container z-10 px-4 md:px-20 lg:px-24 lg:pb-14 md:pb-10 md:pt-20 lg:pt-24 flex flex-col items-center text-center text-black gap-10 md:gap-14 lg:gap-20 h-full w-full">

          {/* Outer Section for Hero and Numeric Stats */}
          <div className="flex flex-col gap-5 md:gap-14 lg:gap-[72px]">
            <div className="flex flex-col gap-4 md:gap-6 lg:gap-7 items-center">
              
              {/* Badge Section */}
              <div className="flex items-center bg-gray-200 text-ShadedGrey py-1 px-4 md:py-1 md:px-5 lg:py-2 lg:px-6 rounded-full w-fit">
                <p className="flex items-center text-label-xs md:text-label-sm lg:text-label-md font-body">About Us</p>
              </div>

              {/* Title and Subtitle Section */}
              <div className="flex flex-col gap-6 md:gap-8 lg:gap-6 items-center">
                
                {/* Main Heading */}
                <h1 className="text-display-sm md:text-display-md lg:text-display-lg font-heading text-GreenBlack max-w-3xl md:max-w-[65vw] lg:max-w-[60vw]">
                  TruEstate simplifies Real Estate investing like never before
                </h1>
                
                {/* Supporting Text */}
                <p className="text-heading-medium-xxs md:text-heading-medium-sm lg:text-heading-medium-md text-gray-800 max-w-3xl md:max-w-[60vw] font-subheading">
                  Investing with us means investing with trust and transparency
                </p>
              </div>
            </div>

            {/* Grid and Numeric Stats Section */}
            <div className="relative w-full !num-card-parent-w-auto ">
              
              {/* Background Grid Lines */}
              <div 
                className="absolute inset-0 w-full h-full bg-no-repeat bg-contain bg-center"
                style={{ backgroundImage: `url(${GridLines})`, zIndex: 0 }} // GridLines SVG
              ></div>

              {/* Numeric Details Section (Cards) */}
              <div className="flex items-center justify-center xl:justify-between w-full text-GreenBlack mx-auto lg:gap-2 numeric-detail-zero-padding px-4 md:px-0 lg:px-16 flex-nowrap md:flex-wrap lg:flex-nowrap gap-2 md:gap-3">

                {/* Loop through details to create cards */}
                {details.map((detail, index) => (
                  <div 
                    key={index} 
                    className="bg-white border border-white rounded-md md:rounded-xl lg:rounded-2xl p-2 numeric-detail-small-padding md:p-4 lg:p-6 w-full max-w-[96px] md:max-w-[168px] lg:max-w-[240px] gap-1 md:gap-2 lg:gap-2.5 text-center flex flex-col items-center justify-center box-border num-card-w-fit "
                    style={{ 
                      boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.08)', 
                      backdropFilter: 'blur(1.2px)' 
                    }}
                  >
                    {/* Number */}
                    <h2 className="font-heading text-display-xxxs  md:text-display-sm lg:text-display-md  tex-disp-xxxxs">
                      {detail.number}
                    </h2>
                    {/* Description */}
                    <p className="text-label-xxxs md:text-label-md lg:text-label-lg font-subheading uppercase">
                      {detail.description}
                    </p>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutHero;
