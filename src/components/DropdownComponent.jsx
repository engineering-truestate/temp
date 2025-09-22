import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSortOrder, fetchInitialProjects, fetchAllProjectsAtOnce, fetchTableProjects } from '../slices/projectSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import drop from '/assets/icons/navigation/arrow-down.svg';
import styles from './SearchBar.module.css';

const DropdownComponent = ({setCurrentPage}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSortOrder = queryParams.get('sortOrder') || '';

  const options = [
    { label: 'IRR - High to Low', value: 'irr_desc' },
    { label: 'Investment Amount - High to Low', value: 'investment_desc' },
    { label: 'Investment Amount - Low to High', value: 'investment_asc' },
    { label: 'Price / Sq ft - Low to High', value: 'price_sqft_asc' },
    { label: 'Price / Sq ft - High to Low', value: 'price_sqft_desc' }
  ];

  useEffect(() => {
    const option = options.find(option => option.value === initialSortOrder);
    if (option) {
      setSelectedOption(option.label);
    } else {
      setSelectedOption(''); // Reset if no matching option found
    }
  }, [initialSortOrder, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(`.${styles.dropdownContainer}`)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = async (option) => {
    if (selectedOption === option.label) {
      // Handle deselection
      setSelectedOption('');
      
      // Remove sortOrder from URL while preserving other parameters
      const newParams = new URLSearchParams(location.search);
      newParams.delete('sortOrder');
      navigate({ search: newParams.toString() || '?' }, { replace: true });

      // Reset sort order and fetch data
      dispatch(setSortOrder(''));
      dispatch(fetchInitialProjects());
      dispatch(fetchAllProjectsAtOnce());
      dispatch(fetchTableProjects(1));
    } else {
      // Handle selection
      setSelectedOption(option.label);
      
      // Update URL
      const newParams = new URLSearchParams(location.search);
      newParams.set('sortOrder', option.value);
      navigate({ search: newParams.toString() }, { replace: true });

      // Update sort order and fetch data
      dispatch(setSortOrder(option.value));
      dispatch(fetchInitialProjects());
      dispatch(fetchAllProjectsAtOnce());
      dispatch(fetchTableProjects(1));
    }
    setIsOpen(false);
  };

  const buttonLabel = selectedOption || 'Sort By';
  const showClearButton = selectedOption !== '';

  useEffect(() => {
    // Update sort order and fetch data
    dispatch(setSortOrder(initialSortOrder));
    dispatch(fetchInitialProjects());
    dispatch(fetchAllProjectsAtOnce());
    dispatch(fetchTableProjects(1));
  }, [dispatch, initialSortOrder]);

  return (
    <div className={`${styles.dropdownContainer} relative`}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={`${styles.dropdownButton} w-[max-content] text-nowrap bg-[#FAFAFA] border-gray-300 ${showClearButton ? styles.selectedDropdownBtn : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-sm font-medium">{buttonLabel}</span>
        <img src={drop} className="ml-2 h-4 w-4" alt="" />
      </button>

      {isOpen && (
        <div className={`${styles.dropdownMenu} py-0 absolute left-0 sm:left-auto sm:right-0 mt-2 w-[max-content] bg-white border rounded-lg shadow-lg z-10`}>
          <ul className="">
            {options.map((option) => (
              <div
                key={option.value}
                className={`my-2 ${styles.dropdownMenuitemout} ${selectedOption === option.label ? styles.selectedDropdownItem : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                <div className={`${styles.dropdownMenuitemin}`}>
                  {option.label}
                  {selectedOption === option.label && <span className={`${styles.cross} ml-2`}>×</span>}
                </div>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownComponent;