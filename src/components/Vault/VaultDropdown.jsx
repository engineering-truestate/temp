import React, { useState, useRef, useEffect } from "react";
const dropDownIcon = '/assets/ui/icons/dropdown.svg';
import { analytics } from "../../firebase";
import { logEvent } from "firebase/analytics";

const VaultDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(
    options.findIndex(option => option.value === value)
  );  
  const dropdownRef = useRef(null);

  // Toggle dropdown open/close
  const toggleDropdown = () => setIsOpen(prev => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selection
  const handleSelect = (index) => {
    setSelectedIndex(index);
    setIsOpen(false);
    onChange(options[index].value); // Pass selected value back to parent


    logEvent(analytics, 'dropdown_selection', {
      value: value
  });
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(selectedIndex);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full font-['Lato']" ref={dropdownRef}>
      <div
        className={`flex text-['Lato'] items-center justify-between pr-3 pl-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#153E3B] ${
          isOpen ? "ring-1 ring-[#153E3B]" : ""
        }`}
        onClick={() => {
          toggleDropdown()
          logEvent(analytics, `click_dropdown_vault_form`, { Name: `vault_dropdown` })
          
        }}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
         <span>{options[selectedIndex]?.label || placeholder}</span>
         <img src={dropDownIcon} alt="Dropdown Icon" className="w-4 h-4 ml-2" />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <div
              key={option.value}
              className={`p-2 cursor-pointer hover:bg-[#BFE9E6] ${
                index === selectedIndex ? "bg-[#BFE9E6]" : "text-gray-700"
              }`}
              onClick={() => handleSelect(index)}
              onMouseEnter={() => {
                setSelectedIndex(index)
                logEvent(analytics, `select_dropdown_vault_form`, { Name: `vault_dropdown` })
              }
              }
              role="option"
              aria-selected={index === selectedIndex}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VaultDropdown;
