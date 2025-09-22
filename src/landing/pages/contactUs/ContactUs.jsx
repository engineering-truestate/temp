// ContactUs.jsx
// This component serves as the main contact page, combining the 
// GetInTouchHero section and the LocationSection to provide 
// users with information on how to get in touch and find the location.

import GetInTouchHero from '../contactUs/GetInTouchHero'; // Import the hero section for getting in touch
import LocationSection from '../contactUs/LocationSection'; // Import the location section

function ContactUs() {
  return (
    // Main container for the Contact Us page
    <div>
      {/* Hero section prompting users to get in touch */}
      <GetInTouchHero />
      
      {/* Section displaying the physical location */}
      <LocationSection />
    </div>
  );
}

export default ContactUs; // Export the ContactUs component
