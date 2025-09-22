import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./requirement.module.css";
// import ThreeDotsIcon from "/icons-1/ThreeDots.svg"; // File no longer exists
import tickIcon from "/assets/icons/status/tick-white.svg";
import tickIcon2 from "/assets/icons/status/tick-black.svg";
import close from "/assets/icons/navigation/btn-close.svg";
import trash from "/assets/icons/actions/btn-delete.svg";
import Slider from "./Slider";
import Shared from "/assets/images/illustrations/shared-properties.png";
import { getRequirementProperties } from "../../services/requirementPropertiesService";
import DropdownMicromarket from "./DropdownMicromarket";
import DropdownAreas from "./DropdownAreas";
import AgentSuggestedProperties from "./AgentSuggestedProperties";
import { showLoader, hideLoader } from "../../slices/loaderSlice";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import { toCapitalizedWords } from "../../utils/common";
import { INVESTMENT_TIMELINE_OPTIONS, LOAN_REQUIRED_OPTIONS, PROPERTY_STAGE_OPTIONS, PROPERTY_TYPE_OPTIONS, REQUIREMENT_FORM_FIELDS } from "../../constants/requirementFormFields";

const RequirementForm = ({
  isActive,
  requirement,
  requirementId,
  updateRequirement,
  setReqIdToDelete,
  setIsModalOpen,
  setDeleteModalOpen,
  isSubmitDisabled,
  setIsSubmitDisabled,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [charCount, setCharCount] = useState(150);
  const [matchedProperties, setMatchedProperties] = useState([]);

  const deleteRef = useRef(null);
  const buttonAreaRef = useRef(null);
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.userAuth?.userDocId || "");

  // Debug logging for requirement object
  useEffect(() => {
    console.log("RequirementForm - Requirement object:", {
      requirementId,
      requirement,
      submit: requirement?.submit,
      id: requirement?.id
    });
  }, [requirement, requirementId]);

  useEffect(() => {
    const isValid =
      Array.isArray(requirement.assetType) &&
      requirement.assetType.length > 0 &&
      Array.isArray(requirement.projectType) &&
      requirement.projectType.length > 0;
    setIsSubmitDisabled(!isValid);
  }, [requirement, setIsSubmitDisabled]);

  useEffect(() => {
    document.body.style.overflow = requirement.submit ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [requirement.submit]);

  // Clear properties on component mount to prevent any stale state
  useEffect(() => {
    setMatchedProperties([]);
  }, []);

  useEffect(() => {
    // Clear properties immediately when requirement changes to prevent flash
    setMatchedProperties([]);

    const fetchProperties = async () => {
      const isSubmittedRequirement = requirementId && requirementId !== "req001" && requirementId !== "req new";

      if (userId && requirementId && isSubmittedRequirement) {
        dispatch(showLoader());
        try {
          const result = await getRequirementProperties(userId, requirementId);
          if (result.success) {
            setMatchedProperties(result.data);
          } else {
            console.error("Failed to fetch requirement properties:", result.error);
            setMatchedProperties([]);
          }
        } catch (error) {
          console.error("Error fetching requirement properties:", error);
          setMatchedProperties([]);
        } finally {
          dispatch(hideLoader());
        }
      }
    };

    fetchProperties();
  }, [userId, requirementId, dispatch]);


  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deleteRef.current && !deleteRef.current.contains(event.target)) {
        setShowDelete(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonAreaRef.current && !buttonAreaRef.current.contains(event.target)) {
        setActiveTooltip(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThreeDotsClick = () => setShowDelete(!showDelete);

  const handleTooltipClick = (label) => {
    setActiveTooltip((prev) => (prev === label ? null : label));
  };

  const handleDelete = (event) => {
    event.preventDefault();
    logEvent(analytics, "requirement_deleted", {
      name: "requirement",
      id: requirement.id,
    });
    setReqIdToDelete(requirement.id);
    setDeleteModalOpen(true);
  };

  const handleSubmit = () => {
    setIsSubmitDisabled(true);
    setIsModalOpen(true);
    logEvent(analytics, "form_submission", {
      name: "requirement_form",
      status: isSubmitDisabled ? "blocked" : "submitted",
    });
  };

  const handleToggleSelect = (name, value, isMulti = false) => {
    const currentValue = requirement[name] || [];
    if (isMulti) {
      if (currentValue.includes(value)) {
        updateRequirement(requirement.id, name, currentValue.filter((item) => item !== value));
      } else {
        updateRequirement(requirement.id, name, [...currentValue, value]);
      }
    } else {
      updateRequirement(requirement.id, name, currentValue === value ? "" : value);
    }
    logEvent(analytics, `click_${name}_requirement`, { Name: `${name}_requirement` });
  };

  const renderToggleButtons = (name, options, isMulti = false) => {
    const propertyArray = Array.isArray(requirement[name]) ? requirement[name] : [];
    return options.map((option) => (
      <button
        key={option.value}
        type="button"
        className={`${styles.button} ${
          isMulti
            ? propertyArray.includes(option.value)
              ? styles.selected
              : styles.ns
            : requirement[name] === option.value
            ? styles.selected
            : styles.ns
        }`}
        onClick={() => handleToggleSelect(name, option.value, isMulti)}
      >
        {option.label}
        {isMulti && propertyArray.includes(option.value) && (
          <img src={close} className="ml-2 w-3" alt="Close" />
        )}
      </button>
    ));
  };

  const formatCurrency = (value) => {
    if (!value) return "N/A";
    if (value >= 100) return `₹${(value / 100).toFixed(2)} Cr`;
    return `₹${value.toFixed(0)} Lac`;
  };

  const formatValue = (val) => {
    if (!val || (Array.isArray(val) && val.length === 0)) return "N/A";
    if (Array.isArray(val)) {
      return val.map((v) => toCapitalizedWords(v.toString())).join(", ");
    }
    return toCapitalizedWords(val.toString());
  };

  const requirementDetails = [
    {
      label: "Budget",
      value: requirement.maxBudget ? formatCurrency(requirement.maxBudget) : "N/A",
    },
    ...REQUIREMENT_FORM_FIELDS.map(({ label, key, unit }) => {
      const val = requirement[key];
      if (val && !(Array.isArray(val) && val.length === 0)) {
        let displayVal = formatValue(val);
        if (unit && typeof val === "number") displayVal = `${val} ${unit}`;
        return { label, value: displayVal };
      }
      return null;
    }).filter(Boolean),
  ];

  if (!isActive) return null;

  const renderSubmittedRequirement = () => (
    <div className="relative space-y-4">
      <div className="flex items-center">
        <h3 className="text-lg font-bold font-montserrat mr-3">Requirement</h3>
        <button onClick={handleThreeDotsClick} className="relative bg-[#FAFAFA]">
          {/* <img src={ThreeDotsIcon} alt="Options" /> */}
          {showDelete && (
            <div
              ref={deleteRef}
              className="absolute left-0 mt-2 w-[98px] bg-[#FAFAFA] hover:bg-red-100 rounded-[4px] border-[1px] border-[#CCCBCB] px-[12px] py-[6px] gap-[8px] shadow-lg z-50 flex justify-between"
              onClick={handleDelete}
            >
              <img src={trash} alt="delete" className="w-auto" />
              <div className="font-lato font-semibold text-[16px] leading-[24px] text-[#DE1135]">
                Delete
              </div>
            </div>
          )}
        </button>
      </div>
      <div className={`flex ${isSmallScreen && !showMore ? "overflow-hidden" : ""}`}>
        <div
          className={`relative flex ${styles.btnpar} pr-4 ${isSmallScreen && !showMore ? "truncate" : "flex-wrap"}`}
          ref={buttonAreaRef}
        >
          {requirementDetails.map(
            ({ label, value }) =>
              value &&
              value !== "N/A" && (
                <button
                  key={label}
                  type="button"
                  className={`${styles.buttonx} ${
                    ["Additional Info", "Micro Markets", "Areas", "Project Stage", "Asset Type"].includes(label)
                      ? "cursor-pointer"
                      : ""
                  }`}
                  onClick={() => handleTooltipClick(label)}
                >
                  <div
                    className="flex"
                    data-tooltip-id={
                      ["Additional Info", "Micro Markets", "Areas", "Project Stage", "Asset Type"].includes(label)
                        ? `tooltip-${label.replace(/\s+/g, "-")}`
                        : undefined
                    }
                    data-tooltip-content={["Additional Info", "Micro Markets", "Areas", "Project Stage", "Asset Type"].includes(label) ? value : undefined}
                  >
                    <Tooltip
                      id={`tooltip-${label.replace(/\s+/g, "-")}`}
                      place="bottom"
                      style={{ maxWidth: "300px", whiteSpace: "normal", wordWrap: "break-word" }}
                    />
                    <span className={`${styles.xlbl} whitespace-nowrap`}>{label}:</span>
                    <span className={`${styles.xval} whitespace-nowrap max-w-[200px] truncate`}>{value}</span>
                  </div>
                </button>
              )
          )}
          {isSmallScreen && !showMore && (
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#FAFAFA] via-[#FAFAFAcc] to-transparent pointer-events-none"></div>
          )}
        </div>
      </div>
      {isSmallScreen && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              setShowMore(!showMore);
              logEvent(analytics, `click_${showMore ? "see_less" : "see_more"}_requirement`);
            }}
          >
            {showMore ? "See Less..." : "See More..."}
          </button>
        </div>
      )}
      <div className="mt-10">
        <h3 className="text-lg font-bold font-montserrat">
          Shared by Investment Manager ({matchedProperties.length})
        </h3>
        {matchedProperties.length > 0 ? (
          <AgentSuggestedProperties view="grid" matchedProperties={matchedProperties} />
        ) : (
          <div className="mt-10 text-center">
            <img src={Shared} className="w-[25vw] md:w-[10vw] mx-auto mb-6" alt="Shared" />
            <div className="text-[#5A5555] font-montserrat text-[14px] font-semibold">
              Personalized property recommendations coming very soon!
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderForm = () => (
    <div>
      <div className="mb-6">
        <div className={styles.perhead}>
          Fill the Requirement Form to get personalized recommendations
        </div>
        <div className="font-lato mt-1 font-medium text-[14px] text-[red]">
          * Marked fields are compulsory
        </div>
      </div>
      <form className={`${styles.bkg} grid lg:grid-cols-2`}>
        <div className={`${styles.pr_18} lg:border-r`}>
          <div className="mb-6">
            <label className={`${styles.lbltxt}`}>
              Budget<span className="text-[red] text-[16px]">*</span>
            </label>
            <Slider requirement={requirement} updateRequirement={updateRequirement} />
          </div>
          <div className="mb-6">
            <label className={`${styles.lbltxt}`}>
              Asset Type<span className="text-[red] text-[16px]">*</span>
            </label>
            <div className="flex flex-wrap mt-3">
              {renderToggleButtons("assetType", PROPERTY_TYPE_OPTIONS, true)}
            </div>
          </div>
          <div className="mb-6">
            <label className={`${styles.lbltxt}`}>Holding Period</label>
            <div className="flex">
              <input
                type="text"
                className="bg-[#FAFAFA] focus:outline-none border border-[#B5B3B3] border-r-0 rounded-l-lg px-4 py-2.5 w-1/3"
                value={requirement.holdingPeriod || ""}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^0-9]/g, "").replace(/^0+/, "");
                  updateRequirement(requirement.id, "holdingPeriod", numericValue);
                }}
              />
              <input
                type="text"
                className="bg-[#FAFAFA] focus:outline-none border border-[#B5B3B3] border-l-0 rounded-r-lg px-4 pl-5 py-2.5 w-[calc(3.25rem+2rem)]"
                value="Years"
                disabled
              />
            </div>
          </div>
          <div className="mb-6">
            <label className={`${styles.lbltxt}`}>Micro Market</label>
            <DropdownMicromarket
              requirement={requirement}
              updateRequirement={updateRequirement}
              onClick={() => logEvent(analytics, "dropdown_micromarket_requirement", { Name: "dropdown_micromarket_requirement" })}
            />
          </div>
          <div className="mb-6">
            <label className={`${styles.lbltxt}`}>Areas</label>
            <DropdownAreas requirement={requirement} updateRequirement={updateRequirement} />
          </div>
        </div>
        <div className={`${styles.pl_18} lg:border-l`}>
          <div className="mb-6">
            <label className={`${styles.lbltxt}`}>
              Project Stage<span className="text-[red] text-[16px]">*</span>
            </label>
            <div className="flex flex-wrap mt-3">
              {renderToggleButtons("projectType", PROPERTY_STAGE_OPTIONS, true)}
            </div>
          </div>
          <div className="mb-6">
            <label className={`${styles.lbltxt}`}>When are you planning to invest?</label>
            <div className="flex flex-wrap mt-3">
              {renderToggleButtons("whenPlanning", INVESTMENT_TIMELINE_OPTIONS, false)}
            </div>
          </div>
          <div className="mb-6">
            <label className={`${styles.lbltxt}`}>Loan Required?</label>
            <div className="flex flex-wrap mt-3">
              {renderToggleButtons("loan", LOAN_REQUIRED_OPTIONS, false)}
            </div>
          </div>
          <div className="mb-8">
            <label className={`${styles.lbltxt}`}>Additional Comments</label>
            <textarea
              className="bg-[#FAFAFA] focus:outline-none border border-[#B5B3B3] rounded-lg px-4 py-2.5 resize w-full mb-1 max-w-full min-h-[100px] max-h-[300px]"
              value={requirement.notes || ""}
              onChange={(e) => {
                updateRequirement(requirement.id, "notes", e.target.value);
                setCharCount(150 - e.target.value.length);
              }}
              maxLength={150}
              onClick={() => logEvent(analytics, "click_comments_requirement", { Name: "submit_comments" })}
            />
            <p className="text-left text-sm text-gray-500">{charCount} characters left</p>
          </div>
        </div>
        <div className={styles.bottomPanel}>
          <button
            className={`${isSubmitDisabled ? styles.disabledSaveButton : styles.saveButton} flex items-center mr-4`}
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          >
            {isSubmitDisabled ? (
              <img src={tickIcon2} alt="Tick Icon" />
            ) : (
              <img src={tickIcon} alt="Tick Icon" className="w-4 h-4" />
            )}
            <span className="ml-2">Submit</span>
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className={`pt-6 rounded ${styles.form} ${styles.bkg}`}>
      {/* Show submitted view for saved requirements, form for new ones */}
      {(requirement.submit || (requirement.id && requirement.id !== "req001" && requirement.id !== "req new"))
        ? renderSubmittedRequirement()
        : renderForm()}
    </div>
  );
};

export default RequirementForm;
