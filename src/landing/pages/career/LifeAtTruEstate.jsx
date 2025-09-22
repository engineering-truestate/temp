import React from 'react';

// Import the images you want to use in the bento grid
import image1 from '../../assets/career/Life/Gokart.png';
import image2 from '../../assets/career/Life/shift.png';
import image3 from '../../assets/career/Life/archerDJ.png';
import image4 from '../../assets/career/Life/skyview.png';
import image5 from '../../assets/career/Life/office.png';
import image6 from '../../assets/career/Life/bowling.png';
import image7 from '../../assets/career/Life/teamplayarena.png';

// Array of image imports
const images = [
  { src: image1, alt: 'Gokart', size: 'large' },
  { src: image2, alt: 'Shift', size: 'small' },
  { src: image3, alt: 'ArcherDJ', size: 'small' },
  { src: image4, alt: 'Skyview', size: 'medium' },
  { src: image5, alt: 'Office', size: 'medium' },
  { src: image6, alt: 'Bowling', size: 'medium' },
  { src: image7, alt: 'TeamPlay Arena', size: 'large-full' }, // Full-width image
];

const LifeAtTruEstate = () => {
  return (
    <section className="bg-white">

      <div className="container  flex flex-col gap-8 md:gap-10 lg:gap-16 items-center px-4 md:px-20 lg:px-24 py-16 md:py-20 lg:py-28" id="LifeAtTruEstate">
      
        {/* Section Title */}
        <div className="text-center">
          <h2 className="text-display-xs md:text-display-sm lg:text-display-md font-heading text-GreenBlack">
            Life at TruEstate
          </h2>
        </div>
        
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-2 gap-1 md:gap-3 lg:gap-4 ">
          
          {/* First Row: Two Columns */}
          <div className="grid grid-cols-2 col-span-2 gap-1 md:gap-3 lg:gap-4">
            <div className="col-span-1">
              <img
                src={image1}
                alt="Gokart"
                className="object-cover w-full h-full rounded-sm md:rounded-md lg:rounded-lg"
              />
            </div>
            <div className="grid grid-rows-2 gap-1 md:gap-3 lg:gap-4">
              <img
                src={image2}
                alt="Shift"
                className="object-cover w-full h-full rounded-sm md:rounded-md lg:rounded-lg"
              />
              <img
                src={image3}
                alt="ArcherDJ"
                className="object-cover w-full h-full rounded-sm md:rounded-md lg:rounded-lg"
              />
            </div>
          </div>
          
          {/* Second Row: Three Columns */}
          <div className="grid grid-cols-3 col-span-2 gap-1 md:gap-3 lg:gap-4">
            <img
              src={image4}
              alt="Skyview"
              className="object-cover w-full h-full rounded-sm md:rounded-md lg:rounded-lg"
            />
            <img
              src={image5}
              alt="Office"
              className="object-cover w-full h-full rounded-sm md:rounded-md lg:rounded-lg"
            />
            <img
              src={image6}
              alt="Bowling"
              className="object-cover w-full h-full rounded-sm md:rounded-md lg:rounded-lg"
            />
          </div>
          
          {/* Third Row: Full-width Image */}
          <div className="col-span-2">
            <img
              src={image7}
              alt="TeamPlay Arena"
              className="object-cover w-full h-full rounded-sm md:rounded-md lg:rounded-lg"
            />
          </div>

        </div>
      </div>

    </section>
  );
};

export default LifeAtTruEstate;
