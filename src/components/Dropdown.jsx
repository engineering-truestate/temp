import React, { useState, useRef, useEffect } from 'react';
import styles from './SearchBar.module.css';
import drop from '/assets/icons/navigation/arrow-down.svg';
import DropdownSlider from './DropdownSlider';

const Dropdown = ({ label, 
  options, 
  selectedOptions = [], 
  onChange, 
  isOpen, 
  toggleOpen,
  // Slider props
  minValue,
  maxValue,
  initialMin,
  initialMax,
  onApply }) => {
  const dropdownRef = useRef(null); // Step 1: Create a ref for the dropdown

  const handleOptionClick = (option) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];

    onChange(newSelectedOptions);
  };

  // Detect outside clicks to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Only close the dropdown, don't toggle it open again
        if (isOpen) {
          toggleOpen(false); 
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleOpen]); // Include `isOpen` to ensure effect runs correctly

  // Determine if any options are selected

  if (label?.props?.children === 'Budget') {
    return (
      <DropdownSlider
        label={label}
        minValue={minValue}
        maxValue={maxValue}
        onApply={onApply}
        isOpen={isOpen}
        toggleOpen={toggleOpen}
        initialMin={initialMin}
        initialMax={initialMax}
      />
    );
  }

  const isAnyOptionSelected = selectedOptions?.length > 0 || false;

  return (
    <div className={`${styles.dropdownContainer} relative z-50`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => toggleOpen(!isOpen)} // Step 2: Toggle open/close only on button click
        className={`${styles.dropdownButton} w-[max-content] text-nowrap bg-[#FAFAFA] ${isOpen ? ' border-gray-300' : ' border-gray-300'} ${isAnyOptionSelected ? styles.selectedDropdownBtn : ''}`}
      >
        {label}
        <img src={drop} className="ml-2 h-4 w-4" alt="" />
      </button>
      {isOpen && (
        <div className={`${styles.dropdownMenu} mt-2 z-12`}>
          {options.map(option => (
            <div
              key={option}
              className={`${styles.dropdownMenuitemout} ${selectedOptions.includes(option) ? styles.selectedDropdownItem : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              <div className={`${styles.dropdownMenuitemin}`}>
                {option}
                {selectedOptions.includes(option) && <span className={`${styles.cross} ml-2`}>×</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
