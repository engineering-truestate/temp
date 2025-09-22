import React, { useEffect, useState, useRef } from "react";
import { useHits, useInstantSearch, usePagination } from "react-instantsearch";
import PropCard from "./Project_popup/ProjectPopup";
import styles from "./Project_popup/ProjectPopup.module.css";
import Loader from "./Loader";
import { useSelector } from "react-redux";
import { selectLoader } from "../slices/loaderSlice";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";
import { Pagination } from "react-instantsearch";
import CustomPagination from "./CustomPagination";
import { authSlice } from "../slices/authSlice";
import Footer from "../landing/pages/home/Footer";
import NoPropertiesFound from "./NoPropertiesFound/NoPropertiesFound.jsx";

const ProjectGrid = ({ trueS, mainContentRef }) => {
  const { hits, results } = useHits();
  const { refresh, status } = useInstantSearch();
  const { currentPage, previousPage } = useSelector(
    (state) => state.pageTracker
  );
  const { currentScrollPosition } = useSelector((state) => state.projectsState);
  const { indexUiState, setIndexUiState } = useInstantSearch();
  console.log({ hits });

  // current status state represents the current state of the status (idle , loading, stagged)
  // const [currentStatusState, setCurrentStatusState] = useState(0);
  const { searchTerm } = useSelector((state) => state.projectsState);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isReduxLoading = useSelector(selectLoader);

  // console.log(searchTerm, "searchTerm");

  const resetAllFilters = () => {
    logEvent(analytics, "reset_all_filters", {
      event_category: "interaction",
      event_label: "All Filters Cleared",
    });

    // Reset the UI state to clear all refinements
    setIndexUiState((prevState) => ({
      ...prevState,
      refinementList: {},
      query: "",
      menu: {},
      range: {},
    }));
  };

  // useEffect(()=>{
  //  console.log(currentStatusState, 'currentStatusState');
  //  setCurrentStatusState(currentStatusState+1);
  // },[status]);

  // Initial refresh
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Debug logging
  useEffect(() => {
    // console.log("Hits:", hits.length);
    // console.log("Status:", status);
  }, [hits, status]);

  // document.addEventListener("DOMContentLoaded", () => {
  //   const iframe = document.querySelector('iframe[title="reCAPTCHA"]');
  //   if (iframe) {
  //     iframe.style.display = "none";
  //     console.log("Iframe with title 'reCAPTCHA' hidden successfully.");
  //   } else {
  //     console.log("Iframe with title 'reCAPTCHA' not found.");
  //   }
  // });

  const observer = new MutationObserver(() => {
    const iframe = document.querySelector('iframe[title="reCAPTCHA"]');
    if (iframe) {
      iframe.style.display = "none";
      // console.log("Dynamically added iframe with title 'reCAPTCHA' hidden.");
      observer.disconnect(); // Stop observing once it's hidden
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const recaptchaDivs = document.querySelectorAll(".grecaptcha-badge");
    recaptchaDivs.forEach((div) => {
      div.style.display = "none";
    });
    // console.log(`${recaptchaDivs.length} div(s) with class 'grecaptcha-logo' hidden.`);
  });

  const div = document.getElementById("recaptcha-container");
  if (div) {
    div.innerHTML = ""; // Removes all child elements
    // console.log("All child elements of #recaptcha-container removed.");
  }

  mainContentRef = useRef(null);

  // setting the ref to the top (page starts from the top) every time location changes
  useEffect(() => {
    // Try every possible scroll method with both smooth and instant behaviors
    const scrollOptions = { top: 0, left: 0, behavior: "instant" };
    const smoothOptions = { top: 0, left: 0, behavior: "smooth" };

    // 1. Try mainContentRef scroll
    if (mainContentRef.current) {
      // Method 1: scrollTo
      mainContentRef.current.scrollTo(scrollOptions);
      mainContentRef.current.scrollTo(smoothOptions);

      // Method 2: direct scrollTop
      mainContentRef.current.scrollTop = 0;

      // Method 3: scroll
      mainContentRef.current.scroll(scrollOptions);
      mainContentRef.current.scroll(smoothOptions);
    }

    // 2. Try window scroll methods
    window.scrollTo(scrollOptions);
    window.scrollTo(smoothOptions);
    window.scroll(scrollOptions);
    window.scroll(smoothOptions);
    window.pageYOffset = 0;

    // 3. Try document scroll
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 4. Try scrolling all possible parent elements
    const scrollableParents = document.querySelectorAll(
      ".overflow-auto, .overflow-y-auto, .overflow-x-auto"
    );
    scrollableParents.forEach((element) => {
      element.scrollTo(scrollOptions);
      element.scrollTop = 0;
    });

    // 5. Force a reflow to ensure scroll is applied
    requestAnimationFrame(() => {
      if (mainContentRef.current) {
        mainContentRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    });

    // 6. Add a slight delay as fallback
    setTimeout(() => {
      if (mainContentRef.current) {
        mainContentRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    }, 100);

    console.log("Brutal scroll attempted", {
      pathname: location.pathname,
      search: location.search,
      mainContentExists: !!mainContentRef.current,
      windowPageYOffset: window.pageYOffset,
      documentScrollTop: document.documentElement.scrollTop,
      bodyScrollTop: document.body.scrollTop,
      mainContentScrollTop: mainContentRef.current?.scrollTop,
    });
  }, [location.pathname, location.search]); // Listen to both pathname and search changes


  // Observe changes in the document body
  observer.observe(document.body, { childList: true, subtree: true });

  //  console.log(hits) ;

  return (
    <>
      {/* {console.log( "this was reached" , location.pathname , location.search)} */}
      <div className="relative z-1" ref={mainContentRef}>
        <div
          className={`grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-4  ${isAuthenticated ? `md:px-8` : `md:px-20 lg:px-24`} `}
        >
         {hits
         .slice() // copy so original array is untouched
         .sort((a, b) => {
         if (!isAuthenticated) {
         // Only sort when user is NOT logged in
         console.log("Sorting projects for unauthenticated user");
         return (b.recommended === true) - (a.recommended === true);
        }
        // Keep original order when logged in
    return 0;
  })
  .map((project) => (
    <div
      key={project.id || project.objectID}
      className="w-full px-4 sm:px-2"
    >
      <PropCard
        project={project}
        mainContentRef={mainContentRef}
        onClick={() => {
          logEvent(analytics, "click_property_card");
        }}
      />
    </div>
  ))}

          {/* Empty state handling */}
          {results.nbHits === 0 && status === "idle" && (
            <div className="col-span-full">
              <NoPropertiesFound
                trueS={trueS}
                onResetFilters={resetAllFilters}
              />
            </div>
          )}

          {/* Loader */}
          {(status === "loading" || status === "stalled" || isReduxLoading) && (
            <div className="col-span-full flex justify-center my-4 h-[60vh]">
              <Loader />
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center my-8">
          <CustomPagination />
        </div>

        {!isAuthenticated && <Footer />}
      </div>
    </>
  );
};

export default ProjectGrid;
