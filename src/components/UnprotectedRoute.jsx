// UnprotectedRoute.jsx
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const UnprotectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    // Redirect to the sign-in page, but save the current location they were trying to go to
    // return <Navigate to="/properties" state={{ from: location }} replace />;
  }

  return children;
};

UnprotectedRoute.propTypes = {
  children: PropTypes.node,
};

export default UnprotectedRoute;
