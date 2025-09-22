import React, { useState, useRef, useEffect } from "react";
import { RefinementList } from "react-instantsearch";

const DropdownMoreFilters = ({ attribute, title, classNames, transformFunction, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const transformItems = (items) => {
        return items.map((item) => ({
            ...item,
            label: transformFunction ? transformFunction(item.label) : item.label,
        }));
    };

    return (
        <div ref={ref} className="font-lato text-[13px]  text-[#000000]">
            <button
                className={`flex w-full items-center justify-between gap-[6px] border-[0.5px] ${isOpen ? "bg-[#0F2C2A] text-white" : "border-[#CFCECE] bg-[#FAFBFC] text-[#5A5A5A]"
                    } py-[8px] px-[12px] rounded-[8px]`}
                onClick={handleToggle}
            >
                {title}
                <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* {isOpen && ( */}
            <div className={`absolute mt-2 border border-gray-300 rounded bg-white shadow-lg z-20 w-auto ${isOpen ? "block" : "hidden"}`}>
                <RefinementList
                    attribute={attribute}
                    {...props}
                    classNames={{
                        root: "w-auto",
                        list: "space-y-2 m-1",
                        item: "w-full font-lato text-[#5A5A5A] text-[14px] leading-[17.92px] ml-1 w-full",
                        selectedItem: "",
                        label: "w-full flex items-center cursor-pointer gap-4 text-left pr-2",
                        checkbox: "cursor-pointer w-3",
                        count: "bg-[#E8ECEB] ml-auto rounded-[5px] text-[#313131] font-lato py-[2px] px-[4px] text-[12px] justify-self-end",
                    }}
                // sortBy={[attribute === "tag" ? 'name:desc' : 'name:asc']}
                // transformItems={transformItems}
                />
            </div>
            {/* )} */}
        </div>
    );
};

export default DropdownMoreFilters;
