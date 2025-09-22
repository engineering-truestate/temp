import React, { useState, useEffect } from 'react';
// import Pagination1 from '/icons-1/Pagination1.svg'; // File no longer exists
// import Pagination2 from '/icons-1/Pagination2.svg'; // File no longer exists
// import Pagination3 from '/icons-1/Pagination3.svg'; // File no longer exists
// import Pagination4 from '/icons-1/Pagination4.svg'; // File no longer exists
import styles from './Table.module.css';

const Pagination = ({ currentPage, setCurrentPage, totalPages, handlePreviousPage, handleNextPage, handleFirstPage, handleLastPage }) => {
  const [inputValue, setInputValue] = useState(Math.min(currentPage, totalPages));

  useEffect(() => {
    setInputValue(currentPage);
  }, [currentPage]);

  const handleInputChange = (e) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);
  };

  const handleInputBlur = () => {
    const pageNumber = Number(inputValue);
    if (pageNumber >= 1 && pageNumber <= totalPages && !isNaN(pageNumber)) {
      setCurrentPage(pageNumber);
    } else {
      setInputValue(currentPage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  return (
    <div className='block p-0 sticky bottom-0 right-0 ml-auto max-h-[28px]'>
      <div className="flex justify-between mt-0 ml-auto mr-5 items-center space-x-[8px]  min-h-[28px] max-w-fit">
        {/* First Page Button */}
        <button
          className={`${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''} bg-[#E4E5E6] w-[28px] h-[28px] px-[14px] py-[3px] border-[1px] border-[#9498A6] rounded-[6px] flex items-center justify-center`}
          onClick={handleFirstPage}
          disabled={currentPage === 1}
        >
          &lt;&lt;
        </button>

        {/* Previous Page Button */}
        <button
          className={`${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''} bg-[#E4E5E6] w-[28px] h-[28px] px-[14px] py-[3px] border-[1px] border-[#9498A6] rounded-[6px] flex items-center justify-center`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {/* Page Information */}
        <span className={`rounded ${styles.pagination1} whitespace-nowrap`}>
          {/* {currentPage} of {totalPages} */}
          Page
          <input
            type="number" // Changed to text to avoid browser spinners
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyPress={handleKeyPress}
            className="mx-1 w-12 px-2 py-1 text-center border rounded-md"
            pattern="\d*" // Allows only numbers input
          />
          {/* {currentPage} */}
          of {totalPages}
        </span>

        {/* Next Page Button */}
        <button
          className={`${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''} bg-[#E4E5E6] w-[28px] h-[28px] px-[14px] py-[3px] border-[1px] border-[#9498A6] rounded-[6px] flex items-center justify-center`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>

        {/* Last Page Button */}
        <button
          className={`${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''} bg-[#E4E5E6] w-[28px] h-[28px] px-[14px] py-[3px] border-[1px] border-[#9498A6] rounded-[6px] flex items-center justify-center`}
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
        >
          &gt;&gt;
        </button>
      </div>
    </div>

  );
};

export default Pagination;
