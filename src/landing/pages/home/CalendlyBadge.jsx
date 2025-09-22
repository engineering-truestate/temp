// import React, { useEffect } from "react";
// import LargeButton from "../../components/button/LargeButton";

// const CalendlyBadge = () => {
//   useEffect(() => {
//     // Load Calendly stylesheet
//     const link = document.createElement("link");
//     link.href = "https://assets.calendly.com/assets/external/widget.css";
//     link.rel = "stylesheet";
//     document.head.appendChild(link);

//     // Load Calendly script
//     const script = document.createElement("script");
//     script.src = "https://assets.calendly.com/assets/external/widget.js";
//     script.async = true;
//     document.body.appendChild(script);

//     // Cleanup script and link elements on component unmount
//     return () => {
//       document.head.removeChild(link);
//       document.body.removeChild(script);
//     };
//   }, []);

//   const handleOpenCalendly = () => {
//     if (window.Calendly) {
//       window.Calendly.initPopupWidget({
//         url: "https://calendly.com/dhananjay-truestate/30min",
//       });
//     }
//   };

//   return (
//     <LargeButton
//       onClick={handleOpenCalendly}
//       label="Book a demo!"
//       classes="text-label-sm md:text-label-md !bg-white !text-GableGreen hover:!bg-GableGreen hover:!text-white font-body w-full !font-bold"
//       eventName="cta_click" // Tracking event name
//       eventCategory="CTA" // Tracking category
//       eventAction="click" // Tracking action
//       eventLabel="book_demo_footer" // Tracking label
//     />
//   );
// };

// export default CalendlyBadge;


// CalendlyBadge.js
import React, { useEffect } from "react";
import LargeButton from "../../components/button/LargeButton";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../../firebase";

// Function to open Calendly popup
export const handleOpenCalendly = () => {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({
      url: "https://calendly.com/dhananjay-truestate/30min",
    });
  }
};

const CalendlyBadge = () => {
  useEffect(() => {
    // Load Calendly assets
    const link = document.createElement("link");
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup on component unmount
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  // return (
  //   <LargeButton
  //     onClick={handleOpenCalendly}
  //     label="Book a demo!"
  //     classes="text-label-sm md:text-label-md !bg-white !text-GableGreen hover:!bg-GableGreen hover:!text-white font-body w-full !font-bold"
  //     eventName="click_outside_footer_book_demo"
  //     eventCategory="CTA"
  //     eventAction="click"
  //     eventLabel="book_demo_footer"
  //   />
  // );
};

export default CalendlyBadge;
