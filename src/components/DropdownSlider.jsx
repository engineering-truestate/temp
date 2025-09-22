import React, { useState, useRef, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";
import styles from "./SearchBar.module.css";
import drop from "/assets/icons/navigation/arrow-down.svg";

const DropdownSlider = ({
  label,
  minValue, // Should be 0
  maxValue, // Should be 300
  onApply,
  isOpen,
  toggleOpen,
  initialMin,
  initialMax,
}) => {
  const dropdownRef = useRef(null);

  const steps = [100, 125, 150, 175, 200, 225, 250, 275, 300];
  const stepsCount = steps.length - 1;
  const stepSize = (100 - 50) / stepsCount;

  const [tempValues, setTempValues] = useState([initialMin, initialMax]);
  const [values, setValues] = useState([initialMin, initialMax]);

  useEffect(() => {
    setValues([initialMin, initialMax]);
    setTempValues([initialMin, initialMax]);
  }, [initialMin, initialMax]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) {
          toggleOpen(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleOpen]);

  const handleDragChange = (newValues) => {
    const displayValues = newValues.map(mapSliderToDisplay);
    setTempValues(displayValues);
    setValues(displayValues);
  };

  const handleFinalChange = (newValues) => {
    const displayValues = newValues.map(mapSliderToDisplay);
    setTempValues(displayValues);
    setValues(displayValues);
    if (onApply) {
      onApply(displayValues);
    }
  };

  const mapSliderToDisplay = (value) => {
    if (value <= 50) {
      return value * 2;
    } else {
      const stepIndex = Math.round((value - 50) / stepSize);
      return steps[Math.min(stepIndex, stepsCount)];
    }
  };

  const mapDisplayToSlider = (displayValue) => {
    if (displayValue <= 100) {
      return displayValue / 2;
    } else {
      let index = steps.indexOf(displayValue);
      if (index === -1) {
        index = steps.findIndex((step) => step >= displayValue);
        if (index === -1) {
          index = stepsCount;
        }
      }
      return 50 + index * stepSize;
    }
  };

  const handleInputChange = (index, inputValue) => {
    let numericValue = parseFloat(inputValue.replace(/[^0-9]/g, ""));
    if (isNaN(numericValue)) numericValue = 0;

    // Ensure the input values are valid
    if (numericValue < minValue) numericValue = minValue;
    if (numericValue > maxValue) numericValue = maxValue;

    const updatedValues = [...values];
    updatedValues[index] = numericValue;

    // Maintain logical order (Min ≤ Max)
    if (index === 0 && updatedValues[0] > updatedValues[1]) {
      updatedValues[1] = updatedValues[0];
    } else if (index === 1 && updatedValues[1] < updatedValues[0]) {
      updatedValues[0] = updatedValues[1];
    }

    setValues(updatedValues);
    setTempValues(updatedValues);

    // Trigger onApply if necessary
    if (onApply) {
      onApply(updatedValues);
    }
  };

  const isAnyOptionSelected = values[0] !== minValue || values[1] !== maxValue;

  const formatCurrency = (value) => {
    if (value >= 100) {
      return `₹${(value / 100).toFixed(2)} Cr`;
    }
    return `₹${value.toFixed(0)} Lac`;
  };

  return (
    <div
      className={`${styles.dropdownContainer} relative`}
      style={{ zIndex: 1 }}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => toggleOpen(isOpen ? null : label)}
        className={`${styles.dropdownButton} w-[max-content] text-nowrap bg-[#FAFAFA] ${
          isAnyOptionSelected ? styles.selectedDropdownBtn : ""
        }`}
      >
        {label}
        <img src={drop} className="ml-2 h-4 w-4" alt="" />
      </button>
      {isOpen && (
        <div className={`${styles.SliderdropdownMenu} mt-2`}>
          <div className={styles.sliderContainer}>
            <Range
              step={0.1}
              min={0}
              max={100}
              values={values.map(mapDisplayToSlider)}
              onChange={handleDragChange}
              onFinalChange={handleFinalChange}
              renderTrack={({ props, children }) => (
                <div {...props} className={styles.track}>
                  <div
                    className={styles.range}
                    style={{
                      background: getTrackBackground({
                        values: values.map(mapDisplayToSlider),
                        colors: ["#ddd", "#153E3B", "#ddd"],
                        min: 0,
                        max: 100,
                      }),
                      width: "100%",
                    }}
                  />
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div {...props} className={styles.thumb} />
              )}
            />
            <div className="flex gap-2 justify-between mt-4">
              <div className="">
                <label className="mr-2 text-[14px]">Min:</label>
                <div className="flex items-end gap-1 bg-[#FAFAFA] border border-[#B5B3B3] rounded-md px-2 py-1">
                <input
                  type="text"
                  value={values[0]}
                  onChange={(e) => handleInputChange(0, e.target.value)}
                  className="w-[36px] bg-[#FAFAFA] focus:outline-none"
                />
                <span className="text-[14px] text-[#433F3E]">Lakh</span>
                </div>
               
              </div>
              <div className="">
                <label className="mr-2 text-[14px]">Max:</label>
                <div className="flex items-end gap-1 bg-[#FAFAFA] border border-[#B5B3B3] rounded-md px-2 py-1">
                <input
                  type="text"
                  value={values[1]}
                  onChange={(e) => handleInputChange(1, e.target.value)}
                   className="w-[36px] bg-[#FAFAFA] focus:outline-none"
                />
                <span className="text-[14px] text-[#433F3E]">Lakh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownSlider;
