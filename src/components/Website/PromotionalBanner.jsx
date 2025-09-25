import { forwardRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";

const PromotionalBanner = forwardRef(({
  isVisible = true,
  
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
  onBannerClick,
  
  // Redux selector for modal state
  modalStateSelector = (state) => state.modal.showSignInModal,
  
  // Additional props
  className = "",
  customStyles = {}
}, ref) => {
  const navigate = useNavigate();
  const showSignInModal = useSelector(modalStateSelector);

  // Default content
  const defaultContent = {
    desktop: {
      title: "Compare new launches near Bengaluru airport by Tata, Sattva and others",
      ctaText: "View report",
      ctaIcon: "→"
    },
    mobile: {
      title: "Compare new launches near Bengaluru airport by Tata, Sattva and others",
      ctaText: "View Report",
      ctaIcon: "→"
    }
  };

  // Default styling
  const defaultStyling = {
    desktop: {
      height: "53px",
      gradient: "from-[#276B32] to-[#1E4E51]",
      titleSize: "text-[16px]",
      titleFont: "font-[Montserrat]",
      ctaSize: "text-[13px]",
      ctaFont: "font-[Lato]",
      borderRadius: "rounded-b-[12px]"
    },
    mobile: {
      height: "81px",
      gradient: "from-[#276B32] to-[#1E4E51]",
      titleSize: "text-[13px]",
      titleFont: "font-[Montserrat]",
      ctaSize: "text-[12px]",
      ctaFont: "font-[Lato]",
      borderRadius: ""
    },
    background: "bg-[#FAFAFA]",
    padding: "px-0 sm:px-[7.5%]"
  };

  // Default images
  const defaultImages = {
    desktopBackground: "/assets/images/banners/build.svg",
    mobileBackground: "/assets/images/banners/building1.svg"
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
    mobile: { ...defaultStyling.mobile, ...styling.mobile },
    background: styling.background || defaultStyling.background,
    padding: styling.padding || defaultStyling.padding
  };

  const finalImages = { ...defaultImages, ...images };
  const finalAnalyticsEvent = { ...defaultAnalyticsEvent, ...analyticsEvent };

  const handleBDAClick = () => {
    if (finalAnalyticsEvent.eventName && analytics) {
      logEvent(analytics, finalAnalyticsEvent.eventName, finalAnalyticsEvent.eventParams);
    }
    
    if (onCtaClick) {
      onCtaClick();
    } else if (navigationPath) {
      navigate(navigationPath);
    }
  };

  const handleBannerClickAction = () => {
    if (onBannerClick) {
      onBannerClick();
    } else {
      handleBDAClick();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`left-0 w-full ${finalStyling.background} ${className}`} ref={ref} style={customStyles.wrapper}>
      <div className={finalStyling.padding}>
        {/* Desktop Banner */}
        <div
          className={`hidden sm:flex w-full h-[${finalStyling.desktop.height}] ${
            showSignInModal 
              ? `bg-gradient-to-r ${finalStyling.desktop.gradient} bg-opacity-0` 
              : `bg-gradient-to-r ${finalStyling.desktop.gradient}`
          } ${finalStyling.desktop.borderRadius} items-center justify-center relative overflow-hidden cursor-pointer`}
          onClick={handleBannerClickAction}
          style={customStyles.desktopBanner}
        >
          {finalImages.desktopBackground && (
            <img
              src={finalImages.desktopBackground}
              alt="background"
              className="absolute right-0 w-[116px] mix-blend-multiply opacity-0.1 top-0 h-full object-cover left-72 md:left-16 lg:left-24 2xl:left-72 overflow-hidden md:right-2"
            />
          )}
          <div className="flex items-center gap-3 relative z-10 px-2">
            <span className={`text-white font-bold ${finalStyling.desktop.titleSize} md:ml-2 ${finalStyling.desktop.titleFont}`}>
              {finalContent.desktop.title}
            </span>
            <button 
              className={`ml-5 md:ml-3 flex items-center gap-1 bg-white text-black ${finalStyling.desktop.ctaSize} ${finalStyling.desktop.ctaFont} pl-2.5 md:pl-1 pr-2 py-1 md:px-1 rounded-md hover:shadow`}
              style={customStyles.ctaButton}
            >
              <div className="flex flex-row items-center px-1 gap-1">
                <span className="text-nowrap">{finalContent.desktop.ctaText}</span>
                {finalContent.desktop.ctaIcon && (
                  <span className="text-[15px] text-bold ml-1.4">{finalContent.desktop.ctaIcon}</span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Banner */}
        <div
          className={`block sm:hidden w-full h-[${finalStyling.mobile.height}] ${
            showSignInModal 
              ? `bg-gradient-to-r ${finalStyling.mobile.gradient} bg-opacity-0` 
              : `bg-gradient-to-r ${finalStyling.mobile.gradient}`
          } ${finalStyling.mobile.borderRadius} relative overflow-hidden py-2 px-0 cursor-pointer`}
          onClick={handleBannerClickAction}
          style={customStyles.mobileBanner}
        >
          {finalImages.mobileBackground && (
            <img
              src={finalImages.mobileBackground}
              alt="background"
              className="absolute right-4 bottom-0 object-cover h-[50px] w-[90px] vs:h-[78px] vs:w-[92px] sr:w-[90px] sr:h-[78px] sl:h-[78px] sl:w-[93px] opacity-0.6 mix-blend-multiply overflow-hidden"
            />
          )}
          <div className="relative z-10 flex flex-col gap-2 justify-center px-4">
            <span className={`text-white font-semibold ${finalStyling.mobile.titleFont} ${finalStyling.mobile.titleSize}`}>
              {finalContent.mobile.title}
            </span>
            <button 
              className={`w-fit flex items-center gap-0.5 bg-white text-black ${finalStyling.mobile.ctaSize} ${finalStyling.mobile.ctaFont} pl-1.5 pr-1 py-0.5 rounded-md hover:shadow`}
              style={customStyles.ctaButton}
            >
              {finalContent.mobile.ctaText}
              {finalContent.mobile.ctaIcon && (
                <span className="text-[13px] font-bold ml-1 mr-1">{finalContent.mobile.ctaIcon}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

PromotionalBanner.displayName = "PromotionalBanner";

export default PromotionalBanner;