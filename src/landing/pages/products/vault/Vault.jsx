import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Intro from "../vault/Intro.jsx";
import Features from "../vault/Features.jsx";
import FooterSection from "./FooterSection.jsx";
import UnitDetailsForm from "../../../../components/Vault/Vaultform.jsx";
import { setShowSignInModal } from "../../../../slices/modalSlice.js";
import { setVaultFormActive } from "../../../../slices/vaultConfirmationSlice.js";
import { addVaultForm } from "../../../../slices/userAuthSlice.js";
import { useToast } from "../../../../hooks/useToast";
import { saveFormData, getAllProjects } from "../../../../slices/apis/vault.js";
import SvgFooterVault from "./SvgFooterVault.jsx";
import { useNavigate } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../../../firebase";
import Footer from "../../home/Footer.jsx";

// localStorage keys
const PENDING_FORM_KEY = "vault_pending_form_data";
const PENDING_PROPERTY_KEY = "vault_pending_property";
const PENDING_SUBMIT_FLAG = "vault_pending_submit_flag";

function Vault() {
  // Redux hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDocId, userPhoneNumber } = useSelector((state) => state.userAuth);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Custom hooks
  const { addToast } = useToast();

  // Refs
  const vaultFormRef = useRef(null);

  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [iserror, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [pendingFormSubmit, setPendingFormSubmit] = useState(false);

  // Helper function for capitalizing words
  const toCapitalizedWords = (text) => {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Check localStorage for pending form submission on component mount
  useEffect(() => {
    // Check if there's a pending form submission in localStorage
    const pendingFlag = localStorage.getItem(PENDING_SUBMIT_FLAG);

    if (pendingFlag === "true") {
      setPendingFormSubmit(true);

      // If we're authenticated, proceed with form submission
      if (isAuthenticated && userDocId && userPhoneNumber) {
        const storedFormData = JSON.parse(
          localStorage.getItem(PENDING_FORM_KEY)
        );
        const storedProperty = JSON.parse(
          localStorage.getItem(PENDING_PROPERTY_KEY)
        );

        if (storedFormData && storedProperty) {
          console.log("Found pending form submission in localStorage");
          submitFormWithData(storedFormData, storedProperty);

          // Clear localStorage after submission
          clearLocalStorageData();
        }
      }
    }
  }, []);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedData = await getAllProjects();
        setProjects(fetchedData);
      } catch (error) {
        console.error("Error fetching projects:", error);
        addToast("Error", "error", "Failed to load projects");
      }
    };
    fetchProjects();
  }, []);

  // Filter projects based on search term
  useEffect(() => {
    if (searchTerm?.trim().length > 0) {
      const filtered = projects.filter((project) =>
        project?.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (searchTerm === "") setIsError(false);

      const timeoutId = setTimeout(() => {
        setFilteredProjects(filtered);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setFilteredProjects([]);
    }
  }, [searchTerm, projects]);

  // Handle authentication status changes
  useEffect(() => {
    console.log("Auth state changed:", {
      isAuthenticated,
      pendingFormSubmit,
      userDocId,
      userPhoneNumber,
    });

    if (isAuthenticated && pendingFormSubmit && userDocId && userPhoneNumber) {
      // Check localStorage for pending form data
      const storedFormData = JSON.parse(localStorage.getItem(PENDING_FORM_KEY));
      const storedProperty = JSON.parse(
        localStorage.getItem(PENDING_PROPERTY_KEY)
      );

      if (storedFormData && storedProperty) {
        console.log("Processing pending form after authentication");
        submitFormWithData(storedFormData, storedProperty);

        // Clear localStorage after submission
        clearLocalStorageData();
        setPendingFormSubmit(false);
      }
    }
  }, [isAuthenticated, pendingFormSubmit, userDocId, userPhoneNumber]);

  // Save form data to localStorage
  const saveToLocalStorage = (formDataToSave, propertyToSave) => {
    try {
      localStorage.setItem(PENDING_FORM_KEY, JSON.stringify(formDataToSave));
      localStorage.setItem(
        PENDING_PROPERTY_KEY,
        JSON.stringify(propertyToSave)
      );
      localStorage.setItem(PENDING_SUBMIT_FLAG, "true");
      console.log("Form data saved to localStorage");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Clear localStorage data
  const clearLocalStorageData = () => {
    localStorage.removeItem(PENDING_FORM_KEY);
    localStorage.removeItem(PENDING_PROPERTY_KEY);
    localStorage.removeItem(PENDING_SUBMIT_FLAG);
    console.log("Cleared form data from localStorage");
  };

  const submitFormWithData = async (formDataToSubmit, propertyToSubmit) => {
    if (!formDataToSubmit || !propertyToSubmit) {
      console.error("Missing data for submission");
      return;
    }

    if (!userDocId || !userPhoneNumber) {
      console.error("Missing user authentication data");
      // If we're missing user data but have auth, the user data might
      // still be loading, so we'll keep the pending flag
      if (isAuthenticated) {
        setPendingFormSubmit(true);
        return;
      }

      addToast(
        "Authentication Error",
        "error",
        "Please sign in to submit your form."
      );
      return;
    }

    try {
      setLoading(true);
      console.log("Submitting with data:", {
        userId: userDocId,
        userPhone: userPhoneNumber,
      });

      const formId = await saveFormData({
        ...formDataToSubmit,
        projectId: propertyToSubmit?.id,
        assetType: propertyToSubmit.assetType,
        purchasePrice: (formDataToSubmit.purchasePrice * 10000000).toString(),
        userId: userDocId,
        userPhoneNumber,
      });

      const reportUrl = `${
        window.location.origin
      }/vault/investment/${encodeURIComponent(propertyToSubmit.projectName)}`;

      dispatch(
        addVaultForm({
          formData: formDataToSubmit,
          formId,
          projectName: propertyToSubmit?.projectName,
          reportUrl: reportUrl,
        })
      );

      // Update UI state
      setFormData(null);
      setCurrentStep((prevStep) => prevStep + 1);
      dispatch(setVaultFormActive(false));

      addToast(
        "Form Submitted",
        "success",
        "Your form has been submitted successfully."
      );

      // Clear localStorage after successful submission
      clearLocalStorageData();
      navigate("/vault");
    } catch (error) {
      console.error("Form submission error:", error);
      addToast(
        "Submission Failed",
        "error",
        "There was an error submitting your form."
      );
    } finally {
      setLoading(false);
    }
  };

  const submitFormData = async () => {
    await submitFormWithData(formData, selectedProperty);
  };

  const handleNextClick = async () => {
    // Step 0: Project selection validation
    if (currentStep === 0) {
      if (!isSelected || searchTerm === "") {
        setIsError(true);
        return;
      }
      setSearchTerm("");
      setCurrentStep((prevStep) => prevStep + 1);
      dispatch(setVaultFormActive(true));
    }
    // Step 1: Form validation and submission
    else if (currentStep === 1) {
      if (!formData || !selectedProperty) {
        addToast(
          "Missing Data",
          "error",
          "Please complete all required fields before submitting."
        );
        return;
      }

      if (vaultFormRef.current) {
        const isValid = await vaultFormRef.current.submitForm();
        if (!isValid) {
          return;
        }

        if (!isAuthenticated) {
          // Save form data to localStorage before authentication
          saveToLocalStorage(formData, selectedProperty);
          setPendingFormSubmit(true);

          // Show login modal
          dispatch(
            setShowSignInModal({ showSignInModal: true, redirectUrl: null })
          );
          console.log(
            "Opening sign-in modal and saved form data to localStorage"
          );
        } else {
          // User is authenticated, submit the form
          await submitFormData();
        }
      }
    }
  };

  const handleProjectSelect = (project) => {
    try {
      const searchValue = toCapitalizedWords(project.projectName);
      setSearchTerm(searchValue);
      setIsDropdownVisible(false);
      setIsSelected(true);
      setIsError(false);
      // const assetType = project.assetType || "apartment";
      // project.assetType = assetType;
      // console.log(project);
      setSelectedProperty(project);
    } catch (error) {
      console.error("Error selecting project:", error);
    }
  };

  const handleInputFocus = () => {
    setIsDropdownVisible(true);
  };

  const handleInputChange = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
  };

  // Props to pass to Intro and AddProjectToVault
  const projectSearchProps = {
    setSelectedProperty,
    searchTerm,
    setSearchTerm,
    filteredProjects,
    handleInputChange,
    handleInputFocus,
    isDropdownVisible,
    handleProjectSelect,
    iserror,
    setIsSelected,
    currentStep,
    handleNextClick,
  };

  return (
    <div className="h-full">
      {currentStep === 0 && (
        <>
          <Intro projectSearchProps={projectSearchProps} />
          {/* <Services /> */}
          <Features />
          <FooterSection />
        </>
      )}

      {currentStep === 1 && selectedProperty && (
        <div className="mt-[32px] px-6 max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto justify-center w-full">
          <UnitDetailsForm
            ref={vaultFormRef}
            formData={formData}
            setFormData={setFormData}
            selectedProperty={selectedProperty}
            loading={loading}
            setLoading={setLoading}
          />
          <div className="flex gap-6 flex-wrap justify-between items-center py-4 bg-gray-50">
            <button
              onClick={() => {
                handleNextClick();
                logEvent(analytics, "submit_form_outside_vault", {
                  Name: "outside_vault_form_submit",
                });
              }}
              className="bg-[#14403C] text-white py-3 px-12 rounded"
            >
              Submit
            </button>
            {/* <div className="font-lato flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Need Help?</span>
              <button
                className="flex items-center border border-[#14403C] text-[#14403C] py-3 px-6 rounded-md"
                onClick={() => {
                  logEvent(analytics, "click_outside_vault_chat", { Name: "vault_form_chat"});
                }}>
                <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8 pt-2"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
                   <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                Chat With Us
              </button>
            </div> */}
          </div>
        </div>
      )}
      {currentStep === 1 && <SvgFooterVault />}
      {currentStep === 0 && <Footer />}
    </div>
  );
}

export default Vault;
