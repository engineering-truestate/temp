import { useState, useRef, useEffect } from "react";
const dropDownIcon = '/assets/ui/icons/dropdown.svg';
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import { AREA_DATA } from "../../constants/microMarketData";

const DropdownAreas = ({ requirement, updateRequirement }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const dropdownRef = useRef(null); // Reference to the dropdown component

  // Flatten the Areas into a single array
  const allAreas = AREA_DATA.map((area) => area.Area);
  // console.log("these are all areas" , allAreas);

  const handleOptionClick = (area) => {
    const isSelected = selectedOptions.includes(area);
    let updatedSelections;

    if (isSelected) {
      updatedSelections = selectedOptions.filter((option) => option !== area);
    } else {
      updatedSelections = [...selectedOptions, area];
    }

    setSelectedOptions(updatedSelections);
    updateRequirement(requirement.requirementId, "area", updatedSelections);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown Button */}
      <div
        className="bg-[#FAFAFA] border border-[#B5B3B3] rounded-lg w-full px-4 py-2 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {selectedOptions.length > 0
            ? selectedOptions.join(", ")
            : "Select Areas"}
        </span>
        <img src={dropDownIcon} alt="Icon dropdown" />
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute mt-1 bg-white border border-gray-300 rounded-lg w-full max-h-60 overflow-y-auto z-10">
          {allAreas.map((area, index) => {
            const isSelected = selectedOptions.includes(area);
            return (
              <div
                key={index}
                className={`px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center ${
                  isSelected ? "bg-gray-100" : ""
                }`}
                onClick={() => {
                  handleOptionClick(area);
                  logEvent(analytics, "dropdown_areas_requirement", {
                    Name: "dropdown_areas__requirement",
                  });
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleOptionClick(area)}
                  className="mr-2"
                />
                {area}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownAreas;
