import React from "react";
import styles from "./AddProjectModal.module.css";
import fwdArrow from "/assets/icons/navigation/arrow-right-3.svg";
import whatsapp from "/assets/icons/social/whatsapp-3.svg";
import { toCapitalizedWords } from "../../../../utils/common";
import { logEvent } from 'firebase/analytics';
import { analytics } from "../../../../firebase";

const AddProjectToVault = ({
  searchTerm,
  setSearchTerm,
  filteredProjects,
  handleInputChange,
  handleInputFocus,
  isDropdownVisible,
  handleProjectSelect,
  iserror,
  currentStep,
  handleNextClick,
  isMobile,
}) => {
  const openWhatsapp = () => {
    // Implement whatsapp functionality here
    window.open("https://wa.me/yourphonenumber", "_blank");
  };

  return (
    <div className="px-4 sm:px-0">
      <div>
        <div>
          <main>
            <div className="flex border border-gray-300 rounded-md text-['Lato']">
              <input
                id="project-search"
                type="text"
                autoComplete="off"
                value={searchTerm}
                placeholder="Search for your project"
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-md bg-[#FAFAFA] focus:outline-none focus:border-gray-500 h-12 w-[12rem] md:w-[28rem] placeholder:font-['Lato']`}
                onClick={()=>{logEvent(analytics,'click_outside_vault_search',{Name:'vault_search_bar'})}}
              />
              {!isMobile ? (
                <button
                  onClick={handleNextClick}
                  className="px-6 py-2 rounded-md text-['Lato'] text-white bg-[#153E3B] hover:bg-[#0f2c2a] transition-colors"
                >
                  Get Started
                </button>
              ) : (
                <button
                  onClick={handleNextClick}
                  className="px-6 py-2 rounded-md text-white bg-[#153E3B] hover:bg-[#0f2c2a] transition-colors"
                >
                  <img src={fwdArrow} className="w-6 h-6" alt="Forward Arrow" />
                </button>
              )}
            </div>

            <div className="mb-2">
              {iserror && (
                <p className={`${styles.h6} text-red-500`}>
                  Please select a project to continue
                </p>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Project dropdown */}
      {searchTerm !== "" && (
        <div className="absolute overflow-x-hidden w-[20rem] md:w-[36rem]">
          {isDropdownVisible && filteredProjects && (
            <ul className="dropdown bg-[#FAFAFA] border border-gray-200 rounded-md shadow-lg w-full max-h-60 overflow-y-auto z-10">
              {filteredProjects.length === 0 && searchTerm !== "" && (
                <div className="flex py-3 px-5">
                  <p className={`${styles.h2} text-[#433F3E]`}>
                    Can't find your project?
                  </p>
                  <div
                    className="flex bg-[#153E3B] text-white min-w-[97px] max-h-[30px] justify-center items-center rounded-lg gap-1 px-[8px] py-[6px] ml-auto cursor-pointer"
                    onClick={openWhatsapp}
                  >
                    <img
                      src={whatsapp}
                      className="w-[13px] h-[13px]"
                      alt="WhatsApp"
                    />
                    <button className="font-lato text-[12px] font-bold leading-[18px] text-right">
                      Contact IM
                    </button>
                  </div>
                </div>
              )}

              {filteredProjects &&
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleProjectSelect(project)}
                  >
                    <li className={`py-3 px-5 ${styles.h2}`}>
                      {toCapitalizedWords(project.projectName)}
                    </li>
                    <p className={`ml-auto mr-5 ${styles.h2} italic`}>
                      {toCapitalizedWords(project.assetType)}
                    </p>
                  </div>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AddProjectToVault;
