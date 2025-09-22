// QRCodeSection.jsx
// This component displays a section with a heading and a QR code image
// that allows users to connect over WhatsApp. The layout is responsive,
// adjusting to different screen sizes using Tailwind CSS classes.

// Import the QR code image asset
import qrCode from '../../assets/contactUs/contactqrcode.webp';

const QRCodeSection = () => {
  return (
    // Main container for the QR code section
    <div className="flex flex-col justify-center items-center md:w-6/12 gap-4 md:gap-6 lg:gap-6 ">
      
      {/* Heading for the section */}
      <h3 className="text-heading-semibold-xs md:text-heading-semibold-xs lg:text-heading-semibold-md font-subheading text-GreenBlack w-full">
        Get in touch over WhatsApp!
      </h3>

      {/* QR Code Image */}
      <img 
        src={qrCode} 
        alt="WhatsApp QR Code" 
        className="h-[13.125rem] md:h-auto xl:max-h-80" 
      />
    </div>
  );
};

export default QRCodeSection;
