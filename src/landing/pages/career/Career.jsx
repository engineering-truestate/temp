// Career.jsx
// This component serves as the main Career page for TruEstate. 
// It combines multiple sections that provide information about the company, 
// its culture, benefits, and current job openings. 

import HeroCareer from '../career/HeroCareer'; // Import the hero section of the career page
import { useEffect } from 'react';
import LifeAtTruEstate from '../career/LifeAtTruEstate'; // Import the Life at TruEstate section
import PerksAndBenefits from '../career/PerksAndBenefits'; // Import the Perks and Benefits section
import OpenPositions from '../career/OpenPositions'; // Import the Open Positions section

function Career() {
  useEffect(() => {
    // Check if the URL contains an anchor link
    if (window.location.hash) {
      const element = document.getElementById(window.location.hash.substring(1)); // Get the element by ID
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the element
      }
    }
  }, []);
  return (
    // Main container for the Career page
    <div>
      {/* Hero section displaying an introduction to the career opportunities */}

      <HeroCareer />
      
      {/* Section detailing life at TruEstate */}
      <LifeAtTruEstate />
      
      {/* Section highlighting perks and benefits of working at TruEstate */}
      <PerksAndBenefits />
      
      {/* Section listing the current open positions */}
      <OpenPositions id="openPositions"/>
    </div>
  );
}

export default Career; // Export the Career component
