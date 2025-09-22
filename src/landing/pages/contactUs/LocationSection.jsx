// LocationSection.jsx
// This component displays a section with a title, address, and a button that links to Google Maps.
// It also includes an embedded Google Maps iframe to show the location visually.
// The layout is responsive, adapting to different screen sizes using Tailwind CSS.

const gps = '/assets/auth/icons/gps.svg'; // GPS icon from public assets
import LargeButton from "../../components/button/LargeButton"; // Import LargeButton component
import { logEvent } from "firebase/analytics";
import { analytics } from "../../../firebase";

const LocationSection = () => {
  return (
    // Main section container
    <section className="bg-white">
      <div className="container mx-auto gap-8 md:gap-12 lg:gap-[4.5rem] flex flex-col text-left py-16 md:py-10 lg:py-14 md:px-20 lg:px-24 px-4">
        
        {/* Container for title and button */}
        <div className="flex flex-col gap-4 lg:gap-5 md:items-start items-center"> {/* Center items on mobile */}

          {/* Flex row for title and button */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between md:items-center items-center w-full"> {/* Center on mobile */}
            
            {/* Title Section */}
            <h2 className="text-display-xs md:text-display-sm lg:text-display-md font-heading text-GreenBlack text-center md:text-left">
              Grab a coffee with us!
            </h2>

            {/* Button aligned right */}
            <LargeButton 
                href="https://maps.app.goo.gl/XaVKtckPBUydD7K36" 
                label="Open in Google Maps" 
                classes="text-label-sm md:text-label-md bg-transparent !text-GableGreen hover:bg-white font-body" 
                IconFirst={gps} 
                HoverIcon={gps} 
                eventName="click_outside_contact_map"                    // Tracking event name
                eventCategory="CTA"                      // Tracking category
                eventAction="click"                      // Tracking action
                eventLabel="map_contact"                 // Tracking label for Map Click
            />

          </div>
          
          {/* Address Section (left aligned on desktop, centered on mobile) */}
          <p className="text-heading-medium-xxs md:text-heading-medium-xs lg:text-heading-medium-md font-subheading text-gray-800 text-center md:text-left">
            1579, Second Floor, 27th Main Road, 26th Cross, Sector 2, HSR Layout, Bengaluru, <br className="block sm:hidden"/>Karnataka 560102
          </p>
        </div>

        {/* Google Maps Embed */}
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <iframe 
            title="Our Location"
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.040464818791!2d77.64843421097787!3d12.905119616279134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1500318dd883%3A0x9e9609803744b76c!2sTruEstate%20(IQOL%20Technologies)!5e0!3m2!1sen!2sin!4v1725438040083!5m2!1sen!2sin"
            style={{ border: '0' }}  // Correct style usage as an object
            allowFullScreen  // Correct usage of allowFullScreen in JSX
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
