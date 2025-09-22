// NewDevelopments.jsx
// ========================
// This component renders the "New Developments" section showcasing real estate investment opportunities.
// It features a Keen Slider for displaying property cards in a carousel and a call-to-action button.
// The carousel is responsive and adapts to different screen sizes.
// ========================

import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react"; // Keen Slider hook for carousels
import LargeButton from "../../components/button/LargeButton"; // Call-to-action button component
import PropCard from "../../components/homePage/newDevelopments/PropCard"; // Property card component for displaying property details
import "keen-slider/keen-slider.min.css"; // Keen Slider styles


import  Tata from '/icons-1/Tata.png';
import  Birla from '/icons-1/Birla.png';
import  Godrej from '/icons-1/Godrej.png';






import InvManager from "../../../utils/InvManager";
import { db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";


// Dummy array containing data for new developments


async function findProjects(projectNames, projectImages) {
  const assetDataRef = collection(db, "assetData"); // Reference to the "assetData" collection
  const results = [];

  try {
    let idx=0;
    for (const projectName of projectNames) {
      // Create a query to find the project where the projectName matches
      const projectQuery = query(assetDataRef, where("projectName", "==", projectName));
      const querySnapshot = await getDocs(projectQuery);

      if (!querySnapshot.empty) {
        // Loop through the results and add them to the results array
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data(), logo:projectImages[idx] });
        });
      }
      idx++;
    }
    return results; // Return all matching projects
  } catch (error) {
    console.error("Error retrieving projects:", error);
    throw error;
  }
}



const NewDevelopments = () => {
  // State variables for current slide and slider loaded status
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [projects, setProjects] = useState([]);


//  for fetching projects 
  useEffect(()=>{
    const FindProjects = async()=>{
      const projectsNames= ["birla trimaya phase 3", "godrej shettigere phase 1", "tata carnatic"];
      const projectImages = [Birla, Godrej, Tata]
      const Projects = await findProjects(projectsNames, projectImages)
      setProjects(Projects);
    }
    FindProjects();
  },[]);

   // Set KeenSlider options once projects are loaded
   useEffect(() => {
    if (projects.length > 0) {
      setOptions({
        mode: "snap",
        loop: true,
        duration: 600,
        easing: (t) => t * (2 - t),
        rubberband: true,
        renderMode: "precision",
        dragSpeed: 1.5,
        slides: { perView: 3, spacing: 10 },
        breakpoints: {
          "(max-width: 1024px)": {
            slides: { perView: 2, spacing: 10 },
          },
          "(max-width: 640px)": {
            slides: { perView: 1 },
          },
        },
        slideChanged(slider) {
          setCurrentSlide(slider.track.details.rel);
        },
        created() {
          // setLoaded(true);
          // setInstance(slider)
        },
      });
      // setInstance( [
      //   (slider) => {
      //     let timeout;
      //     let mouseOver = false;
    
      //     function clearNextTimeout() {
      //       clearTimeout(timeout);
      //     }
    
      //     function nextTimeout() {
      //       clearTimeout(timeout);
      //       if (mouseOver) return;
      //       timeout = setTimeout(() => {
      //         // if(slider?.next?.length>0)
      //         slider.next();
      //       }, 2000);
      //     }
    
      //     // Event listeners for slider interactions
      //     slider.on("created", () => {
      //       slider.container.addEventListener("mouseover", () => {
      //         mouseOver = true;
      //         clearNextTimeout();
      //       });
      //       slider.container.addEventListener("mouseout", () => {
      //         mouseOver = false;
      //         nextTimeout();
      //       });
      //       nextTimeout();
      //     });
    
      //     slider.on("dragStarted", clearNextTimeout);
      //     slider.on("animationEnded", nextTimeout);
      //     slider.on("updated", nextTimeout);
      //   },
      // ]);
    }
  }, [projects]);


  // Initialize Keen Slider with options and behavior for carousel
  const [options, setOptions] = useState({});
  // const [instance, setInstance] = useState([]);
  const [sliderRef, instanceRef] = useKeenSlider(options);

  
    // This effect ensures that the instance is set and prevents running logic until the slider is created
    useEffect(() => {
      if (instanceRef.current) {
        let timeout;
        let mouseOver = false;
  
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
  
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            instanceRef?.current?.next();
          }, 2000);
        }
  
        // Event listeners for slider interactions
        instanceRef.current.on("created", () => {
          instanceRef.current.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          instanceRef.current.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
  
        instanceRef.current.on("dragStarted", clearNextTimeout);
        instanceRef.current.on("animationEnded", nextTimeout);
        instanceRef.current.on("updated", nextTimeout);
      }
    }, [instanceRef]);

    // console.log("projects" , projects);

  return (
    <section className="container flex flex-col gap-8 px-6 pt-16 md:px-20 md:pt-10 md:gap-10 lg:px-24 lg:pt-14 lg:gap-14">
      
      {/* Heading and Slider Section */}
      <div className="flex flex-col gap-8 md:gap-10 lg:gap-16">
        
        {/* Section Heading */}
        <h2 className="font-heading text-center text-display-xs md:text-display-sm lg:text-display-md">
          New Developments
        </h2>

        {/* Slider Container */}
        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {/* {console.log("projects" , projects)} */}
            {projects && projects.length>0 && projects.map((dev, index) => (
              <div className="keen-slider__slide" key={index}>
                <PropCard
                  logo={dev.logo} // Project logo
                  projectName={dev?.projectName} // Project name
                  micromarket={dev?.micromarket} // Project location
                  xirrForMinInv= {dev?.investmentOverview.xirr}
                  pricePerSqft={dev?.commonPricePerSqft}
                  assetType={dev?.assetType}
                  status={dev.status} // Project status
                  minInvestment={dev?.minInvestment} // Minimum investment amount
                  showRera={dev.reraId!=="NA"} // Show RERA icon
                  // price={dev.price} // Price of the project
                  // configurations={dev.configurations} // Available configurations
                  // irr={dev.irr} // Internal Rate of Return (IRR)
                  // startingPrice={dev.startingPrice} // Starting price
                  // duration={dev.duration} // Investment duration
                  // showTruSelected={dev.showTruSelected} // Show truSelected icon
                  // showPreLaunch={dev.showPreLaunch} // Show preLaunch icon
                />
              </div>
            ))}
          </div>

          {/* Dots Navigation */}
          {instanceRef.current && (
            <div className="flex justify-center mt-4">
              {[
                ...Array(instanceRef.current?.track.details?.slides?.length).keys(),
              ].map((idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    instanceRef.current.moveToIdx(idx);
                  }}
                  className={`w-2 h-2 mx-1 rounded-full ${
                    currentSlide === idx ? "bg-GableGreen" : "bg-ShadedWhite"
                  }`}
                ></button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="flex flex-col items-center gap-3 text-center md:gap-2 lg:gap-3">
        <p className="font-subheading text-gray-800 text-heading-medium-xxs md:text-heading-medium-sm lg:text-heading-medium-md">
          Discover More Investment Opportunities in Bengaluru with TruEstate
        </p>
        <LargeButton
          href={`https://wa.me/${InvManager.phoneNumber}?text=${"Hi, I’d like to know more about your offerings and how TruEstate can help with my property needs. Could you provide more details? Thank you!"}`} 
          label="Talk to us"
          classes="text-label-sm md:text-label-md !font-body"
          eventName="cta_click"                     // Tracking event name
          eventCategory="CTA"                       // Tracking category
          eventAction="click"                       // Tracking action
          eventLabel="talk_2_us_home_new_development" // Tracking label
        />

      </div>
    </section>
  );
};

export default NewDevelopments;
