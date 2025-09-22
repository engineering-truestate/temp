import React, { useEffect, useRef, useState } from "react";


// Import your logos
import mahindraLogo from "../../assets/partners/Mahindra.png";
import tataLogo from "../../assets/partners/Container2.png";
import godrejLogo from "../../assets/partners/Container3.png";
import brigadeLogo from "../../assets/partners/Container4.png";
import sobhaLogo from "../../assets/partners/Container5.png";

const PartnersSection = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const logos = [
    
    { src: mahindraLogo, alt: "Mahindra Zen" },
    { src: tataLogo, alt: "Tata Housing" },
    { src: sobhaLogo, alt: "Sixth Logo" },
    { src: godrejLogo, alt: "Godrej Properties" },
    { src: brigadeLogo, alt: "Brigade" },
    { src: sobhaLogo, alt: "Sobha" },
    
  ];

  // Mouse and Touch event handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full mt-16">
      <div className="transform">
        <div className="px-6 md:px-20 lg:px-24 flex items-center justify-center bg-GableGreen">
          <div className="flex flex-col gap-5 md:gap-6 lg:gap-7 py-10 md:py-10 lg:py-14 text-center font-body w-full">
            {/* Heading */}
            <h2 className="text-DefaultWhite text-heading-medium-xxs md:text-heading-medium-sm lg:text-heading-medium-md font-subheading">
              Discover opportunities from India's best Real Estate developers
            </h2>

            {/* Desktop View (md and above) */}
            <div className="hidden md:flex flex-wrap justify-between items-center w-full py-4">
              {logos.map((logo, index) => (
                <img
                  key={index}
                  src={logo.src}
                  className="w-36  h-auto mx-4 my-2"
                  alt={logo.alt}
                />
              ))}
            </div>

            {/* Mobile Carousel (below md) */}
            <div 
              className="md:hidden w-full overflow-hidden"
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchEnd={() => setIsDragging(false)}
            >
              <div
                ref={scrollRef}
                className="flex overflow-x-auto items-center scrolling-touch no-scrollbar"
                style={{
                  scrollBehavior: "smooth",
                  WebkitOverflowScrolling: "touch",
                  scrollSnapType: "x mandatory",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              >
                {/* Double the logos for continuous scroll effect */}
                {[...logos].map((logo, index) => (
                  <div
                    key={index}
                    className="flex-none w-24 mx-4 scroll-snap-align-start"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <img
                      src={logo.src}
                      className="w-full h-auto"
                      alt={logo.alt}
                      draggable="false"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;