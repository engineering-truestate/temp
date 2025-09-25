import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";

const PromotionalModal = ({
  // Modal configuration
  isEnabled = true,
  delay = 7000,
  sessionStorageKey = "home_modal_shown",
  
  // Content configuration
  content = {},
  
  // Styling configuration
  styling = {},
  
  // Images configuration
  images = {},
  
  // Navigation and analytics
  onCtaClick,
  navigationPath = "/new-launches",
  analyticsEvent = {},
  
  // Custom handlers
  onModalOpen,
  onModalClose,
  
  // Additional props
  className = "",
  customStyles = {}
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const scrollYRef = useRef(0);

  // Default content
  const defaultContent = {
    desktop: {
      title: "Compare new launches near Bengaluru airport by",
      subtitle: "Tata, Sattva and others",
      description: "Get the complete report now",
      ctaText: "View Report",
      ctaIcon: "→"
    },
    mobile: {
      title: "Compare new launches near Bengaluru airport by Tata, Sattva and others",
      description: "Get the complete report now",
      ctaText: "View Report",
      ctaIcon: "→"
    }
  };

  // Default styling
  const defaultStyling = {
    desktop: {
      maxWidth: "639px",
      height: "344px",
      gradient: "from-[#276B32] to-[#1E4E51]",
      titleSize: "text-[36px]",
      descriptionSize: "text-[18px]",
      ctaSize: "text-[13px]"
    },
    mobile: {
      maxWidth: "87%",
      height: "420px",
      gradient: "from-[#276B32] to-[#1E4E51]",
      titleSize: "text-[22px]",
      descriptionSize: "text-[14px]",
      ctaSize: "text-[13px]"
    }
  };

  // Default images
  const defaultImages = {
    newBadge: "/assets/icons/ui/new-badge.svg",
    closeIcon: "/assets/icons/navigation/btn-close-modal.svg",
    desktopBackground: "/assets/images/banners/landing-image-4.svg",
    mobileBackground: "/assets/images/banners/landing-image-5.svg"
  };

  // Default analytics event
  const defaultAnalyticsEvent = {
    eventName: "click_investment_report",
    eventParams: {
      Name: "front_investment_report"
    }
  };

  // Merge props with defaults
  const finalContent = {
    desktop: { ...defaultContent.desktop, ...content.desktop },
    mobile: { ...defaultContent.mobile, ...content.mobile }
  };

  const finalStyling = {
    desktop: { ...defaultStyling.desktop, ...styling.desktop },
    mobile: { ...defaultStyling.mobile, ...styling.mobile }
  };

  const finalImages = { ...defaultImages, ...images };
  const finalAnalyticsEvent = { ...defaultAnalyticsEvent, ...analyticsEvent };

  const handleCloseModal = () => {
    setShowModal(false);
    sessionStorage.setItem(sessionStorageKey, "true");
    
    if (onModalClose) {
      onModalClose();
    }
    
    setTimeout(() => {
      setIsModalOpen(false);
    }, 200);
  };

  const handleCtaClick = () => {
    if (finalAnalyticsEvent.eventName && analytics) {
      logEvent(analytics, finalAnalyticsEvent.eventName, finalAnalyticsEvent.eventParams);
    }
    
    sessionStorage.setItem(sessionStorageKey, "true");
    
    if (onCtaClick) {
      onCtaClick();
    } else if (navigationPath) {
      navigate(navigationPath);
    }
  };

  useEffect(() => {
    if (!isEnabled) return;
    
    const hasModalBeenShown = sessionStorage.getItem(sessionStorageKey) === "true";

    if (!hasModalBeenShown) {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
        
        if (onModalOpen) {
          onModalOpen();
        }
        
        setTimeout(() => setShowModal(true), 50);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isEnabled, delay, sessionStorageKey, onModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollYRef.current);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isModalOpen]);

  if (!isModalOpen || !isEnabled) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-300 ${
        showModal ? "bg-opacity-50" : "bg-opacity-0"
      } ${className}`}
      style={customStyles.overlay}
    >
      <div className="flex justify-center items-start pt-60 px-4 sm:px-0 h-full overflow-y-auto">
        {/* Desktop/Tablet View */}
        <div
          className={`hidden sm:flex w-full max-w-[${finalStyling.desktop.maxWidth}] h-[${finalStyling.desktop.height}] bg-gradient-to-r ${finalStyling.desktop.gradient} rounded-[8px] relative shadow-lg transition-all duration-300 transform ${
            showModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          style={customStyles.desktopModal}
        >
          {finalImages.newBadge && (
            <img
              src={finalImages.newBadge}
              alt="new badge"
              className="absolute h-[40px] w-[40px] left-6 top-6 cursor-pointer hover:opacity-80 transition-opacity"
            />
          )}
          
          <img
            src={finalImages.closeIcon}
            alt="close icon"
            className="absolute h-[22px] w-[22px] right-4 top-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleCloseModal}
          />
          
          {finalImages.desktopBackground && (
            <img
              src={finalImages.desktopBackground}
              alt="promotional background"
              className="absolute h-[302px] w-[200px] top-12 right-0 opacity-0.6 mix-blend-multiply"
            />
          )}
          
          <div className="absolute top-14 left-6 pr-6">
            <div className={`text-white font-[Lora] font-semibold ${finalStyling.desktop.titleSize}`}>
              {finalContent.desktop.title}
            </div>
            {finalContent.desktop.subtitle && (
              <div className={`text-white font-[Lora] font-semibold ${finalStyling.desktop.titleSize}`}>
                {finalContent.desktop.subtitle}
              </div>
            )}
            <div className={`text-white font-[Lato] ${finalStyling.desktop.descriptionSize}`}>
              {finalContent.desktop.description}
            </div>
            
            <button
              className={`mt-5 flex items-center gap-1 bg-white text-black ${finalStyling.desktop.ctaSize} font-semibold font-[Lato] pl-3 pr-2 py-1 rounded-md hover:shadow`}
              onClick={handleCtaClick}
              style={customStyles.ctaButton}
            >
              {finalContent.desktop.ctaText}
              {finalContent.desktop.ctaIcon && (
                <span className="text-[16px] text-bold ml-1.5">
                  {finalContent.desktop.ctaIcon}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile View */}
        <div
          className={`block sm:hidden w-full transition-all duration-300 transform ${
            showModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          } 
          max-w-[${finalStyling.mobile.maxWidth}] 
          xs:max-w-[92%] 
          h-[${finalStyling.mobile.height}] 
          xs:h-[380px]
          max-[350px]:h-[340px]
          bg-gradient-to-b ${finalStyling.mobile.gradient}
          rounded-[8px] 
          relative 
          shadow-lg 
          py-8 
          xs:py-6
          max-[350px]:py-4
          px-5 
          xs:px-4
          max-[350px]:px-3
          pb-16 
          xs:pb-12
          max-[350px]:pb-8`}
          style={customStyles.mobileModal}
        >
          {finalImages.newBadge && (
            <img
              src={finalImages.newBadge}
              alt="new badge"
              className="absolute h-[35px] w-[35px] left-5 top-7 cursor-pointer hover:opacity-80 transition-opacity"
            />
          )}
          
          <img
            src={finalImages.closeIcon}
            alt="close icon"
            className="absolute h-[18px] w-[18px] xs:h-[16px] xs:w-[16px] max-[350px]:h-[14px] max-[350px]:w-[14px] right-5 xs:right-4 max-[350px]:right-3 top-5 xs:top-4 max-[350px]:top-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleCloseModal}
          />

          <div className="mt-8 xs:mt-6 max-[350px]:mt-4">
            <div className={`text-white font-[Lora] font-semibold ${finalStyling.mobile.titleSize} xs:text-[20px] max-[350px]:text-[18px]`}>
              {finalContent.mobile.title}
            </div>
            <div className={`text-white font-[Lato] ${finalStyling.mobile.descriptionSize} xs:text-[13px] max-[350px]:text-[12px] pt-2`}>
              {finalContent.mobile.description}
            </div>
            
            <button
              className={`mt-2 xs:mt-1 max-[350px]:mt-0 flex items-center gap-1 bg-white text-black ${finalStyling.mobile.ctaSize} xs:text-[12px] max-[350px]:text-[11px] font-semibold font-[Lato] pl-2.5 pr-1 py-1 rounded-md hover:shadow`}
              onClick={handleCtaClick}
              style={customStyles.ctaButton}
            >
              {finalContent.mobile.ctaText}
              {finalContent.mobile.ctaIcon && (
                <span className="text-[13px] text-bold xs:text-[12px] max-[350px]:text-[11px] ml-0 mr-1">
                  {finalContent.mobile.ctaIcon}
                </span>
              )}
            </button>
          </div>

          {finalImages.mobileBackground && (
            <div className="absolute bottom-0 right-0">
              <img
                src={finalImages.mobileBackground}
                alt="promotional background"
                className="h-[170px] w-[160px] mix-blend-multiply xs:h-[140px] xs:w-[150px] max-[350px]:h-[120px] sl:h-[220px] sl:w-[200px] sr:h-[200px] sr:w-[190px]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionalModal;