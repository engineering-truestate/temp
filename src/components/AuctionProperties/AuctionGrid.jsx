import { useEffect,useRef } from "react";
import { useHits, useInstantSearch } from "react-instantsearch";
import AuctionCard from "../Project_popup/AuctionPopup";
import Loader from "../Loader";
import { useSelector } from "react-redux";
import { selectLoader } from "../../slices/loaderSlice";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import CustomPagination from "../CustomPagination";
import Footer from "../../landing/pages/home/Footer";
import NoPropertiesFound from "../NoPropertiesFound/NoPropertiesFound.jsx";

const AuctionGrid = ({ trueS, mainContentRef }) => {
  // Algolia search state
  const { hits, results } = useHits();
  const { refresh, status } = useInstantSearch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isReduxLoading = useSelector(selectLoader);

  // Ref for scroll restoration
  mainContentRef = useRef(null);

  // Reset Filters
  const resetAllFilters = () => {
    logEvent(analytics, "auction_reset_all_filters", {
      event_category: "interaction",
      event_label: "All Filters Cleared",
      page_type: "auction",
    });
  };

  // Initial refresh
  useEffect(() => {
    refresh();
  }, [refresh]);


  // Hide Recaptcha iframe and badge
  const observer = new MutationObserver(() => {
    const iframe = document.querySelector('iframe[title="reCAPTCHA"]');
    if (iframe) {
      iframe.style.display = "none";
      observer.disconnect();
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const recaptchaDivs = document.querySelectorAll(".grecaptcha-badge");
    recaptchaDivs.forEach((div) => {
      div.style.display = "none";
    });
  });

  const div = document.getElementById("recaptcha-container");
  if (div) div.innerHTML = "";

  observer.observe(document.body, { childList: true, subtree: true });

  // Scroll to top on navigation
  useEffect(() => {
    const scrollOptions = { top: 0, left: 0, behavior: "instant" };
    const smoothOptions = { top: 0, left: 0, behavior: "smooth" };

    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(scrollOptions);
      mainContentRef.current.scrollTo(smoothOptions);
      mainContentRef.current.scrollTop = 0;
      mainContentRef.current.scroll(scrollOptions);
      mainContentRef.current.scroll(smoothOptions);
    }

    window.scrollTo(scrollOptions);
    window.scrollTo(smoothOptions);
    window.scroll(scrollOptions);
    window.scroll(smoothOptions);
    window.pageYOffset = 0;

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const scrollableParents = document.querySelectorAll(
      ".overflow-auto, .overflow-y-auto, .overflow-x-auto"
    );
    scrollableParents.forEach((element) => {
      element.scrollTo(scrollOptions);
      element.scrollTop = 0;
    });

    requestAnimationFrame(() => {
      if (mainContentRef.current) mainContentRef.current.scrollTop = 0;
      window.scrollTo(0, 0);
    });

    setTimeout(() => {
      if (mainContentRef.current) mainContentRef.current.scrollTop = 0;
      window.scrollTo(0, 0);
    }, 100);
  }, [location.pathname, location.search]);

  return (
    <>
      <div className="relative z-0 bg-white" ref={mainContentRef}>
        <div
          className={`grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-4 ${
            isAuthenticated ? `md:px-8` : `md:px-20 lg:px-24`
          }`}
        >
          {hits.map((auction) => (
            <div
              key={auction.id || auction.objectID}
              className="w-full px-4 sm:px-2"
              onClick={() => {
                console.log(auction);
              }}
            >
              <AuctionCard
                project={auction}
                mainContentRef={mainContentRef}
                onClick={() => {
                  logEvent(analytics, "auction_click_property_card", {
                    page_type: "auction",
                    auction_id: auction.id || auction.objectID,
                  });
                }}
              />
            </div>
          ))}

          {/* Empty State */}
          {results.nbHits === 0 && status === "idle" && (
            <div className="col-span-full">
              <NoPropertiesFound
                trueS={trueS}
                onResetFilters={resetAllFilters}
                title="No auction property available"
                subtitle={trueS === "true"
                  ? "Due to some technical issue we're unable to show the recommended auction properties. Please try again later!"
                  : "Please edit your preferences and try again."}
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

        {/* Footer */}
        {!isAuthenticated && <Footer />}
      </div>
    </>
  );
};

export default AuctionGrid;
