import React from "react";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import "./customprogressbar.css"; // Custom overrides

const VaultHeader = ({ currentStep }) => {
  const steps = ["Project Name", "Unit Details"];
  const percent = ((currentStep ) / (steps.length - 1)) * 100;

  return (
    <div className="min-w-full mx-auto h-[70px] md:min-w-[342px] lg:min-w-[600px]">
      <ProgressBar
        percent={percent}
        filledBackground="linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)"
      >
        {steps.map((_, index) => (
          <Step key={index} transition="scale">
            {({ accomplished }) => (
              <div
                className={`indexedStep ${
                  accomplished ? "accomplished" : ""
                } text-[#153E3B]`}
              >
                {index + 1}
              </div>
            )}
          </Step>
        ))}
      </ProgressBar>

      <div className="flex justify-between mt-2 px-2">
        {steps.map((step, index) => (
          <span
            key={index}
            className={`text-sm font-medium ${
              index + 1 <= currentStep ? "text-[#153E3B]" : "text-gray-400"
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
