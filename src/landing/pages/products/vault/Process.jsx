// VaultProcess.jsx
// ========================
// This component renders the "Vault Process" section which visually represents the steps
// a user will go through during the vault process. It uses a vertical progress line
// and highlights each step as the user scrolls through the section.
// ========================

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer"; // Intersection observer hook to detect visibility of elements
import walletIcon from "../../../assets/vault/wallet.svg"; // Importing wallet icon
import ProcessCard from "./ProcessCard"; // Importing the ProcessCard component
import LargeButton from "../../../components/button/LargeButton";
import { setShowSignInModal } from "../../../../slices/modalSlice";
import { useDispatch } from "react-redux";

const VaultProcess = () => {
  const dispatch = useDispatch();

  const [activeStep, setActiveStep] = useState(1); // State to track the current active step
  const [lineHeight, setLineHeight] = useState(0); // State to control the height of the green line

  const options = {
    threshold: 1, // Element is considered "in view" when 100% visible
  };

  // Array of objects containing unique information for each step
  const steps = [
    {
      stepNumber: "01", // Step number for display
      title: "Request a Service", // Title of the step
      description: "Valuation reports, loans, khatas & more", // Step description
      buttonText: "Share", // Button text for this step
      buttonLink: "/vault",
    },
    {
      stepNumber: "02",
      title: "Research & Analysis",
      description: "Our team processes your requests",
      buttonText: "Check results",
      buttonLink: "/vault",
    },
    {
      stepNumber: "03",
      title: "Detailed Reports",
      description: "View and download custom reports  ",
      buttonText: "Add details",
      buttonLink: "/vault",
    },
    {
      stepNumber: "04",
      title: "Regular Updates",
      description: "Stay up-to-date on your investments",
      buttonText: "Check reports",
      buttonLink: "/vault",
    },
  ];

  // Create an array of useInView hooks for each step
  const stepInViews = Array.from({ length: steps.length }, () =>
    useInView(options)
  );

  // Effect hook to dynamically update the active step and vertical line height as the user scrolls
  useEffect(() => {
    let newActiveStep = activeStep;
    let newLineHeight = 0;

    // Check which step is currently in view and update state accordingly
    if (stepInViews[0].inView) {
      newActiveStep = 1;
      newLineHeight = 0; // Step 1 in view, line height starts at 0%
    } else if (stepInViews[1].inView) {
      newActiveStep = 2;
      newLineHeight = 35; // Step 2 in view, line height increases to 35%
    } else if (stepInViews[2].inView) {
      newActiveStep = 3;
      newLineHeight = 67; // Step 3 in view, line height increases to 67%
    } else if (stepInViews[3].inView) {
      newActiveStep = 4;
      newLineHeight = 100; // Step 4 in view, line height almost full at 100%
    }

    // Update state only when the active step or line height changes
    if (newActiveStep !== activeStep) {
      setActiveStep(newActiveStep);
    }

    if (newLineHeight !== lineHeight) {
      setLineHeight(newLineHeight);
    }
  }, [
    stepInViews[0].inView,
    stepInViews[1].inView,
    stepInViews[2].inView,
    stepInViews[3].inView,
    activeStep,
    lineHeight,
  ]);

  // Helper function to determine if a step is active or has been completed
  const isStepActive = (step) => step <= activeStep;

  return (
    <div className="container vault-process-section w-full h-auto px-4 md:px-8 py-10 md:py-14 md:pb-28 relative gap-10 md:gap-12 lg:gap-16">
      {/* Section Title */}
      <h2 className="font-heading text-center text-display-xs md:text-display-sm lg:text-display-md">
        Vault Process
      </h2>

      <div className="relative flex flex-col justify-center md:space-y-6 space-y-12 max-w-4xl mx-auto mt-[4%] mb-[10%] sm:my-[4%] ">
        {/* Vertical Line for Web View */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 md:top-36 lg:top md:h-[76%] lg:h-[75%] bg-ShadedWhite md:block hidden">
          <div
            className="bg-GableGreen transition-all duration-500 ease-in-out" // Smooth transition for line height
            style={{ height: `${lineHeight}%`, width: "100%" }} // Dynamic height based on active step
          ></div>
        </div>

        {/* Vertical Line for Mobile View */}
        <div className="absolute left-4 top-32 h-[75%] w-1 bg-ShadedWhite md:hidden">
          <div
            className="bg-GableGreen w-full transition-all duration-500 ease-in-out" // Smooth transition for line height in mobile
            style={{ height: `${lineHeight}%` }} // Dynamic height for mobile view
          ></div>
        </div>

        {/* Loop through each step in the `steps` array */}
        {steps.map((step, index) => (
          <div
            key={index}
            className={`relative flex flex-col md:flex-row items-center ${(index + 1) % 2 === 0 ? "md:flex-row-reverse" : ""}`}
            ref={stepInViews[index].ref} // Use the ref from the corresponding useInView
          >
            {/* Step Card */}
            <div
              className={`w-[100%] md:w-1/2 ${(index + 1) % 2 === 0 ? "md:pl-28 ml-auto" : "md:pr-28 text-right"}`}
            >
              <div
                className={`bg-white p-6 rounded-lg shadow-lg z-10 transition-all duration-500 ease-in-out transform ${
                  activeStep === index + 1
                    ? "scale-105 opacity-100"
                    : "opacity-40" // Adjust appearance for active step
                } md:ml-0 ml-14`}
              >
                <div className="text-left">
                  {/* Process Card Component */}
                  <ProcessCard
                    stepNumber={step.stepNumber} // Pass step number
                    title={step.title} // Pass step title
                    description={step.description} // Pass step description
                    icon={walletIcon} // Icon for the card
                    buttonText={step.buttonText} // Button text for the card
                    buttonLink={step.buttonLink}
                    isActive={activeStep === index + 1} // Check if step is active
                  />
                </div>
              </div>
            </div>
            {/* Circle Checkpoint */}
            <div
              className={`absolute md:left-1/2 left-2 md:top-32 top-32 transform md:-translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out ${
                isStepActive(index + 1)
                  ? "bg-GableGreen"
                  : "bg-FlouresenceGreen" // Change circle color based on active step
              } w-5 h-5 rounded-full border-2 border-ShadedWhite z-10`}
            ></div>
          </div>
        ))}
      </div>

      <div className="justify-center flex items-center">
        <LargeButton
          onClick={() =>
            dispatch(
              setShowSignInModal({
                showSignInModal: true,
                redirectUrl: "/vault/investment",
              })
            )
          }
          label="Open Vault"
          classes="font-body text-label-sm md:text-label-md"
          eventName="click_outside_open_vault" // Tracking event name
          eventCategory="CTA" // Tracking category
          eventAction="click" // Tracking action
          eventLabel="browse_cta_investment_opp_actions" // Tracking label
        />
      </div>
    </div>
  );
};

export default VaultProcess;
