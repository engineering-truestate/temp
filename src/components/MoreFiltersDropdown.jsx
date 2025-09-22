import React, { useState, useRef, useEffect } from 'react';
import { getTrackBackground, Range } from 'react-range';
import { useMediaQuery } from 'react-responsive';
import styles from './SearchBar.module.css';
import drop from '/assets/icons/navigation/arrow-down.svg';
import moref from '/assets/icons/ui/filter.svg';
import { useNavigate, useLocation } from 'react-router-dom';

const MoreFiltersDropdown = ({
  filters,
  isOpen,
  toggleOpen,
  minValue,
  maxValue,
  initialMin,
  initialMax,
  onApply,
  handleClearFilters,
}) => {
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedFilter, setSelectedFilter] = useState(filters[0].label);
  const selectedFilterRef = useRef(null);
  const dropdownRef = useRef(null);
  const rightSideRef = useRef(null);


  // State for budget values
  const [tempValues, setTempValues] = useState([initialMin, initialMax]);
  const [values, setValues] = useState([initialMin, initialMax]);

  // State for temporary filters on small screens
  const [tempFilters, setTempFilters] = useState(() =>
    filters.map((filter) => ({
      ...filter,
      selectedOptions: [...(filter.selectedOptions || [])],
    }))
  );

  // Sync tempValues with initial values
  useEffect(() => {
    setValues([initialMin, initialMax]);
    setTempValues([initialMin, initialMax]);
  }, [initialMin, initialMax]);

  // Sync tempFilters with filters
  useEffect(() => {
    setTempFilters(
      filters.map((filter) => ({
        ...filter,
        selectedOptions: [...(filter.selectedOptions || [])],
      }))
    );
  }, [filters]);

  const handleFilterClick = (e, label) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedFilter(label);
  };

  const handleOptionClick = (filterLabel, option) => {
    if (isSmallScreen) {
      // Update tempFilters
      const updatedTempFilters = tempFilters.map((filter) => {
        if (filter.label === filterLabel) {
          const selectedOptions = filter.selectedOptions || [];
          const newSelectedOptions = selectedOptions.includes(option)
            ? selectedOptions.filter((item) => item !== option)
            : [...selectedOptions, option];
          return { ...filter, selectedOptions: newSelectedOptions };
        }
        return filter;
      });
      setTempFilters(updatedTempFilters);
    } else {
      // Update filters directly and call onChange

      filters.forEach((filter) => {
        if (filter.label === filterLabel) {
          const selectedOptions = filter.selectedOptions || [];
          const newSelectedOptions = selectedOptions.includes(option)
            ? selectedOptions.filter((item) => item !== option)
            : [...selectedOptions, option];
          if (filter.onChange) {
            filter.onChange(newSelectedOptions);
          }
        }
      });
    }
  };

  const handleDragChange = (newValues) => {
    const displayValues = newValues.map(mapSliderToDisplay);
    if (isSmallScreen) {
      setTempValues(displayValues);
    } else {
      setValues(displayValues);
    }
  };

  const handleFinalChange = (newValues) => {
    const displayValues = newValues.map(mapSliderToDisplay); // Map slider values to display values
    if (isSmallScreen) {
      setTempValues(displayValues);
    } else {
      setValues(displayValues);
      if (onApply) {
        onApply(displayValues);
      }
    }
  };

  const formatCurrency = (value) => {
    if (value >= 100) {
      return `₹${(value / 100).toFixed(2)} Cr`;
    }
    return `₹${value.toFixed(0)} Lac`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) {
          toggleOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleOpen]);

  const handleCancel = () => {
    if (isSmallScreen) {
      // Reset tempFilters and tempValues
      setTempFilters(
        filters.map((filter) => ({
          ...filter,
          selectedOptions: [...(filter.selectedOptions || [])],
        }))
      );
      setTempValues(values);
    }
    toggleOpen(false);
  };

  const handleApply = () => {
    if (isSmallScreen) {
      
      const newParams = new URLSearchParams(location.search);

      tempFilters.forEach((tempFilter) => {
        const tempSelectedOptions = tempFilter.selectedOptions || [];
        const paramKey = getParamKey(tempFilter.label);
        if (tempSelectedOptions.length > 0) {
          newParams.set(paramKey, tempSelectedOptions.join(','));
        } else {
          newParams.delete(paramKey);
        }
      });

      // Update the budget values
      if (values[0] !== tempValues[0] || values[1] !== tempValues[1]) {
        if (tempValues[0] !== minValue) {
          newParams.set('minBudget', tempValues[0]);
        } else {
          newParams.delete('minBudget');
        }

        if (tempValues[1] !== maxValue) {
          newParams.set('maxBudget', tempValues[1]);
        } else {
          newParams.delete('maxBudget');
        }
      }

      // Update the URL using navigate
      navigate({
        pathname: location.pathname,
        search: `?${newParams.toString()}`,
      });

      // Close the dropdown
      toggleOpen(false);
    }
  };

  const getParamKey = (label) => {
    switch (label) {
      case 'Value':
        return 'truestimate';
      case 'Growth':
        return 'growth';
      case 'Asset Type':
        return 'asset_type';
      case 'Duration':
        return 'duration';
      case 'Status':
        return 'status';
      case 'RERA':
        return 'rera';
      case 'Availability':
        return 'availability';
      case 'Age of Property':
        return 'age';
      // Add other cases as needed
      default:
        return label.toLowerCase();
    }
  };

  const selectedFilters = isSmallScreen ? tempFilters : filters;
  const selectedValues = isSmallScreen ? tempValues : values;

  const selectedTopicsCount = selectedFilters.filter(
    (filter) => (filter.selectedOptions || []).length > 0
  ).length;

  // Define steps and step size for the slider
  const steps = [100, 125, 150, 175, 200, 225, 250, 275, 300];
  const stepsCount = steps.length - 1; // 8 intervals
  const stepSize = (100 - 50) / stepsCount; // Slider value increment per step in the second segment

  const mapSliderToDisplay = (value) => {
    if (value <= 50) {
      // Continuous mapping from 0 to 100
      return value * 2;
    } else {
      // Stepped mapping from 100 to 300
      const stepIndex = Math.round((value - 50) / stepSize);
      return steps[Math.min(stepIndex, stepsCount)];
    }
  };

  const mapDisplayToSlider = (displayValue) => {
    if (displayValue <= 100) {
      // Continuous mapping from 0 to 100
      return displayValue / 2;
    } else {
      // Stepped mapping from 100 to 300
      let index = steps.indexOf(displayValue);
      if (index === -1) {
        // Find the closest step
        index = steps.findIndex((step) => step >= displayValue);
        if (index === -1) {
          index = stepsCount;
        }
      }
      return 50 + index * stepSize;
    }
  };


  const handleInputChange = (index, inputValue) => {
    let numericValue = parseFloat(inputValue.replace(/[^0-9]/g, ""));
    if (isNaN(numericValue)) numericValue = 0;

    // Ensure input values are within range
    if (numericValue < minValue) numericValue = minValue;
    if (numericValue > maxValue) numericValue = maxValue;

    const updatedValues = [...values];
    updatedValues[index] = numericValue;

    // Maintain logical order
    if (index === 0 && updatedValues[0] > updatedValues[1]) {
      updatedValues[1] = updatedValues[0];
    } else if (index === 1 && updatedValues[1] < updatedValues[0]) {
      updatedValues[0] = updatedValues[1];
    }

    setValues(updatedValues);
    setTempValues(updatedValues);
    if (onApply) {
      onApply(updatedValues);
    }
  };

  useEffect(() => {
    if (selectedFilterRef.current && rightSideRef.current) {
      const container = rightSideRef.current;
      const element = selectedFilterRef.current;

      // Calculate the position of the element relative to the container
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      const scrollOffset =
        elementRect.top - containerRect.top + container.scrollTop;

      container.scrollTo({
        top: scrollOffset,
        behavior: 'smooth',
      });
    }
  }, [selectedFilter]);

  return (
    <div className={`w-[max-content]`}>
      <button
        type="button"
        onClick={() => toggleOpen(!isOpen)}
        className={`${styles.moreFiltersButton} min-w-[70px] w-[max-content] ${selectedTopicsCount > 0 ? 'border-[#205E59]' : ''
          }`}
      >
        <img src={moref} className="h-4 w-4 mx-auto" alt="" />
        <div className="w-full text-nowrap flex items-center">
          <p className={`hidden md:block ${styles.moreftext}`}>More</p>
          <p className={`${styles.moreftext}`}>Filters</p>
          {selectedTopicsCount > 0 && (
            <span className="ml-1 bg-black text-white rounded-full px-2 py-0.5 text-xs">
              {selectedTopicsCount}
            </span>
          )}
        </div>
        <img src={drop} className="ml-2 h-4 w-4 hidden md:block" alt="" />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`${styles.moreFiltersContent} sm:top-auto top-0 rounded-lg right-[-1rem] md:right-0 w-screen md:w-[30rem] mt-2 flex flex-col h-screen md:h-[16.3125rem]`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top bar */}
          <div className=" md:hidden bg-gray-50 py-4 px-[0.75rem] flex justify-between items-center border-b-2 w-full flex-shrink-0 sticky top-0">
            <span className="text-lg font-semibold">Filters</span>
            <button onClick={() => toggleOpen(false)} className="text-gray-500 font-semibold">
              &#10005;
            </button>
          </div>

          <div className="flex md:flex-row flex-col flex-grow overflow-y-auto">
            {/* Left Side (only on md and above) */}
            <div
              className={`${styles.leftSide} hidden md:block rounded-l-lg overflow-y-auto top-0 relative md:h-[inherit] lg:h-auto`}
            >
              {selectedFilters.map((filter) => (
                <div
                  key={filter.label}
                  className={`${styles.filterTopic} ${selectedFilter === filter.label ? 'border-r-2 border-[#153E3B]' : ''
                    }`}
                  onClick={(e) => handleFilterClick(e, filter.label)}
                >
                  <div className={`${styles.filterlabeltxt}`}>{filter.label}</div>
                </div>
              ))}
            </div>

            {/* Right Side */}
            <div
              className={`${styles.rightSide} pb-20 md:pb-0 z-10 w-screen md:w-auto rounded-r-lg top-0 flex-grow overflow-y-auto`}
              ref={rightSideRef}
            >
              {selectedFilters.map((filter) => (
                <div
                  key={filter.label}
                  className={styles.filterOptionsSection}
                  ref={selectedFilter === filter.label ? selectedFilterRef : null}
                >
                  <div className="">
                    <div
                      className={`${styles.filterlabeltxt2} font-semibold md:font-normal text-[#000] md:text-[#726C6C]`}
                    >
                      {filter.label}
                    </div>
                  </div>
                  <div className={styles.filterOptions}>
                    {filter.label === 'Budget' ?  (
                  <div className={`w-[100%] mt-2`}>
                    <div className={styles.sliderContainer}>
                      <Range
                        step={0.1}
                        min={0}
                        max={100}
                        values={selectedValues.map(mapDisplayToSlider)}
                        onChange={handleDragChange}
                        onFinalChange={handleFinalChange}
                        renderTrack={({ props, children }) => (
                          <div {...props} className={styles.track}>
                            <div
                              className={styles.range}
                              style={{
                                background: getTrackBackground({
                                  values: selectedValues.map(mapDisplayToSlider),
                                  colors: ["#ddd", "#153E3B", "#ddd"],
                                  min: 0,
                                  max: 100,
                                }),
                                width: "100%",
                              }}
                            />
                            {children}
                          </div>
                        )}
                        renderThumb={({ props }) => (
                          <div {...props} className={styles.thumb} />
                        )}
                      />
                     <div className="flex gap-2 justify-between mt-4">
              <div className="">
                <label className="mr-2 text-[14px]">Min:</label>
                <div className="flex items-end gap-1 bg-[#FAFAFA] border border-[#B5B3B3] rounded-md px-2 py-1">
                <input
                  type="text"
                  value={values[0]}
                  onChange={(e) => handleInputChange(0, e.target.value)}
                  className="w-[36px] bg-[#FAFAFA] focus:outline-none"
                />
                <span className="text-[14px] text-[#433F3E]">Lakh</span>
                </div>
               
              </div>
              <div className="">
                <label className="mr-2 text-[14px]">Max:</label>
                <div className="flex items-end gap-1 bg-[#FAFAFA] border border-[#B5B3B3] rounded-md px-2 py-1">
                <input
                  type="text"
                  value={values[1]}
                  onChange={(e) => handleInputChange(1, e.target.value)}
                   className="w-[36px] bg-[#FAFAFA] focus:outline-none"
                />
                <span className="text-[14px] text-[#433F3E]">Lakh</span>
                </div>
              </div>
            </div>
                    </div>
                  </div>
                ) : (
                      filter.options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`${styles.dropdownMenuitemout
                            } ${(filter.selectedOptions || []).includes(option)
                              ? styles.selectedFilterOption
                              : ''
                            }`}
                          onClick={() => handleOptionClick(filter.label, option)}
                        >
                          <div className={`${styles.dropdownMenuitemin}`}>
                            {option}
                            {(filter.selectedOptions || []).includes(option) && (
                              <span className="ml-2">×</span>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          {isSmallScreen && (
            <div
              className="z-[10] md:hidden w-full max-h-16 bg-[#FAFAFA] sticky bottom-0 grid grid-cols-2  px-4"
              style={{ bottom: `calc(100vh - 5px - ${window.innerHeight}px)` }}
            >
              <div className="flex justify-center items-center">
                <p className="text-[0.875rem] text-[#BD0E2D]" 
                onClick={() => {
                  handleClearFilters(); 
                  handleCancel(); 
                }}>
                  Reset
                </p>
              </div>
              <div className="flex justify-center items-center">
                <button
                  className={`text-white bg-[#003D3D] px-6 py-2 rounded-md ${styles.btn}`}
                  onClick={handleApply}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoreFiltersDropdown;
