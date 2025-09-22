import React, { useState, useEffect } from "react";
import { useRange } from "react-instantsearch";
import { formatCostSuffix } from "../utils/common.js";

const RangeFilter = ({ attribute }) => {
  const {
    range: { min, max },
    start: [minValue, maxValue],
    refine,
    canRefine,
  } = useRange({
    attribute,
  });

  const [localMin, setLocalMin] = useState(() => minValue || min);
  const [localMax, setLocalMax] = useState(() => maxValue || max);
  const [tempMin, setTempMin] = useState(localMin); // Temporary value for debouncing
  const [tempMax, setTempMax] = useState(localMax); // Temporary value for debouncing

  useEffect(() => {
    if (canRefine) {
      const newMin = minValue && isFinite(minValue) ? minValue : min;
      const newMax = maxValue && isFinite(maxValue) ? maxValue : max;
      setLocalMin(newMin);
      setLocalMax(newMax);
      setTempMin(newMin);
      setTempMax(newMax);
    }
  }, [minValue, maxValue, min, max, canRefine]);

  const getPercentage = (value) => {
    if ( !max || min === max) return 0;
    return ((value - min) / (max - min)) * 100;
  };

  const formatValue = (value) => {
    if (!isFinite(value)) return min;
    return Number.isInteger(value) ? value : value.toFixed(1);
  };

  const handleRangeChange = (type) => (event) => {
    const value = event.target.value;
    if (type === "min") {
      if (value < min) {
        setLocalMin(min);
      } else if (value >= localMax) {
        setLocalMin(localMax - 1); // Prevent overlap
      } else {
        setLocalMin(value);
      }
    } else {
      if (value > max) {
        setLocalMax(max);
      } else if (value <= localMin) {
        setLocalMax(localMin + 1); // Prevent overlap
      } else {
        setLocalMax(value);
      }
    }
  };

  const handleRangeCommit = () => {
    const boundedMin = Math.max(localMin, min);
    const boundedMax = Math.min(localMax, max);
    setLocalMin(boundedMin);
    setLocalMax(boundedMax);
    refine([boundedMin, boundedMax]);
  };

  // Debounced effect for min and max inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalMin(Math.max(tempMin, min)); // Ensure within bounds
      setLocalMax(Math.min(tempMax, max)); // Ensure within bounds
      refine([Math.max(tempMin, min), Math.min(tempMax, max)]);
    }, 1500); // 3 seconds delay

    return () => clearTimeout(timer); // Cleanup on unmount or input change
  }, [tempMin, tempMax, min, max, refine]);


  if (!canRefine || !max) return null;


  console.log(localMax, localMin, "rajan")

  return (
    <>
      <div className="px-4">
        <div className="relative pt-3 pb-6">
          {/* Track Background */}
          <div className="absolute h-2 w-full bg-gray-200 rounded" />

          {/* Selected Range */}
          <div
            className="absolute h-2 bg-[#153E3B] rounded"
            style={{
              left: `${getPercentage(localMin)}%`,
              width: `${getPercentage(localMax) - getPercentage(localMin)}%`,
            }}
          />

          {/* Min Thumb */}
          <input
            type="range"
            min={min}
            max={max}
            value={localMin}
            onChange={handleRangeChange("min")}
            onMouseUp={handleRangeCommit}
            onTouchEnd={handleRangeCommit}
            className="absolute w-full appearance-none bg-transparent pointer-events-none h-2 z-10"
          />

          {/* Max Thumb */}
          <input
            type="range"
            min={min}
            max={max}
            value={localMax}
            onChange={handleRangeChange("max")}
            onMouseUp={handleRangeCommit}
            onTouchEnd={handleRangeCommit}
            className="absolute w-full appearance-none bg-transparent pointer-events-none h-2 z-20"
          />

          {/* Range Labels */}
          {/* <div className="absolute w-full flex justify-between mt-4 text-xs text-gray-500">
            <span>{formatValue(localMin)}</span>
            <span>{formatValue(localMax)}</span>
          </div> */}
        </div>
      </div>

      {/* Numeric Inputs */}
      <div className="flex justify-between">
        {/* <div className="w-fit">
          <input
            type="number"
            value={tempMin}
            onChange={(e) => setTempMin(parseFloat(e.target.value) || min)}
            onBlur={handleRangeCommit}
            min={min}
            max={localMax}
            className="w-[80px] p-1 text-sm border rounded"
          />
        </div>
        <div className="w-fit">
          <input
            type="number"
            value={tempMax}
            onChange={(e) => setTempMax(parseFloat(e.target.value) || max)}
            onBlur={handleRangeCommit}
            min={localMin}
            max={max}
            className="w-[80px] p-1 text-sm border rounded"
          />
        </div> */}
        <div className="w-fit">
          <div className="w-[80px] p-1 text-sm border rounded outline-none">
            {attribute == "auctionReservePrice" ? `${formatCostSuffix(tempMin)} Crs` : `${formatCostSuffix(tempMin)}`}
          </div>
        </div>
        <div className="w-fit">
          <div className="w-[80px] p-1 text-sm border rounded outline-none">
            {attribute == "auctionReservePrice" ? `${formatCostSuffix(tempMax)} Crs` : `${formatCostSuffix(tempMax)}`}
          </div>
        </div>
      </div>
    </>
  );
};

// Styles for range input thumbs
const styles = `
  input[type="range"] {
    --thumb-size: 16px;
    --thumb-color: white;
    --thumb-border: 2px solid #3B82F6;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    pointer-events: all;
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--thumb-color);
    border-radius: 50%;
    border: var(--thumb-border);
    cursor: grab;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  input[type="range"]::-moz-range-thumb {
    pointer-events: all;
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--thumb-color);
    border-radius: 50%;
    border: var(--thumb-border);
    cursor: grab;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default RangeFilter;
