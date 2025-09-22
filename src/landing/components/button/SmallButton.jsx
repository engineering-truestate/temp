import React, { useState } from 'react';

const SmallButton = ({ label, href, onClick, classes, Icon, HoverIcon }) => {
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  const buttonContent = (
    <button
      onClick={onClick}
      className={`
        flex 
        justify-center 
        items-center 
        gap-2 
        px-8 
        py-2 
        rounded 
        border 
        border-GableGreen
        bg-GableGreen
        text-white 
        font-body
        hover:bg-transparent
        hover:text-GableGreen
        transition-colors 
        duration-300
        ${classes}
      `}
      onMouseEnter={() => setIsHovered(true)}  // Set hover state to true on mouse enter
      onMouseLeave={() => setIsHovered(false)} // Set hover state to false on mouse leave
    >
      {label}

      {/* Conditionally render the icon if Icon or HoverIcon exists */}
      {Icon && HoverIcon && (
        <img
          src={isHovered ? HoverIcon : Icon}
          alt={isHovered ? "hover-icon" : "icon"}
          className='h-4'
        />
      )}

    </button>
  );

  // Render anchor tag if href is provided, otherwise render a button
  return href ? (
    <a href={href} target='blank' aria-label={label}>
      {buttonContent}
    </a>
  ) : (
    buttonContent
  );
};

export default SmallButton;
