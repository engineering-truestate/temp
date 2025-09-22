import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for prop validation
const leftArrow = '/assets/vault/icons/navigation/arrow-left.svg';
const rightArrow = '/assets/vault/icons/navigation/arrow-right.svg';
import { useNavigate } from "react-router-dom";
//import { useSelector } from "react-redux";

const VaultStory = () => {
  const navigate = useNavigate();
  const carouselData = [
    "Track all your property-related investments on one platform",
    "Get free valuation reports every quarter for your properties",
    "Estimate property-related statutory payments - TDS, etc",
    "Access future price calculators for your property",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  //const isLoggedIn = useSelector((state) => state.auth.isAuthenticated); // Access isLoggedIn from Redux state

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : carouselData.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < carouselData.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleSkip = () => {
    navigate("/vault", { replace: true });
  };

  return (
    <div className="bg-[#FAFBFC] flex flex-col items-center justify-start h-auto w-[648px] rounded-[12px] sm:w-[328px] sm:h-auto sm:mt-[0px]">
      <div className="font-noticiaText font-bold text-[48px] text-[#252626] mt-[35px]">
        Vault
      </div>
      <h1 className="mt-[24px] sm:mt-[32px] font-montserrat font-bold text-[24px] text-[#252626] sm:text-[22px] mx-auto text-center">
        Manage RE investments with Vault
      </h1>
      <div className="flex flex-col items-center justify-center text-center w-full mt-[16px] sm:w-[310px] px-[80px]">
        <p className="font-lato text-[18px] text-[#666667] font-normal sm:text-[16px] h-fit sm:w-[264px] sm:h-[57px]">
          {carouselData[currentIndex]}
        </p>
        <div className="flex justify-center mt-[32px]">
          {carouselData.map((_, index) => (
            <span
              key={index}
              className={`w-[35.5px] h-[4px] mx-[3px] rounded-[32px] ${
                currentIndex === index ? "bg-[#153E3B]" : "bg-[#E4E5E6]"
              }`}
            ></span>
          ))}
        </div>
        <div className="flex mt-[36px] space-x-[36px] sm:mt-[24px]">
          <button onClick={handlePrevious} aria-label="Previous">
            <img src={leftArrow} alt="Previous" />
          </button>
          <button onClick={handleNext} aria-label="Next" className="ml-[20px]">
            <img src={rightArrow} alt="Next" />
          </button>
        </div>
      </div>
      <button
        onClick={handleSkip}
        className="font-lato text-[14px] font-bold text-[#153E3B] mt-[24px] mb-[48px] sm:mb-[48px]"
      >
        Back to Vault
      </button>
    </div>
  );
};

VaultStory.propTypes = {
  isLoggedIn: PropTypes.bool,
};

export default VaultStory;
