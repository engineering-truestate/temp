import { useState, useRef, useEffect } from "react";
import { AREA_DATA } from "../../constants/microMarketData";
// Dropdown icon moved to public folder
// import dropDownIcon from "../../assets/Icons/drop.svg";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";

const DropdownComponent = ({ requirement, updateRequirement }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Flatten the MicroMarkets from all areas into a single array
  const allMicroMarkets = AREA_DATA
    .reduce((acc, area) => {
      return [...acc, ...area.MicroMarkets];
    }, [])
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => (a > b ? 1 : -1));

  // Initialize and filter options
  useEffect(() => {
    let filtered = allMicroMarkets;
    
    if (searchTerm.trim() !== '') {
      filtered = allMicroMarkets.filter(microMarket =>
        microMarket.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOptions(filtered);
  }, [searchTerm]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleOptionClick = (microMarket) => {
    const isSelected = selectedOptions.includes(microMarket);
    let updatedSelections;

    if (isSelected) {
      updatedSelections = selectedOptions.filter(
        (option) => option !== microMarket
      );
    } else {
      updatedSelections = [...selectedOptions, microMarket];
    }

    setSelectedOptions(updatedSelections);
    updateRequirement(
      requirement.requirementId,
      "micromarket",
      updatedSelections
    );
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm(''); // Clear search when closing
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
        onClick={() => {
          setIsOpen(!isOpen);

          logEvent(analytics, "dropdown_micromarket_requirement", {
            Name: "dropdown_micromarket__requirement",
          });
        }}
      >
        <span className="truncate">
          {selectedOptions.length > 0
            ? selectedOptions.join(", ")
            : "Select Micro Markets"}
        </span>
        <img 
          src="/assets/ui/icons/dropdown.svg" 
          alt="Icon dropdown" 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute mt-1 bg-white border border-gray-300 rounded-lg w-full max-h-60 overflow-hidden z-10 shadow-lg">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search micro markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Options List */}
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((microMarket, index) => {
                const isSelected = selectedOptions.includes(microMarket);
                return (
                  <div
                    key={index}
                    className={`px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center ${
                      isSelected ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleOptionClick(microMarket)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleOptionClick(microMarket)}
                      className="mr-2"
                    />
                    {microMarket}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-2 text-gray-500 text-center">
                No micro markets found
              </div>
            )}
          </div>

          {/* Clear All Button (optional) */}
          {selectedOptions.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setSelectedOptions([]);
                  updateRequirement(requirement.requirementId, "micromarket", []);
                }}
                className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md focus:outline-none"
              >
                Clear All Selections
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownComponent;