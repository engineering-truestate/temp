// GetInTouchHero.jsx
// ========================
// This component renders the 'Get in touch' hero section, featuring:
// - A background image with parallax effect.
// - A title and subtitle to engage users.
// - A section for displaying contact information, including a QR code and contact cards.
// ========================

import { useEffect } from 'react';

import InvManager from '../../../utils/InvManager';

// Components
import TitleSubtitle from '../../components/contactUs/TitleSubtitle'; // Component for rendering the title and subtitle
import QRCodeSection from '../../components/contactUs/QRCodeSection'; // Component to display a QR code
import Divider from '../../components/contactUs/Divider'; // Component for a divider/separator
import ContactCards from '../../components/contactUs/ContactCards'; // Component to display contact information cards

// Icons
// Icons from public assets
const contactIcon = '/assets/auth/icons/call.svg'; // Icon for contact number
const emailIcon = '/assets/auth/icons/sms.svg'; // Icon for email
const demoIcon = '/assets/auth/icons/monitor-recorder.svg'; // Icon for demo request
const careerHeroBg = '/assets/auth/images/careerherobg.svg'; // Background image for the section
import { formatPhoneNumber } from '../../../utils/common';

const GetInTouchHero = () => {

  useEffect(() => {
    // Load Calendly assets when the component mounts
    const link = document.createElement("link");
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup assets on component unmount
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  // Function to open the Calendly popup
  const handleOpenCalendly = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: "https://calendly.com/amit-truestate/30min",
      });
    }
  };


  // Array to define the contact information cards
const contactCards = [
  {
    icon: contactIcon, // Contact number icon
    title: formatPhoneNumber(`+${InvManager.phoneNumber}`), // Title for contact number
    // value: '+91 97426-89879', // Contact number value
    link: `tel:${InvManager.phoneNumber}`, // Link to dial the number directly
    eventName: "click_outside_contact_us_call",                         // Tracking event name
    eventCategory: "CTA",                           // Tracking category
    eventAction: "click",                           // Tracking action
    eventLabel: "call_contact",                     // Tracking label for Call button
  },
  {
    icon: emailIcon, // Email icon
    title: 'contact@truestate.in', // Title for email
    // value: 'contact@truestate.in', // Email address
    link: 'mailto:contact@truestate.in', // Link to open the email client
    eventName: "click_outside_contact_us_email",                         // Tracking event name
    eventCategory: "CTA",                           // Tracking category
    eventAction: "click",                           // Tracking action
    eventLabel: "email_contact",                     // Tracking label for Email button
  },
  {
    icon: demoIcon, // Demo request icon
    title: 'Need a demo?', // Title for demo request
    // description: 'Request a product demo from the team.', // Description text for demo request
    // link: '#', // Temporarily use '#' for the link since we'll handle this with a modal
    onClick: handleOpenCalendly, 
    eventName: "click_outside_contact_us_book_demo",                         // Tracking event name
    eventCategory: "CTA",                           // Tracking category
    eventAction: "click",                           // Tracking action
    eventLabel: "book_demo_contact",                // Tracking label for Book Demo button
  },
];


  return (
    <section 
      className="w-full h-fit bg-cover bg-center bg-fixed bg-no-repeat"
      style={{
        backgroundImage: `url(${careerHeroBg})`, // Inline style for background image
        backgroundAttachment: 'fixed', // Parallax effect: keeps the image fixed while the page scrolls
      }}
    > 
      <div className="container flex flex-col items-center justify-center w-full text-center pt-20 pb-10 px-4 md:px-20 lg:px-28 md:py-14 lg:py-24 gap-8 md:gap-16">
        
        {/* Title and Subtitle Section */}
        <TitleSubtitle 
          title="Get in touch" // Main title for the section
       
        />
        
        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row items-center justify-center shadow-custom-career rounded-lg p-6 md:p-14 gap-8 md:gap-12 w-full lg:w-11/12 backdropBlur-custom-blur bg-white/50 h-full">
          
          {/* QR Code Section */}
          <QRCodeSection /> {/* Displays a QR code, typically for contact or additional information */}

          {/* Divider */}
          <Divider /> {/* Adds a vertical line to separate the QR code and contact information sections */}
          
          {/* Contact Information Section */}
          <ContactCards cards={contactCards} /> {/* Displays a list of contact information cards based on the 'contactCards' array */}
          
        </div>
      </div>
    </section>
  );
};

export default GetInTouchHero;
