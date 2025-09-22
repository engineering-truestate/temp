import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../../firebase';

const LargeButton = ({ 
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
        gap-2
        px-8 
        py-3 
        rounded 
        border 
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
          className='h-4 md:h-5 lg:h-6'
        />
      )}

      {label}

      {/* Conditionally render IconSecond or HoverIcon */}
      {IconSecond && (
        <img
          src={isHovered && HoverIcon ? HoverIcon : IconSecond}
          alt={isHovered ? "hover-icon" : "icon-second"}
          className='h-4 md:h-5 lg:h-6'
        />
      )}
    </button>
  );

  // Determine if the href is an external link or internal route
  const isExternalLink = href && (href.startsWith('http://') || href.startsWith('https://'));

  // Render a Link for internal routes, an anchor for external links, or just a button if no href
  if (href) {
    return isExternalLink ? (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}> {/* Added target="_blank" */}
        {buttonContent}
      </a>
    ) : (
      <Link to={href} aria-label={label}>
        {buttonContent}
      </Link>
    );
  }

  return buttonContent; // Render just the button if no href is provided
};

export default LargeButton;
