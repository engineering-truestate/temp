import { useState, useEffect, useRef } from "react";
import PropCard from "./PropertyCard";

import { Navigate, useNavigate } from "react-router-dom";
import ArrowLeft from "../../assets/home/arrowleft.svg";
import ArrowRight from "../../assets/home/arrowright.svg";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../../firebase";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { COLLECTIONS } from "../../../constants/collections";


const getTopAndLeastIRRs = async () => {
  try {
    // Reference to the "assetData" collection
    const assetDataRef = collection(db, COLLECTIONS.PRE_LAUNCH);

    // Fetch all documents
    const allProjectsSnapshot = await getDocs(assetDataRef);

    // Process all projects: map, filter, and sort
    const allProjects = allProjectsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() })) // Map to array of objects
      .filter((doc) => doc.showOnTruEstate == true && doc.projectOverview.stage == "pre launch" && doc.projectOverview?.availability!="sold out")
      .sort((a, b) => a.cagr - b.cagr); // Sort by cagr in ascending order

    console.log("new check", allProjects.length, allProjects)

    // console.log(allProjects);

    // Top 2 IRRs: one plot and one apartment (if available)
    const topIRRs = [];
    const topPlot = allProjects
      .slice()
      .reverse() // Reverse to get highest CAGR
      .find((doc) => doc.assetType === "plot");
    const topApartment = allProjects
      .slice()
      .reverse()
      .find((doc) => doc.assetType === "apartment");

    if (topPlot) topIRRs.push(topPlot);
    if (topApartment) topIRRs.push(topApartment);

    // Least 2 IRRs: one plot and one apartment (if available)
    const leastIRRs = [];
    const leastPlot = allProjects.find((doc) => doc.assetType === "plot");
    const leastApartment = allProjects.find(
      (doc) => doc.assetType === "apartment"
    );

    if (leastPlot) leastIRRs.push(leastPlot);
    if (leastApartment) leastIRRs.push(leastApartment);

    // Pick 2 random projects
    const randomProjects = allProjects
      .sort(() => Math.random() - 0.5) // Shuffle projects
      .slice(0, 2); // Pick 2 random projects

    // Combine results
    const projects = [...topIRRs, ...leastIRRs, ...randomProjects];

    // console.log("Top 2 IRRs:", topIRRs);
    // console.log("Least 2 IRRs:", leastIRRs);
    // console.log("Random Projects:", randomProjects);
    // console.log("Projects:", projects);

    // Remove duplicates
    const uniqueProjects = Array.from(new Set(projects));
    return uniqueProjects;
  } catch (error) {
    console.error("Error fetching and processing projects:", error);
    throw error; // Re-throw the error for further handling
  }
};

const Carousel = () => {
  const scrollContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  const getItemsPerPage = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width >= 1280) return 3; // lg screens
      if (width >= 768) return 2; // md screens
      return 1; // mobile screens
    }
    return 3;
  };

  const [itemsPerPage, setItemsPerPage] = useState(() => getItemsPerPage());

  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = getItemsPerPage();
      setItemsPerPage(newItemsPerPage);

      const newTotalPages = Math.ceil(projects.length / newItemsPerPage);
      if (activeIndex >= newTotalPages) {
        setActiveIndex(Math.max(0, newTotalPages - 1));
        scrollToIndex(Math.max(0, newTotalPages - 1));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex, projects.length]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getTopAndLeastIRRs();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      const scrollPercentage = scrollLeft / (scrollWidth - clientWidth);
      const newIndex = Math.round(scrollPercentage * (totalPages - 1));

      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < totalPages) {
        setActiveIndex(newIndex);
      }
    }
  };

  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      const maxScroll = scrollWidth - containerWidth;
      const scrollPosition = (index / (totalPages - 1)) * maxScroll;

      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  const handleArrowClick = (direction) => {
    if (direction === "next" && activeIndex < totalPages - 1) {
      scrollToIndex(activeIndex + 1);
    } else if (direction === "prev" && activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    }
  };

  console.log("in carousel", projects.length, projects)

  return (
    <div className="relative w-full h-full px-4 md:px-20 lg:px-24 mb-16">
      <div className="flex flex-col sm:flex-row justify-between py-4 w-full">
      <h2 className="font-bold text-xl font-['Montserrat'] sm:text-2xl md:text-4xl text-gray-800 mb-2 sm:mb-0">
        Active Investment Opportunities
      </h2>
      <button
          className="flex items-center text-[#205E59] font-black font-lato text-sm sm:text-base transition-colors hover:text-teal-800"
          onClick={() => {
            navigate("/properties") 
            logEvent(analytics, "click_explore_prop_card", { Name: "Explore all Properties", });
          }
          }
      >
        Explore all Properties
          <img src={ArrowLeft} color="#205E59" className="ml-2" />
        </button>
      </div>

      <div className="relative z-20 mt-4">
        <div className="relative  ">
          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto scroll-smooth hide-scrollbar pb-1"
            style={{
              scrollSnapType: "x mandatory",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {projects.map((project) => (
              <div
                key={project.id}
                className="w-[calc(100vw-2rem)] md:w-[calc((100vw-10rem-1rem)/2)] lg:w-[calc((100vw-12rem-2.5rem)/3)]"
                style={{ scrollSnapAlign: "start" }}
              >
                <PropCard project={project} />
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-5">
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === index ? "bg-[#205E59]" : "bg-gray-300"
                  }`}
                  aria-label={`Scroll to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-5">
              <button
                onClick={() => {
                  handleArrowClick("prev") 
                  logEvent(analytics, "click_previous_prop_card", { Name: "Explore_Prop_cards", });
                }}
                disabled={activeIndex === 0}
                className={`cursor-pointer ${
                  activeIndex === 0 ? "opacity-50" : ""
                }`}
              >
                <img src={ArrowRight} alt="Previous" />
              </button>
              <button
                onClick={() => {
                  handleArrowClick("next") 
                  logEvent(analytics, "click_next_prop_card", { Name: "Explore_Prop_cards", });
                }}
                disabled={activeIndex === totalPages - 1}
                className={`cursor-pointer ${
                  activeIndex === totalPages - 1 ? "opacity-50" : ""
                }`}
              >
                <img src={ArrowLeft} alt="Next" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background */}
      {/* <div className="absolute md:top-0 lg:top-0 inset-0 hidden md:flex justify-center items-center w-full h-full">
        <img
          src={BackGrid}
          alt="Background Grid"
          className="h-fit w-fit object-cover opacity-50"
        />
      </div> */}
    </div>
  );
};

export default Carousel;
