import { forwardRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import building from "/assets/images/banners/build.svg";
import building1 from "/assets/images/banners/building1.svg";

const PromotionalBanner = forwardRef(({ isVisible = true }, ref) => {
  const navigate = useNavigate();
  const showSignInModal = useSelector((state) => state.modal.showSignInModal);

  const handleBDAClick = () => {
    logEvent(analytics, "click_investment_report", {
      Name: "front_investment_report",
    });
    navigate("/new-launches");
  };

  if (!isVisible) return null;

  return (
    <div className="left-0 w-full bg-[#FAFAFA]" ref={ref}>
      <div className="px-0 sm:px-[7.5%]">
        {/* Desktop Banner */}
        <div
          className={`hidden sm:flex w-full h-[53px] ${
            showSignInModal 
              ? "bg-gradient-to-r from-[#276B32] to-[#1E4E51] bg-opacity-0" 
              : "bg-gradient-to-r from-[#276B32] to-[#1E4E51]"
          } rounded-b-[12px] items-center justify-center relative overflow-hidden cursor-pointer`}
          onClick={handleBDAClick}
        >
          <img
            src={building}
            alt="background"
            className="absolute right-0 w-[116px] mix-blend-multiply opacity-0.1 top-0 h-full object-cover left-72 md:left-16 lg:left-24 2xl:left-72 overflow-hidden md:right-2"
          />
          <div className="flex items-center gap-3 relative z-10 px-2">
            <span className="text-white font-bold text-[16px] md:ml-2 font-[Montserrat]">
              Compare new launches near Bengaluru airport by Tata, Sattva and others
            </span>
            <button className="ml-5 md:ml-3 flex items-center gap-1 bg-white text-black text-[13px] font-[Lato] pl-2.5 md:pl-1 pr-2 py-1 md:px-1 rounded-md hover:shadow">
              <div className="flex flex-row items-center px-1 gap-1">
                <span className="text-nowrap">View report</span>
                <span className="text-[15px] text-bold ml-1.4">→</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Banner */}
        <div
          className={`block sm:hidden w-full h-[81px] ${
            showSignInModal 
              ? "bg-gradient-to-r from-[#276B32] to-[#1E4E51] bg-opacity-0" 
              : "bg-gradient-to-r from-[#276B32] to-[#1E4E51]"
          } relative overflow-hidden py-2 px-0 cursor-pointer`}
          onClick={handleBDAClick}
        >
          <img
            src={building1}
            alt="background"
            className="absolute right-4 bottom-0 object-cover h-[50px] w-[90px] vs:h-[78px] vs:w-[92px] sr:w-[90px] sr:h-[78px] sl:h-[78px] sl:w-[93px] opacity-0.6 mix-blend-multiply overflow-hidden"
          />
          <div className="relative z-10 flex flex-col gap-2 justify-center px-4">
            <span className="text-white font-semibold font-[Montserrat] text-[13px]">
              Compare new launches near Bengaluru airport by Tata, Sattva and others
            </span>
            <button className="w-fit flex items-center gap-0.5 bg-white text-black text-[12px] font-[Lato] pl-1.5 pr-1 py-0.5 rounded-md hover:shadow">
              View Report
              <span className="text-[13px] font-bold ml-1 mr-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

PromotionalBanner.displayName = "PromotionalBanner";

export default PromotionalBanner;