
import React, { useState, useEffect } from "react";
import { logEvent } from "firebase/analytics";
import {analytics} from "../../firebase";

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      setHasError(true);
      setErrorInfo({ error, errorInfo });
      // console.log(error)

      // Log the error to Firebase Analytics
      logEvent(analytics, "page_crash", {
        error_message: error?.toString(),
        component_stack: errorInfo?.componentStack || "No stack info",
      });
    };

    // Wrap the error handling for React rendering errors
    const globalErrorHandler = (event) => {
      handleError(event.error || new Error("Unknown Error"), {
        componentStack: event.error?.stack || "Global error stack",
      });
    };

    // Listen for uncaught errors and unhandled rejections
    window.addEventListener("error", globalErrorHandler);
    window.addEventListener("unhandledrejection", (event) => {
      handleError(event.reason || new Error("Unhandled Promise Rejection"), {
        componentStack: "Promise rejection stack not available",
      });
    });

    return () => {
      window.removeEventListener("error", globalErrorHandler);
      window.removeEventListener("unhandledrejection", globalErrorHandler);
    };
  }, []);

  if (hasError) {
    return <h1>Something went wrong. Please refresh the page.</h1>;
  }

  return <>{children}</>;
}

export default ErrorBoundary;
