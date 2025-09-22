import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../../firebase';

const SignInButton = ({ 
  label, 
  href, 
  onClick, 
  classes, 
  IconFirst, 
  IconSecond, 
  HoverIcon,
  eventName,           
  eventCategory,
  eventAction,
  eventLabel
}) => {
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  const buttonContent = (
    <button
      onClick={() => {
        // Track the button click event
        if (eventName && eventLabel) {
          logEvent(analytics, eventName, { name: eventLabel})
        }
        if (onClick) onClick(); // Call the existing onClick function if provided
      }}
      className={`
        flex 
        justify-center 
        items-center 
        gap-1
        sm:gap-2
        px-3
        sm:px-4
        md:px-6
        lg:px-8 
        py-2.5

        lg:py-3 
        rounded 
        border 
        text-[12px]
        sm:text-[14px]
        
        border-GableGreen
        bg-GableGreen
        text-white
        hover:bg-transparent
        hover:text-GableGreen
        transition-colors 
        duration-300
        font-body
        ${classes}
      `}
      onMouseEnter={() => setIsHovered(true)}  // Set hover state to true on mouse enter
      onMouseLeave={() => setIsHovered(false)} // Set hover state to false on mouse leave
    >
      {/* Conditionally render IconFirst or HoverIcon */}
      {IconFirst && (
        <img
          src={isHovered && HoverIcon ? HoverIcon : IconFirst}
          alt={isHovered ? "hover-icon" : "icon-first"}
          className='h-3.5 sm:h-4 md:h-5 lg:h-6'
        />
      )}

      <span className="truncate">{label}</span>

      {/* Conditionally render IconSecond or HoverIcon */}
      {IconSecond && (
        <img
          src={isHovered && HoverIcon ? HoverIcon : IconSecond}
          alt={isHovered ? "hover-icon" : "icon-second"}
          className='h-3.5 sm:h-4 md:h-5 lg:h-6'
        />
      )}
    </button>
  );

  // Determine if the href is an external link or internal route
  const isExternalLink = href && (href.startsWith('http://') || href.startsWith('https://'));

  // Use appropriate wrapper classes to ensure button takes appropriate space on mobile
  const wrapperClasses = "inline-block max-w-full";

  // Render a Link for internal routes, an anchor for external links, or just a button if no href
  if (href) {
    return isExternalLink ? (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={wrapperClasses}>
        {buttonContent}
      </a>
    ) : (
      <Link to={href} aria-label={label} className={wrapperClasses}>
        {buttonContent}
      </Link>
    );
  }

  return buttonContent; 
};

export default SignInButton;