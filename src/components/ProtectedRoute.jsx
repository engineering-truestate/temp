// ProtectedRoute.jsx
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { setShowSignInModal } from "../slices/modalSlice";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  const dispatch = useDispatch();
  
  if (location.pathname === "/auction" && !isAuthenticated ) {
    dispatch(
        setShowSignInModal({ showSignInModal: true, redirectUrl: "/auction" })
      );
  }

  if (!isAuthenticated) {
    // Redirect to the sign-in page, but save the current location they were trying to go to
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;
