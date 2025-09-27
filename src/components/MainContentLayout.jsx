import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import SidebarWithLogo from "./Sidebar/sidebar";

import HelpModal from "./Help/HelpModal";
import AgentModal from "./AgentModal/AgentModal";

import { useDispatch, useSelector } from "react-redux";
import { NavBlocker } from "./helper/navBlocker";

import ConfirmationModal from "./Vault/ConfirmationModal";
import Loader from "./Loader";
import { setEditing } from "../slices/userSlice";
import { setVaultFormActive } from "../slices/vaultConfirmationSlice";
import { selectUserPhoneNumber } from "../slices/userAuthSlice";
import { fetchUserProfile } from "../slices/userSlice";
import { subscribeToUserDoc } from "../slices/userAuthSlice";
import { setDbCheck, signIn } from "../slices/authSlice";

import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";

import { InstantSearch, Configure } from "react-instantsearch";
import { algoliaService } from "../services/algoliaService";
import AppHeader from "./Headers/AppHeader";

function MainContentLayout({ children, pageTitle, showLoader = true }) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const pendingRoute = useSelector(
    (state) => state.vaultConfirmation.pendingRoute
  );
  const userPhoneNumber = useSelector(selectUserPhoneNumber);

  useEffect(() => {
    dispatch(setDbCheck(userPhoneNumber));
  }, []);

  useEffect(() => {
    const fetchUserOnReload = async () => {
      dispatch(fetchUserProfile(userPhoneNumber));
      await subscribeToUserDoc({
        phoneNumber: userPhoneNumber,
      })(dispatch);
      if (userPhoneNumber) dispatch(signIn({ phoneNumber: userPhoneNumber }));
    };

    fetchUserOnReload();
  }, [userPhoneNumber]);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [currentIndex, setCurrentIndex] = useState(
    algoliaService.getIndexName(isAuthenticated)
  );

  useEffect(() => {
    setCurrentIndex(algoliaService.getIndexName(isAuthenticated));
  }, [isAuthenticated]);

  const [initialProperties, setInitialProperties] = useState(
    "showOnTruEstate:true"
  );
  const [initialHits] = useState(12);

  NavBlocker();

  const indexName = currentIndex;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [HelpmodalOpen, setHelpModalOpen] = useState(false);
  const [AgentmodalOpen, setAgentModalOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleHelpModal = () => setHelpModalOpen(!HelpmodalOpen);

  const toggleAgentModal = () => {
    const page_location = location.pathname;

    logEvent(analytics, "investment_manager_button_click", {
      page_location: page_location,
    });

    setAgentModalOpen(!AgentmodalOpen);
  };

  const mainContentRef = useRef(null);

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
      if (mainContentRef.current) {
        mainContentRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    });

    setTimeout(() => {
      if (mainContentRef.current) {
        mainContentRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    }, 100);
  }, [location.pathname, location.search]);

  const helpModalRef = useRef(null);
  const helpSidebarRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      helpModalRef.current &&
      helpSidebarRef.current &&
      !helpSidebarRef.current.contains(event.target) &&
      !helpModalRef.current.contains(event.target)
    ) {
      toggleHelpModal();
    }
  };

  useEffect(() => {
    if (HelpmodalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleHelpModal, HelpmodalOpen]);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmFunction, setConfirmFunction] = useState(null);

  const handleConfirmLeave = () => {
    setShowConfirmationModal(false);
    confirmFunction();
    dispatch(setEditing(false));
    localStorage.removeItem("unsavedProfileData");
  };

  const handleConfirmNavigation = () => {
    setShowVaultConfirmationModal(false);
    dispatch(setVaultFormActive(false));
    navigate(pendingRoute);
  };

  const [showVaultConfirmationModal, setShowVaultConfirmationModal] =
    useState(false);

  useEffect(() => {
    if (location.pathname.includes("/auction/bda-auction")) {
      setInitialProperties("");
      setCurrentIndex(algoliaService.getAuctionIndex("bda"));
    } else if (location.pathname.startsWith("/properties")) {
      setInitialProperties("showOnTruEstate:true");
      setCurrentIndex(algoliaService.getIndexName(isAuthenticated));
    } else if (location.pathname.startsWith("/auction")) {
      setInitialProperties("showOnTruEstate:true");
      setCurrentIndex(algoliaService.getAuctionIndex("regular"));
    } else {
      setInitialProperties("showOnTruEstate:true");
      setCurrentIndex(algoliaService.getIndexName(isAuthenticated));
    }
  }, [location.pathname, isAuthenticated]);

  return (
    <>
      <div className="flex h-screen ${styles.main-content-container} ">
        {/* Sidebar */}
        {isAuthenticated && (
          <div
            className={`fixed h-full transition-transform duration-300   ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 z-[50] w-auto`}
          >
            <SidebarWithLogo
              sidebarOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              toggleHelpModal={toggleHelpModal}
              HelpmodalOpen={HelpmodalOpen}
              toggleAgentModal={toggleAgentModal}
              helpSidebarRef={helpSidebarRef}
              setShowConfirmationModal={setShowConfirmationModal}
              setShowVaultConfirmationModal={setShowVaultConfirmationModal}
              setConfirmFunction={setConfirmFunction}
            />
          </div>
        )}
        <InstantSearch
          searchClient={algoliaService.client}
          indexName={indexName}
          routing={true}
        >
          <Configure
            analytics={true}
            hitsPerPage={initialHits}
            filters={initialProperties}
          />
          {/* Main Content Area */}
          <div
            className={`flex-1 ${
              isAuthenticated ? "md:ml-[9rem] lg:ml-[12.5rem]" : "mx-auto"
            } h-full overflow-x-auto`}
            style={{ height: "calc(100vh - 5px)" }}
            ref={mainContentRef}
          >
            {/* App Header */}
            {isAuthenticated && (
              <AppHeader
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                toggleAgentModal={toggleAgentModal}
                pageTitle={pageTitle}
              />
            )}

            {/* Sidebar overlay for mobile */}
            {sidebarOpen && isAuthenticated && (
              <div
                className="fixed inset-0 bg-black opacity-50 z-[49]"
                onClick={toggleSidebar}
              ></div>
            )}

            {/* Content area (below header) */}
            <div className="relative">
              {/* Loader only overlays children */}
              {showLoader && <Loader />}

              <div className="relative">{children}</div>
            </div>
          </div>
        </InstantSearch>

        {/* Modals and Overlays */}
        {HelpmodalOpen && (
          <HelpModal
            closeHelpModal={toggleHelpModal}
            helpModalRef={helpModalRef}
          />
        )}
        {AgentmodalOpen && <AgentModal closeAgentModal={toggleAgentModal} />}

        <ConfirmationModal
          isOpen={showConfirmationModal}
          onCancel={() => {
            setShowConfirmationModal(false);
          }}
          onConfirm={handleConfirmLeave}
        />

        {showVaultConfirmationModal && location.pathname != "*/vault/*" && (
          <ConfirmationModal
            isOpen={showVaultConfirmationModal}
            onConfirm={handleConfirmNavigation}
            onCancel={() => {
              setShowVaultConfirmationModal(false);
            }}
            title="Want to leave this page?"
            message="You have unsaved changes in the form. Any unsaved data will be lost."
            submitLabel="Continue"
          />
        )}
      </div>
    </>
  );
}

export default MainContentLayout;
