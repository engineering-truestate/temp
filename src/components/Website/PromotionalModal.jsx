import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import newicon from "/assets/icons/ui/new-badge.svg";
import closeicon from "/assets/icons/navigation/btn-close-modal.svg";
import image4 from "/assets/images/banners/landing-image-4.svg";
import image5 from "/assets/images/banners/landing-image-5.svg";

const PromotionalModal = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const scrollYRef = useRef(0);

  // Session storage key for tracking modal display
  const MODAL_SHOWN_KEY = "home_modal_shown";

  const handleCloseModal = () => {
    setShowModal(false);
    // Mark modal as shown in session storage
    sessionStorage.setItem(MODAL_SHOWN_KEY, "true");
    // Add a small delay before actually closing to allow fade-out animation
    setTimeout(() => {
      setIsModalOpen(false);
    }, 200);
  };

  const handleBDAClick = () => {
    logEvent(analytics, "click_investment_report", {
      Name: "front_investment_report",
    });
    // Mark modal as shown when user clicks the button
    sessionStorage.setItem(MODAL_SHOWN_KEY, "true");
    navigate("/new-launches");
  };

  // Show modal after delay only if not shown before in this session
  useEffect(() => {
    const hasModalBeenShown = sessionStorage.getItem(MODAL_SHOWN_KEY) === "true";

    if (!hasModalBeenShown) {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
        // Small delay to trigger fade-in animation
        setTimeout(() => setShowModal(true), 50);
      }, 7000); // 7 seconds delay

      return () => clearTimeout(timer);
    }
  }, []);

  // Modal scroll handling
  useEffect(() => {
    if (isModalOpen) {
      // Save current scroll position
      scrollYRef.current = window.scrollY;

      // Lock body scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = "100%";
    } else {
      // Unlock body scroll
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      // Restore scroll position from ref
      window.scrollTo(0, scrollYRef.current);
    }

    return () => {
      // cleanup
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isModalOpen]);

  // Don't render anything if modal is not open
  if (!isModalOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-300 ${
        showModal ? "bg-opacity-50" : "bg-opacity-0"
      }`}
    >
      <div className="flex justify-center items-start pt-60 px-4 sm:px-0 h-full overflow-y-auto">
        {/* Desktop/Tablet View */}
        <div
          className={`hidden sm:flex w-full max-w-[639px] h-[344px] bg-gradient-to-r from-[#276B32] to-[#1E4E51] rounded-[8px] relative shadow-lg transition-all duration-300 transform ${
            showModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <img
            src={newicon}
            alt="new badge"
            className="absolute h-[40px] w-[40px] left-6 top-6 cursor-pointer hover:opacity-80 transition-opacity"
          />
          <img
            src={closeicon}
            alt="close icon"
            className="absolute h-[22px] w-[22px] right-4 top-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleCloseModal}
          />
          <img
            src={image4}
            alt="promotional background"
            className="absolute h-[302px] w-[200px] top-12 right-0 opacity-0.6 mix-blend-multiply"
          />
          
          <div className="absolute top-14 left-6 pr-6">
            <div className="text-white font-[Lora] font-semibold text-[36px]">
              Compare new launches near Bengaluru airport by
            </div>
            <div className="text-white font-[Lora] font-semibold text-[36px]">
              Tata, Sattva and others
            </div>
            <div className="text-white font-[Lato] text-[18px]">
              Get the complete report now
            </div>
            
            <button
              className="mt-5 flex items-center gap-1 bg-white text-black text-[13px] font-semibold font-[Lato] pl-3 pr-2 py-1 rounded-md hover:shadow"
              onClick={handleBDAClick}
            >
              View Report
              <span className="text-[16px] text-bold ml-1.5">→</span>
            </button>
          </div>
        </div>

        {/* Mobile View */}
        <div
          className={`block sm:hidden w-full transition-all duration-300 transform ${
            showModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          } 
          max-w-[87%] 
          xs:max-w-[92%] 
          h-[420px] 
          xs:h-[380px]
          max-[350px]:h-[340px]
          bg-gradient-to-b from-[#276B32] to-[#1E4E51] 
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
          max-[350px]:pb-8
        `}
        >
          <img
            src={newicon}
            alt="new badge"
            className="absolute h-[35px] w-[35px] left-5 top-7 cursor-pointer hover:opacity-80 transition-opacity"
          />
          <img
            src={closeicon}
            alt="close icon"
            className="absolute h-[18px] w-[18px] xs:h-[16px] xs:w-[16px] max-[350px]:h-[14px] max-[350px]:w-[14px] right-5 xs:right-4 max-[350px]:right-3 top-5 xs:top-4 max-[350px]:top-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleCloseModal}
          />

          {/* Content */}
          <div className="mt-8 xs:mt-6 max-[350px]:mt-4">
            <div className="text-white font-[Lora] font-semibold text-[22px] xs:text-[20px] max-[350px]:text-[18px]">
              Compare new launches near Bengaluru airport by Tata, Sattva and others
            </div>
            <div className="text-white font-[Lato] text-[14px] xs:text-[13px] max-[350px]:text-[12px] pt-2">
              Get the complete report now
            </div>
            
            <button
              className="mt-2 xs:mt-1 max-[350px]:mt-0 flex items-center gap-1 bg-white text-black text-[13px] xs:text-[12px] max-[350px]:text-[11px] font-semibold font-[Lato] pl-2.5 pr-1 py-1 rounded-md hover:shadow"
              onClick={handleBDAClick}
            >
              View Report
              <span className="text-[13px] text-bold xs:text-[12px] max-[350px]:text-[11px] ml-0 mr-1">
                →
              </span>
            </button>
          </div>

          {/* Background image */}
          <div className="absolute bottom-0 right-0">
            <img
              src={image5}
              alt="promotional background"
              className="h-[170px] w-[160px] mix-blend-multiply xs:h-[140px] xs:w-[150px] max-[350px]:h-[120px] sl:h-[220px] sl:w-[200px] sr:h-[200px] sr:w-[190px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalModal;