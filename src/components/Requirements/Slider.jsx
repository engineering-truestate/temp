import React, { useState, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";
import styles from "./requirement.module.css";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase.js";

const Slider = ({ requirement, updateRequirement }) => {
  const steps = [
    100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 425, 450,
    475, 500, 525, 550, 575, 600, 625, 650, 675, 700, 725, 750, 775, 800, 825,
    850, 875, 900, 925, 950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150,
    1175, 1200, 1225, 1250, 1275, 1300, 1325, 1350, 1375, 1400, 1425, 1450,
    1475, 1500,
  ];
  const stepsCount = steps.length - 1;
  const stepSize = (100 - 50) / stepsCount;

  // Separate state for display values and slider values
  const [displayValues, setDisplayValues] = useState([0, 1500]);
  const [sliderValues, setSliderValues] = useState([0, 1500]);

  // Initialize slider values from requirement
  useEffect(() => {
    if (requirement && requirement.maxBudget !== null && requirement.maxBudget !== undefined) {
      const newMaxBudget = requirement.maxBudget;
      setDisplayValues([0, newMaxBudget]);
      setSliderValues([0, newMaxBudget]);
    }
  }, [requirement?.maxBudget]);

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

  const handleValuesChange = (newValues) => {
    const newDisplayValues = newValues.map(mapSliderToDisplay);
    setDisplayValues(newDisplayValues);
    setSliderValues(newDisplayValues);
    logEvent(analytics, `change_budget_slider_request`);
  };

  // Debounced effect to update slider values
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSliderValues(displayValues);
      updateRequirement(
        requirement.id,
        "maxBudget",
        displayValues[1]
      );
    }, 2000); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [displayValues]);

  const handleInputChange = (index, inputValue) => {
    let numericValue = parseFloat(inputValue.replace(/[^0-9]/g, ""));
    if (isNaN(numericValue)) numericValue = 0;

    // Ensure input stays within valid range
    if (numericValue < 0) numericValue = 0;
    if (numericValue > 1500) numericValue = 1500;

    const updatedValues = [...displayValues];
    updatedValues[index] = numericValue;

    // Maintain logical range (min <= max)
    if (index === 0 && updatedValues[0] > updatedValues[1]) {
      updatedValues[1] = updatedValues[0];
    } else if (index === 1 && updatedValues[1] < updatedValues[0]) {
      updatedValues[0] = updatedValues[1];
    }

    setDisplayValues(updatedValues);
  };

  const formatCurrency = (value) => {
    if (value >= 100) {
      return (value / 100).toFixed(2); // Crore (₹)
    }
    return value.toFixed(0); // Lakh (₹)
  };

  return (
    <div className={styles.sliderContainer}>
      <Range
        step={0.1}
        min={0}
        max={100}
        values={sliderValues.map(mapDisplayToSlider)}
        onChange={handleValuesChange}
        renderTrack={({ props, children }) => (
          <div {...props} className={styles.track}>
            <div
              className={styles.range}
              style={{
                background: getTrackBackground({
                  values: sliderValues.map(mapDisplayToSlider),
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
        renderThumb={({ props }) => <div {...props} className={styles.thumb} />}
      />
      <div className="flex gap-2 justify-between mt-4">
        <div className="">
          <label className="mr-2 text-[14px]">Min:</label>
          <div className="flex items-end gap-2 bg-[#FAFAFA] border border-[#B5B3B3] rounded-md px-2 py-1">
            <input
              type="text"
              value={formatCurrency(displayValues[0])}
              readOnly
              className="w-[40px] bg-[#FAFAFA] focus:outline-none"
            />
            <span className="text-[14px] text-[#433F3E]">
              {displayValues[0] < 100 ? "Lakh" : "Cr"}
            </span>
          </div>
        </div>
        <div className="">
          <label className="mr-2 text-[14px]">Max:</label>
          <div className="flex items-end gap-2 bg-[#FAFAFA] border border-[#B5B3B3] rounded-md px-2 py-1">
            <input
              type="text"
              value={formatCurrency(displayValues[1])}
              readOnly
              className="w-[40px] bg-[#FAFAFA] focus:outline-none"
            />
            <span className="text-[14px] text-[#433F3E]">
              {displayValues[1] < 100 ? "Lakh" : "Cr"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
