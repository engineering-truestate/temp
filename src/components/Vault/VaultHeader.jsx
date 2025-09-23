import React from "react";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import "./customprogressbar.css"; // Updated CSS for better styling

const VaultHeader = ({ currentStep }) => {
  const steps = ["Project Name", "Unit Details"];
  const percent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-w-full mx-auto h-[50px] md:min-w-[342px] lg:min-w-[600px] ">
      <ProgressBar
        percent={percent}
        filledBackground="linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)"
      >
        {steps.map((_, index) => (
          <Step
            key={index}
            transition="scale"
            children={({ accomplished }) => (
              <div
                className={`indexedStep ${accomplished ? "accomplished" : null}`}
              >
                {index + 1}
              </div>
            )}
          />
        ))}
      </ProgressBar>
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <span
            key={index}
            className={`text-sm ${
              index + 1 <= currentStep ? "text-blue-600" : "text-gray-400"
            }`}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
};

export default VaultHeader;
