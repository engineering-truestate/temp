// HeroCareer.jsx
import { useEffect } from 'react';
import LargeButton from '../../components/button/LargeButton'; // Button component for the call-to-action
import HeroBG from '../../assets/career/heroBG.webp'; // Background image for the hero section

const HeroCareer = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const zoomLevel = Math.min(120, 100 + scrollY / 25); // Control zoom level, cap at 120%
      const heroBG = document.getElementById('heroBackground'); // Get the hero background element

      // Apply zoom effect only for screens larger than mobile
      if (heroBG && window.innerWidth >= 1024) {
        heroBG.style.backgroundSize = `${zoomLevel}%`; // Adjust background size based on scroll
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup: Remove event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to handle smooth scroll to OpenPositions
  const scrollToOpenPositions = () => {
    const openPositionsElement = document.getElementById('openPositions');
    if (openPositionsElement) {
      openPositionsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-fit lg:h-[90vh]" id="open-positions">
      {/* Background Image Div */}
      <div
        id="heroBackground"
        className="absolute inset-0 bg-cover bg-no-repeat bg-center z-0 opacity-15"
        style={{
          backgroundImage: `url(${HeroBG})`,
          backgroundAttachment: 'fixed', // Parallax effect: Keeps the background fixed while scrolling
        }}
      ></div>

      {/* Content Section */}
      <section className="relative z-10 w-full h-full flex items-center justify-center text-center py-16 md:py-14 lg:py-0 px-4 md:px-20 lg:px-24">
        <div className="container flex flex-col items-center justify-center gap-6 lg:gap-7">
          
          {/* Title and Subtitle Section */}
          <div className="flex flex-col gap-4 md:gap-6 lg:gap-7 items-center">
            
            {/* Badge for Career Section */}
            <div className="flex items-center bg-gray-200 text-ShadedGrey py-1 px-4 md:py-1 md:px-5 lg:py-2 lg:px-6 rounded-full w-fit">
              <p className="flex items-center text-label-xs md:text-label-sm lg:text-label-md font-body">Career</p>
            </div>

            {/* Title and Subtext */}
            <div className="flex flex-col gap-3 md:gap-4 lg:gap-5">
              {/* Main Title */}
              <h1 className="text-display-sm md:text-display-md lg:text-display-lg font-heading text-GreenBlack max-w-3xl md:max-w-full lg:max-w-[60vw]">
                Disrupt Real Estate With Us
              </h1>

              {/* Subtitle */}
              <p className="text-heading-medium-xxs md:text-heading-medium-sm lg:text-heading-medium-md text-gray-800 max-w-2xl md:max-w-[80vw] lg:max-w-[50vw] font-subheading">
                Join us to digitally transform real estate investing in India. Explore career opportunities where your passion can help you learn and grow.
              </p>
            </div>
          </div>

          {/* Call-to-Action Button */}
          <div>
            <LargeButton 
              onClick={scrollToOpenPositions} 
              label="See open roles" 
              classes="text-label-sm md:text-label-md" 
              eventName="cta_click"                     // Tracking event name
              eventCategory="CTA"                       // Tracking category
              eventAction="click"                       // Tracking action
              eventLabel="see_open_roles_career_hero"  // Tracking label
            />
          </div>


        </div>
      </section>
    </div>
  );
};

export default HeroCareer;
