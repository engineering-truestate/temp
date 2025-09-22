import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import ServiceCard from "../../components/features/ServiceCard"; // Component for displaying individual service cards

// Import Keen Slider CSS
import "keen-slider/keen-slider.min.css";

// Import images for the service cards
import ValuationReport from "../../assets/features/1.svg";
import LocalCompliance from "../../assets/features/2.svg";
import SellYourProperty from "../../assets/features/3.svg";
import TDSPayment from "../../assets/features/4.svg";
import DocumentManagement from "../../assets/features/5.svg";
import LoanManagement from "../../assets/features/6.svg";
import RentalManagement from "../../assets/features/7.svg";
import JoinUsButton from "./JoinUsButton";
import { useSelector } from "react-redux";

// Data for services (image, title, description)
const servicesData = [
  {
    imageSrc: ValuationReport,
    title: "Valuation Report",
    description: "Assess your property's true market value.",
  },
  {
    imageSrc: LocalCompliance,
    title: "Local Compliance",
    description: "Find tenants and draft agreements.",
  },
  {
    imageSrc: SellYourProperty,
    title: "Exit Strategy",
    description: "Get guidance on when to sell.",
  },
  {
    imageSrc: TDSPayment,
    title: "Tax Payment",
    description: "Pay TDS, Property Tax, etc.",
  },
  {
    imageSrc: DocumentManagement,
    title: "Document Management",
    description: "Store your sale deed, e-Khata, etc.",
  },
  {
    imageSrc: LoanManagement,
    title: "Loan Management",
    description: "Track and pay your EMIs.",
  },
  {
    imageSrc: RentalManagement,
    title: "Rental Management",
    description: "Find tenants and draft agreements.",
  },
];

const ServicesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide in the carousel
  const [isMobile, setIsMobile] = useState(false); // Track if the screen is in mobile mode

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Initialize Keen Slider
  const [sliderRef ] = useKeenSlider({
    loop: true, // Enable looping
    slides: {
      perView: 1, // Show 1 slide at a time on mobile
    },
    mode: "snap", // Smooth snap animation
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel); // Update current slide index
    },
  });

  // Detect screen size for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Set mobile mode if the screen width is 768px or less
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Listen for window resize

    return () => window.removeEventListener("resize", handleResize); // Cleanup listener on unmount
  }, []);

  return (
    <section className="">
      <div className=" flex flex-col py-16 md:py-20 lg:py-28 px-4 md:px-20 lg:px-24 gap-10 lg:gap-16 mx-auto ">
        {/* Title and Subtitle */}
        <div className="flex flex-col gap-3 md:gap-4 lg:gap-5 items-center md:text-left">
          {/* Title */}
          <h2 className="text-display-xs md:text-display-sm  lg:text-display-md font-heading text-ShadedGrey">
            <span className="text-GreenBlack "> Already invested?</span>
          </h2>

          {/* Subtitle */}
          <p className="text-heading-medium-xxs md:text-heading-medium-sm lg:text-heading-medium-md font-subheading text-center text-GreenBlack">
            Use Vault by TruEstate to document and manage
          </p>
        </div>

        {/* Service Cards */}
        {/* Display slider for mobile view, grid for larger screens */}
        {isMobile ? (
          <>
            {/* Mobile Carousel */}
            <div className="flex flex-col gap-3">
              <div ref={sliderRef} className="keen-slider">
                {servicesData.map((service, index) => (
                  <div key={index} className="keen-slider__slide">
                    <ServiceCard
                      imageSrc={service.imageSrc}
                      title={service.title}
                      description={service.description}
                    />
                  </div>
                ))}
              </div>

              {/* Dots for the slider */}
              <div className="flex justify-center mt-0 space-x-2">
                {servicesData.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 w-2 rounded-full ${
                      currentSlide === idx ? "bg-GreenBlack" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Grid Layout for Larger Screens */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-10 justify-items-center">
            {servicesData.map((service, index) => (
              <ServiceCard
                key={index}
                imageSrc={service.imageSrc}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>
        )}
        {!isAuthenticated && (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center ">
                <JoinUsButton />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
