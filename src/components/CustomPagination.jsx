import React from "react";
import { usePagination } from "react-instantsearch";

import ArrowLeft from "/assets/icons/navigation/arrow-left.svg";
import ArrowRight from "/assets/icons/navigation/arrow-right-1.svg";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";

function CustomPagination({ isMobile }) {
    const { currentRefinement, nbPages, refine } = usePagination();

    // Function to generate the pages to display in pagination
    const generatePages = () => {
        const pages = [];
        // const pageWindow = 3;
        const pageWindow =  1; 
        const totalVisiblePages =  pageWindow;

        let startPage = Math.max(1, currentRefinement - pageWindow + 1);
        let endPage = Math.min(nbPages, currentRefinement + pageWindow + 1);

        // Adjust for pages near the start or end
        // if (currentRefinement <= pageWindow) {
        //     endPage = Math.min(nbPages, totalVisiblePages);
        // } else if (currentRefinement + pageWindow >= nbPages) {
        //     startPage = Math.max(1, nbPages - totalVisiblePages + 1);
        // }

        // Add the first page and ellipsis if needed
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push("...");
        }

        // Add pages within the range
        for (let page = startPage; page <= endPage; page++) {
            pages.push(page);
        }

        // Add last page and ellipsis if needed
        if (endPage < nbPages) {
            if (endPage < nbPages - 1) pages.push("...");
            pages.push(nbPages);
        }

        return pages;
    };

    const pages = generatePages();


       // Only render pagination if there are more than one page
       if (nbPages <= 1) {
        return null; // No pagination if there is only one page
    }


    return (
        <div className="py-1 w-full flex justify-center">
            <div className=" w-full flex justify-center items-center">
            <ul className="inline-flex items-center space-x-2 ">
                {/* Previous Button */}
                
                <li
                    className={`flex items-center justify-center px-2 py-2 bg-gray-100 border border-gray-300 rounded text-gray-600 hover:border-gray-400 cursor-pointer w-8 h-8 ${
                        currentRefinement === 1 ? 'cursor-not-allowed text-gray-400' : ''
                    }`}
                        onClick={() => {
                            currentRefinement > 0 && refine(currentRefinement - 1)
                            logEvent(analytics, "click_prop_page_chng", { Name: "prop_page_chng" })
                        }
                    }
                >
                    <img src={ArrowLeft} alt="Previous" className="w-4 md:w-5 h-4 md:h-5" />
                </li>

                {/* Page Numbers */}
                {pages.map((page, index) =>
                        page === "..." ? (
                            <li key={index} className="flex items-center justify-center px-2 py-2 text-gray-500">
                                ...
                            </li>
                        ) : (
                            <li
                                key={index}
                                className={`flex items-center justify-center w-8 h-8  border-[#205e59] rounded text-black  hover:border-gray-400 cursor-pointer ${currentRefinement === page - 1
                                        ? " text-black hover:text-neutral-800  bg-[#DFF4F3] border-black border-[1.5px]  "
                                        : ""
                                    }`}
                                onClick={() => {
                                    refine(page - 1) 
                                    logEvent(analytics, "click_prop_page_chng", { Name: "prop_page_chng" })
                                }}
                            >
                                {page}
                            </li>
                        )
                    )}

                {/* Next Button */}
                <li
                        className={`flex items-center justify-center px-2 py-2 bg-gray-100 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 hover:border-gray-400 cursor-pointer w-8 h-8 ${currentRefinement === nbPages ? 'cursor-not-allowed text-gray-400' : ''
                            }`}
                        onClick={() => {
                            currentRefinement < nbPages - 1 && refine(currentRefinement + 1) 
                             logEvent(analytics, "click_prop_page_chng", { Name: "prop_page_chng" })
             
                            
                        }}
                >
                    <img src={ArrowRight} alt="Next" className="w-4 md:w-5 h-4 md:h-5" />
                </li>
            </ul>
            </div>
           
        </div>
    );
}

export default CustomPagination;
