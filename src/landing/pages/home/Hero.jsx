import { useState, useEffect, useRef } from "react";
import LargeButton from "../../components/button/LargeButton";
import BackGrid from "../../assets/home/Vector.png";
import interfaceImg from "../../assets/home/Interfaceimg.webp";
import fwdArrow from "../../assets/home/fwdArrow.svg";
import Search from "../../assets/home/Search.svg";
import InvManager from "../../../utils/InvManager";
import PropCard from "./PropertyCard";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import ListIconLeft from "../../assets/home/BackwardArrow.svg";
import ListIconRight from "../../assets/home/ForwardArrow.svg";
import Reddot from "../../assets/home/reddot.png";
import RightArrow from "../../assets/home/ArrowRight.png";
import ChangeWord from "./ChangeWord";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setShowSignInModal } from "../../../slices/modalSlice";
import home from "../../assets/home/home.png";
import icon1 from "../../assets/home/icon1.svg";
import icon2 from "../../assets/home/icon2.svg";
import icon3 from "../../assets/home/icon3.svg";
import icon4 from "../../assets/home/icon4.svg";
import JoinUsButton from "./JoinUsButton";
import compass from "../../assets/home/compass.svg";
import evaluate from "../../assets/home/evaluate.svg";
import manage from "../../assets/home/manage.svg";
import SearchBox from "./SearchBox";

const LandingPage = () => {
  // State to track the current word being typed (Investing, Discovering, Managing)
  const [currentWord, setCurrentWord] = useState("");
  const navigate = useNavigate();
  // console.log("ok");
  const dispatch = useDispatch();

  const inputRef = useRef(null);

  const carouselRef = useRef(null);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Scroll Left
  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -300, behavior: "smooth" }); // Adjust based on card width
  };

  // Scroll Right
  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 300, behavior: "smooth" }); // Adjust based on card width
  };

  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      isAuthenticated
        ? navigate(
            `/properties?property-data%5Bquery%5D=${encodeURIComponent(query)}`
          )
        : navigate(
            `/properties?truEstate_preLaunch_outside%5Bquery%5D=${encodeURIComponent(
              query
            )}`
          );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const [placeholder, setPlaceholder] = useState(
    "Search for any project, micro market, developer"
  );

  useEffect(() => {
    const updatePlaceholder = () => {
      if (window.innerWidth < 768) {
        setPlaceholder("Search for any project ");
      } else {
        setPlaceholder("Search for any project, micro market or developer");
      }
    };

    // Initial call to set placeholder on mount
    updatePlaceholder();

    // Add event listener for window resize
    window.addEventListener("resize", updatePlaceholder);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", updatePlaceholder);
    };
  }, []);

  return (
    <div className="  lg:h-full overflow-hidden pt-4   lg:pb-[0px]   px-4 md:px-20 lg:px-24  ">
      <div className="bg-[#BFE9E6]   xl:flex  justify-between gap-[48px]   rounded-[20px]   ">
        {/* Left Section */}
        <div className="flex-1 py-7 px-5 lg:px-12 xl:py-14 xl:pl-12 flex flex-col justify-center max-w-[1200px]">
          <div className="font-[Lora] font-bold text-[32px]  xl:text-[44px] xl:leading-[3.575rem] text-[#151413] mb-8">
            Find the best real estate investment opportunities in Bengaluru
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-3xl">
            <div className="flex flex-row gap-4">
              <img
                src={compass}
                className="w-6 h-6 mt-1 flex-shrink-0"
                alt="compass"
              />
              <div className="flex flex-col gap-1">
                <div className="font-montserrat text-xl md:text-[22px] font-bold text-[#151413] leading-tight">
                  Discover
                </div>
                <div className=" flex flex-col font-lato text-sm md:text-base font-medium text-[#433F3E] max-w-[240px]">
                  <div>10,000+ villas/plots/</div>
                  <div>apartments</div>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <img
                src={evaluate}
                className="w-6 h-6 mt-1 flex-shrink-0"
                alt="compass"
              />
              <div className="flex flex-col gap-1">
                <div className="font-montserrat text-xl md:text-[22px] font-bold text-[#151413] leading-tight">
                  Evaluate
                </div>
                <div className="font-lato text-sm md:text-base font-medium text-[#433F3E] max-w-[240px]">
                  100+ project investment reports
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <img
                src={manage}
                className="w-6 h-6 mt-1 flex-shrink-0"
                alt="compass"
              />
              <div className="flex flex-col gap-1">
                <div className="font-montserrat text-xl md:text-[22px] font-bold text-[#151413] leading-tight">
                  Manage
                </div>
                <div className="font-lato text-sm md:text-base font-medium text-[#433F3E] max-w-[240px]">
                  Get free tax and loan support
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}

          <div className="relative w-full h-full">
            <div className="relative z-20 md:flex mt-10 cursor-pointer">
              {/* { isAuthenticated ? (
                <div className="flex max-w-[420px] md:w-full items-center md:max-w-[615px] h-[52px] border border-gray-500 rounded-lg overflow-hidden bg-white pl-4">
                  <img src={Search} className="w-6 h-6 mr-3 " />
                  <input
                    type="text"
                    placeholder={placeholder}
                    className="flex-grow text-sm focus:outline-none h-full font-lato text-[16px] font-medium leading-[24px] placeholder-gray-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    className="w-fit bg-[#153E3B] text-white text-sm font-medium px-4 md:px-8 h-full rounded-lg hover:bg-[#153E3B] transition"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
                ):(
            <JoinUsButton/>
            )
          } */}
              {isAuthenticated ? <SearchBox /> : <JoinUsButton />}
            </div>
          </div>
        </div>

        {/* Right Section (Image) */}
        <div className=" flex flex-col mt-10 xl:mt-0 pl-10 ">
          <img
            src={home}
            className="w-full max-w-[250px] max-h-[260px] 
                sm:max-w-[300px] sm:max-h-[310px] 
                md:max-w-[415px] md:max-h-[380px]  
                lg:max-w-[480px] lg:max-h-[420px]
                xl:max-w-[540px] xl:max-h-[474px]
                rounded-[20px] mt-auto ml-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
