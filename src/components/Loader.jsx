import React from "react";
import { useSelector } from "react-redux";
import { selectLoader } from "../slices/loaderSlice";

const Loader = () => {
  const loading = useSelector(selectLoader);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin">
      </div>
    </div>
  );
};

export default Loader;
