import { useState, useEffect, useRef, useCallback } from 'react';
import ProgressBar from '../../components/howItWorks/ProgressBar';
import Card from '../../components/howItWorks/Card';
import PhoneImage from '../../components/howItWorks/PhoneImage';

import phoneImage1 from '../../assets/howItWorks/1.webp';
import phoneImage2 from '../../assets/howItWorks/2.webp';
import phoneImage3 from '../../assets/howItWorks/3.webp';
import phoneImage4 from '../../assets/howItWorks/4.webp';

import icon1 from '../../assets/howItWorks/work1.svg';
import icon2 from '../../assets/howItWorks/work2.svg';
import icon3 from '../../assets/howItWorks/work3.svg';
import icon4 from '../../assets/howItWorks/work4.svg';

const steps = [
  {
    image: phoneImage1,
    title: 'Have a project or area in mind?',
    description: 'Use our interactive visual tools to explore different projects by different developers at a micro-market level.',
    icon: icon1,
  },
  {
    image: phoneImage2,
    title: 'Want to know more about a project?',
    description: 'Get 50+ data points about every property. Talk to our property expert to find out more and schedule a site visit.',
    icon: icon2,
  },
  {
    image: phoneImage3,
    title: 'Found the right property to invest in?',
    description: 'Use our free concierge service to complete the paperwork, get the sale deed done, and the property registered.',
    icon: icon3,
  },
  {
    image: phoneImage4,
    title: 'Need help after your investment?',
    description: 'Vault is a custom tool built by us just for this. Use it to track your property’s price, rent it out, pay taxes and more.',
    icon: icon4,
  },
];

const StepSection = () => {
  const [step, setStep] = useState(0);
  const sectionRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Track mouse movement inside the div
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  };

  
const handleScroll = useCallback(
  (event) => {
    if (isScrolling) return;

    // Calculate scroll strength (this determines how hard the scroll is)
    const scrollStrength = Math.abs(event.deltaY);

    // Only prevent default behavior if scroll is less than threshold
    if (scrollStrength < 3) {
      event.preventDefault();
    }

    // Check if we're at the last step and scrolling down
    if (step === steps.length - 1 && event.deltaY > 0) {
      setIsScrolling(true);
      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
      return;
    }

    // Check if we're at the first step and scrolling up
    if (step === 0 && event.deltaY < 0) {
      setIsScrolling(true);
      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
      return;
    }

    // Custom step navigation logic for scrolling between steps
    if (event.deltaY > 0 && step < steps.length - 1) {
      setIsScrolling(true);
      setStep((prevStep) => prevStep + 1);
    } else if (event.deltaY < 0 && step > 0) {
      setIsScrolling(true);
      setStep((prevStep) => prevStep - 1);
    }

    // Unlock scrolling after a delay (debouncing)
    setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  },
  [step, isScrolling]
);

useEffect(() => {
  const sectionElement = sectionRef.current;

  const onWheel = (event) => {
    // Allow default behavior if at the first or last step
    if ((step === steps.length - 1 && event.deltaY > 0) || (step === 0 && event.deltaY < 0)) {
      return;
    }

    // Prevent default behavior and call handleScroll
    event.preventDefault();
    handleScroll(event);
  };

  sectionElement.addEventListener('wheel', onWheel, { passive: false });

  return () => {
    sectionElement.removeEventListener('wheel', onWheel);
  };
}, [handleScroll, step]);

  

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{  overflow: 'hidden' }} // Ensure no external scrolling happens
    >
      {/* Div inside which scrolling is enabled */}
      <div
        className="flex items-center justify-center gap-4 md:gap-6 h-full relative py-6 rounded-2xl  px-6"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(5.7px)',
        }}
      >
        {/* Tooltip that follows the cursor */}
        {isHovering && (
          <div
            className="absolute z-10 text-white bg-gray-500 text-paragraph-xs py-1 px-2 rounded pointer-events-none"
            style={{
              left: `${mousePosition.x - sectionRef.current.getBoundingClientRect().left}px`,
              top: `${mousePosition.y - sectionRef.current.getBoundingClientRect().top}px`,
              transform: 'translate(-50%, -120%)', // Position tooltip above the cursor
            }}
          >
            SCROLL
          </div>
        )}

        {/* Phone Mockup */}
        <div className="w-5/12 relative">
          <PhoneImage image={steps[step].image} />
        </div>

        {/* Timeline (Progress Bar) */}
        <div className="w-1/12">
          <ProgressBar step={step} />
        </div>

        {/* Text Card */}
        <div
          className="relative justify-center w-6/12 md:w-5/12  bg-DefaultWhite"
          style={{
            boxShadow: '0px 0px 25px 4px rgba(3, 44, 42, 0.05)',
          }}
        >
          {steps.map((stepContent, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-800 ease-in-out flex justify-center items-center ${
                step === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Card title={stepContent.title} description={stepContent.description} icon={stepContent.icon} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepSection;

