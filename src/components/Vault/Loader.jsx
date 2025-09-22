import { useEffect, useRef } from "react";
import "./Loader.css";
import PropTypes from "prop-types";

const Loader = ({ progress }) => {
  const loaderRef = useRef(null);

  useEffect(() => {
    if (loaderRef.current) {
      loaderRef.current.style.setProperty("--progress", `${progress * 3.6}deg`);
    }
  }, [progress]);

  return (
    <div className="loader-container sm:w-[328px] sm:h-[437px] sm:mx-auto sm:mt-[64px] pr:mx-auto pr:mt-[200px] ld:mx-auto ld:mt-[350px]">
      <div className="loader percentage" ref={loaderRef}>
        {progress}%
      </div>
      <p className="mt-6">Uploading File...</p>
    </div>
  );
};

Loader.propTypes = {
  progress: PropTypes.number,
};

export default Loader;
