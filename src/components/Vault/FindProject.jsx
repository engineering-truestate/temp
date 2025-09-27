import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import VaultHeader from "./VaultHeader";
import styles from "./AddProjectModal.module.css";
import Vaultform from "./Vaultform.jsx";
import VaultSummary from "./VaultSummary.jsx";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchInitialProjects,
  fetchMoreProjects,
  setSearchTerm,
} from "../../slices/projectSlice"; 
import { setVaultFormActive } from "../../slices/vaultConfirmationSlice"; 
import { useToast } from "../../hooks/useToast.jsx";
import whatsapp from "/assets/icons/social/whatsapp-3.svg";
import Investment from "./Investment.jsx";
import { bulkUploadLarge } from "../../utils/common.js";
import { getAllProjects, saveFormData } from "../../slices/apis/vault.js";
import arrowleft from "/assets/icons/navigation/arrow-left-2.svg";
import { toCapitalizedWords } from "../../utils/common.js";
import Loader from "../Loader";
import { showLoader, hideLoader, selectLoader } from "../../slices/loaderSlice";
import ExitFormModal from "../Modal/ExitFormModal.jsx";
import { addVaultForm } from "../../slices/userAuthSlice.js";
import ConfirmationModal from "./ConfirmationModal.jsx";
import InvManager from "../../utils/InvManager.js";
import { setShowSignInModal } from "../../slices/modalSlice.js";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import algoliaService from "../../services/algoliaService.js";

// Simple debounce hook
function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// Custom Hit Component for Algolia results
const Hit = ({ hit, onSelect }) => {
  return (
    <div
      className="flex items-center hover:bg-gray-100 cursor-pointer"
      onClick={() => onSelect(hit)}
    >
      <li
        key={hit.objectID}
        className={`py-3 px-5 cursor-pointer ${styles.h2}`}
      >
        {toCapitalizedWords(hit.projectName)}
      </li>
      <p className={`ml-auto mr-5 ${styles.h2} italic`}>
        {toCapitalizedWords(hit.assetType)}
      </p>
    </div>
  );
};

const FindProjectPage = () => {
  const dispatch = useDispatch();

  const { userDocId, userPhoneNumber } = useSelector((state) => state.userAuth);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { addToast, updateToast } = useToast();
  const [currentStep, setCurrentStep] = useState(0); 
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
  const [pendingRoute, setPendingRoute] = useState(null);
  const [pendingFormSubmit, setPendingFormSubmit] = useState(false);
  const isVaultFormActive = useSelector(
    (state) => state.vaultConfirmation.isVaultFormActive
  );

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
  const [isSelected, setisSelected] = useState(false);
  const [iserror, setiserror] = useState(false);
  const [algoliaResults, setAlgoliaResults] = useState([]); // Algolia search results
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [formData, setFormData] = useState({});
  const [showExitFormModal, setShowExitFormModal] = useState(false);
  const loading = useSelector(selectLoader);
  const vaultFormRef = useRef();
  const navigate = useNavigate();
  const [searchLoading, setSearchLoading] = useState(false);
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    if (currentStep === 1) {
      history.pushState(null, null, window.location.href);

      const handlePopState = (event) => {
        setShowExitFormModal(true);

        if (showExitFormModal) {
          window.history.back();
        } else {
          history.pushState(null, null, window.location.href);
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && pendingFormSubmit && formData) {
      submitFormData();
      setPendingFormSubmit(false);
    }
  }, [isAuthenticated, pendingFormSubmit]);

  useEffect(() => {
    dispatch(hideLoader());
  }, []);

  // Algolia search effect
  useEffect(() => {
    let cancelled = false;

    // Clear results when query is empty
    if (!debouncedSearchTerm || debouncedSearchTerm.trim().length === 0) {
      setAlgoliaResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    (async () => {
      try {
        const res = await algoliaService.client.search([
          {
            indexName: "truestate_restack", // Use your correct index name here
            query: debouncedSearchTerm,
            params: {
              filters: "NOT source:restackStock", // Adjust filters as needed
              hitsPerPage: 10,
            },
          },
        ]);

        if (cancelled) return;
        
        const hits = (res && res.results && res.results[0] && res.results[0].hits) || [];
        setAlgoliaResults(hits);
        setSearchLoading(false);
      } catch (err) {
        console.error("Algolia search error:", err);
        if (!cancelled) {
          setAlgoliaResults([]);
          setSearchLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearchTerm]);

  // Outside click handler to close dropdown
  const handleClickOutside = useCallback((e) => {
    if (
      searchContainerRef.current &&
      dropdownRef.current &&
      !searchContainerRef.current.contains(e.target) &&
      !dropdownRef.current.contains(e.target)
    ) {
      setIsDropdownVisible(false);
    }
  }, []);

  useEffect(() => {
    if (isDropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownVisible, handleClickOutside]);

  const handleProjectSelect = async (project, event) => {
    try {
      const searchValue2 = toCapitalizedWords(project.projectName);
      setSearchTerm(searchValue2);
      setIsDropdownVisible(false);
      setisSelected(true);
      setiserror(false);
      const assetType = project.assetType; 
      project.assetType = assetType; 
      setSelectedProperty(project);

      logEvent(
        analytics,
        `choose_inside_vault_${project.assetType}`,
        { Name: `choose_${project.assetType}` }
      );
    } catch (error) {
      console.error("Error selecting project:", error);
    }
  };

  const submitFormData = async () => {
  // Show loading toast immediately
  const loadingToastId = addToast(
    "Processing",
    "loading",
    "Submitting your form..."
  );

  try {
    dispatch(showLoader());

    if (!selectedProperty) {
      updateToast(loadingToastId, {
        type: "error",
        heading: "Error",
        description: "No property selected",
      });
      dispatch(hideLoader());
      return;
    }

    if (!formData || Object.keys(formData).length === 0) {
      updateToast(loadingToastId, {
        type: "error",
        heading: "Error",
        description: "Form data is missing",
      });
      dispatch(hideLoader());
      return;
    }

    if (!userDocId || !userPhoneNumber) {
      updateToast(loadingToastId, {
        type: "error",
        heading: "Error",
        description: "User information missing",
      });
      dispatch(hideLoader());
      return;
    }

    const reportUrl = `${window.location.origin}/vault/investment/${encodeURIComponent(selectedProperty.projectName)}`;

    // Clear form and advance step
    setFormData(null);
    setCurrentStep((prevStep) => prevStep + 1);
    dispatch(setVaultFormActive(false));

    // Update toast to success
    updateToast(loadingToastId, {
      type: "success",
      heading: "Form Submitted",
      description: "Your form has been submitted successfully.",
    });
  } catch (error) {
    console.error("Form submission error:", error);

    // Update toast to error
    updateToast(loadingToastId, {
      type: "error",
      heading: "Submission Failed",
      description: "There was an error submitting your form.",
    });
  } finally {
    dispatch(hideLoader());
  }
};

  const handleNextClick = async () => {
    if (currentStep === 0) {
      if (!isSelected || searchTerm === "") {
        setiserror(true);
        return;
      }
      setSearchTerm("");
      setCurrentStep((prevStep) => prevStep + 1);
      dispatch(setVaultFormActive(true));
    } else if (currentStep === 1) {
      if (!isAuthenticated) {
        setPendingFormSubmit(true);
        dispatch(
          setShowSignInModal({
            showSignInModal: true,
            redirectUrl: "/properties",
          })
        );
        return;
      }

      if (vaultFormRef.current) {
        const isValid = await vaultFormRef.current.submitForm();

        if (!isValid) {
          return; 
        }
        await submitFormData();
        navigate("/vault");
      } else {
        return;
      }
    }
  };
  
  const handleInputFocus = () => {
    setIsDropdownVisible(true);
  };

  const handleConfirmNavigation = () => {
    dispatch(setVaultFormActive(false)); 
    dispatch(showLoader())
    navigate("/vault"); 
    setShowConfirmationModal(false); 
    setPendingRoute(null);
  };

  const handleCancelNavigation = () => {
    setShowConfirmationModal(false);
    setPendingRoute(null); 
  };

  const handleInputChange = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    
    // Reset selection state when user starts typing again
    if (isSelected && searchValue !== toCapitalizedWords(selectedProperty?.projectName || '')) {
      setisSelected(false);
      setSelectedProperty(null);
    }
    
    if (searchValue === "") {
      setiserror(false);
    }
  };

  const handlebackclick = () => {
    if (currentStep === 1 && (hasUnsavedChanges || isVaultFormActive))
      setShowConfirmationModal(true);
    else if (currentStep == 2) setCurrentStep(1);
    else{
      dispatch(showLoader())
      navigate("/vault");
    }
  };

  const openWhatsapp = () => {
    const phoneNumber = InvManager.phoneNumber;
    const message = encodeURIComponent(
      `Hi, I want to add a project to the vault, but it is not listed.`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {loading ? (
        <div className="flex h-[100vh]">
          <Loader />
        </div>
      ) : (
        <>
          <div className=" px-4 md:px-8 pb-4 ">
            <div className="">
              <div className="bg-[#FAFAFA] h-fit flex items-center justify-center  sticky py-4   z-[5] top-[64px]">
                <div
                  onClick={handlebackclick}
                  className="md:flex items-center cursor-pointer absolute left-0 hidden  gap-3  "
                >
                  <img src={arrowleft} />
                  <span className="font-montserrat text-[14px] font-semibold  text-[#7A7B7C] leading-[18px] ">
                    Back
                  </span>
                </div>
                <VaultHeader currentStep={currentStep} />
              </div>

              <hr className="b-[2px] border-[#E3E3E3] mb-4 md:mb-5" />

              {currentStep === 0 && (
                <div>
                  <div>
                    <main className="max-w-xl ">
                      <h1 className={` ${styles.h7} mb-6`}>
                        Find your Project
                      </h1>

                      <div className=" mb-1">
                        <label
                          className={`${styles.h8} text-left `}
                          htmlFor="project-search"
                        >
                          Search for a project
                        </label>
                      </div>

                      <div ref={searchContainerRef} className="relative">
                        <input
                          id="project-search"
                          onClick={() => {
                            logEvent(analytics, "input_inside_vault_search", {
                              Name: "vault_search_property",
                            });
                          }}
                          type="text"
                          autoComplete="off"
                          value={searchTerm}
                          placeholder="Eg. Birla Trimaya"
                          onFocus={handleInputFocus}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border border-gray-300 bg-[#FAFAFA]   rounded-md ${styles.h2} focus:outline-none focus:border-gray-500 h-12`}
                        />
                      </div>

                      <div className={`mb-2  `}>
                        {iserror && (
                          <p className={` ${styles.h6} text-red-500`}>
                            Please select a project to continue
                          </p>
                        )}
                      </div>
                    </main>
                  </div>
                </div>
              )}

              {showConfirmationModal == true && (
                <ConfirmationModal
                  isOpen={showConfirmationModal}
                  onCancel={handleCancelNavigation}
                  onConfirm={handleConfirmNavigation}
                  message="You have unsaved changes. Do you want to continue?"
                />
              )}

              {/* Algolia Search Results Dropdown */}
              {searchTerm != "" && (
                <div className=" absolute overflow-x-hidden w-[90%] md:w-[100%] md:max-w-[574px] ">
                  {isDropdownVisible && (
                    <ul 
                      ref={dropdownRef}
                      className="dropdown  bg-[#FAFAFA]  border border-gray-200 rounded-md shadow-lg w-full  max-h-60 overflow-y-auto z-10"
                    >
                      {searchLoading ? (
                        <div className="flex justify-center items-center py-3">
                          Loading...
                        </div>
                      ) : algoliaResults.length == 0 && searchTerm != "" ? (
                        <div className="flex py-3 px-5 ">
                          <p className={` ${styles.h2} text-[#433F3E] `}>
                            Can't find your project?
                          </p>
                          <div
                            className="flex bg-[#153E3B] text-white min-w-[97px] max-h-[30px] justify-center items-center rounded-lg  gap-1 px-[8px]  py-[6px] ml-auto"
                            onClick={() => openWhatsapp()}
                          >
                            <img
                              src={whatsapp}
                              className="w-[13px] h-[13px]"
                              alt="img"
                            ></img>
                            <button
                              className="font-lato text-[12px] font-bold leading-[18px] text-right"
                              onClick={() => {
                                logEvent(
                                  analytics,
                                  "click_inside_vault_contact_im",
                                  { Name: "vault_contact_im" }
                                );
                              }}
                            >
                              Contact IM
                            </button>
                          </div>
                        </div>
                      ) : (
                        algoliaResults.map((hit) => (
                          <Hit
                            key={hit.objectID}
                            hit={hit}
                            onSelect={(selectedHit) => handleProjectSelect(selectedHit, null)}
                          />
                        ))
                      )}
                    </ul>
                  )}
                </div>
              )}

              {currentStep === 1 && selectedProperty && (
                <div>
                  <Vaultform
                    ref={vaultFormRef}
                    formData={formData}
                    setFormData={setFormData}
                    selectedProperty={selectedProperty}
                    loading={loading}
                    setLoading={(loading) => {
                      if (loading) {
                        dispatch(showLoader());
                      } else {
                        dispatch(hideLoader());
                      }
                    }}
                  />
                </div>
              )}

              {currentStep === 2 && formData && (
                <div>
                  <VaultSummary formData={formData} />
                </div>
              )}

              <button
                onClick={() => {
                  handleNextClick();
                  {
                    logEvent(
                      analytics,
                      `click_inside_vault_form_${currentStep === 1 ? "Submit" : "Next"}_button`,
                      { Name: "vault_form_button" }
                    );
                  }
                }}
                className={` ${styles.knowMoreBtn}  bg-[#153E3B] text-white  rounded-md `}
              >
                {currentStep === 1 ? "Submit" : "Next"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FindProjectPage;