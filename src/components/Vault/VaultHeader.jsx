import React from "react";
import StepProgressBar from "react-step-progress";
import "react-step-progress/dist/index.css";
import "./customprogressbar.css"; // Updated CSS for better styling

const VaultHeader = ({ currentStep }) => {
  return (
    <div className="min-w-full mx-auto h-[50px] md:min-w-[342px] lg:min-w-[600px] ">
      <StepProgressBar
        key={currentStep} // Re-render when step changes
        startingStep={currentStep} // Set current step dynamically
        steps={[
          {
            label: "Project Name",
            name: "step 1",
          },
          {
            label: "Unit Details",
            name: "step 2",
          },
        ]}
        wrapperClass="custom-wrapper"
        progressClass="custom-progress-bar"
        stepClass="custom-step"
        labelClass="custom-label"
        subtitleClass="custom-subtitle"
        buttonWrapperClass="custom-buttons"
        primaryBtnClass="primary-BtnClass"
        secondaryBtnClass="secondary-BtnClass"
        contentClass="content-Class"
      />
    </div>
  );
};

export default VaultHeader;
