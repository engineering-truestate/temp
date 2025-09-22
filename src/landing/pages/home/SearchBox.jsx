import { useState, useEffect, useRef } from "react";
import Search from "../../assets/home/Search.svg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../../firebase";

const SearchBox = () => {
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
            `/properties?truEstatePreLaunch%5Bquery%5D=${encodeURIComponent(query)}`
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
    <div className="flex max-w-[420px] md:w-full items-center md:max-w-[615px] h-[52px] border border-gray-500 rounded-lg overflow-hidden bg-white pl-4">
      <img src={Search} className="w-6 h-6 mr-3 " />
      <input
        type="text"
        placeholder={placeholder}
        className="flex-grow text-sm focus:outline-none h-full font-lato text-[16px] font-medium leading-[24px] placeholder-gray-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onClick={() => {
          logEvent(analytics, "input_search_home");
        }}
      />
      <button
        className="w-fit bg-[#153E3B] text-white text-sm font-medium px-4 md:px-8 h-full rounded-lg hover:bg-[#153E3B] transition"
        onClick={() => {
          handleSearch();
          logEvent(analytics, "click_search_button_home");
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBox;
