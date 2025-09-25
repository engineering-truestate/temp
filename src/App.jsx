import { useEffect } from "react";
import {
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import { useToast } from "./hooks/useToast.jsx";
import { useSelector } from "react-redux";

// Centralized routes
import AppRoutes from "./routes";

// Corrected imports from the landing folder
import Navbar from "./landing/components/navbar/Navbar";
import Footer from "./landing/pages/home/Footer";
import ScrollToTop from "./landing/components/ScrollToTop";

import { logEvent, setUserId, setUserProperties } from "firebase/analytics";
import { analytics } from "./firebase.js";

import { selectUserPhoneNumber } from "./slices/userAuthSlice.js";
import ToastsContainer from "./components/Toast/ToastsContainer.jsx";
import { useTrackUTMParams } from "./hooks/useTrackUTMParams.js";

import SignIn from "./pages/SignIn";

// Import the Modal Config Context
import { ModalConfigProvider } from "./contexts/ModalConfigContext";

function AppWrapper() {
  return (
    <Router>
      {/* Wrap the entire app with ModalConfigProvider */}
      <ModalConfigProvider>
        <App />
      </ModalConfigProvider>
    </Router>
  );
}

function App() {
  const location = useLocation();
  const { toasts, removeToast } = useToast();
  const userPhoneNumber = useSelector(selectUserPhoneNumber);
  const isAuthenticated = useSelector((state)=>state.auth.isAuthenticated);
  const {showSignInModal} = useSelector((state)=>state.modal);

  
  useTrackUTMParams();

  useEffect(() => {
    const pageUrl = location.pathname + location.search;
    logEvent(analytics, "page_view", { screen_name: pageUrl });
  }, [location]);

  useEffect(() => {
    try {
      const cleanPhoneNumber = String(userPhoneNumber).trim();

      setUserId(analytics, cleanPhoneNumber);

      setUserProperties(analytics, {
        authenticated: isAuthenticated,
      });
    } catch (error) {
      console.error("Error setting analytics user ID:", error);
    }
}, [isAuthenticated, userPhoneNumber]);

  const staticLandingRoutes = [
    "/",
    "/about",
    "/academy",
    "/blog-content",
    "/career",
    "/insights",
    "/contact",
    "/products/investment-opportunities",
    "/market-intelligence",
    "/tru-estimate",
    "/tru-growth",
    "/products/vault",
  ];

  const isLandingPage = () => {
    if (staticLandingRoutes.includes(location.pathname)) {
      return true;
    }

    if (location.pathname.startsWith("/insights/")) {
      return true;
    }

    return false;
  };

  const isPropertiesPath = () => location.pathname.startsWith('/properties');
  
  return (
    <div>
      {/* tracker for tracking the current page location and previous page location  */}
      {/* <PageTracker /> */}

      {(isLandingPage() || !isAuthenticated) &&  (
        <>
          {/* <Cursor /> */}
          <Navbar />
          <ScrollToTop />
        </>
      )}

        <ToastsContainer toasts={toasts} removeToast={removeToast} />

      <AppRoutes />
      {((isLandingPage() || !isAuthenticated ) && location.pathname !== "/products/vault") && !isPropertiesPath() && <Footer />}
      
      {showSignInModal && <SignIn/>}
    </div>
  );
}

export default AppWrapper;