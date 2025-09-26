import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import RequirementForm from "./RequirementForm";
import RequirementSubmitAlert from "./RequirementSubmitAlert";
import DeleteModal from "./DeleteModal";
import styles from "./requirement.module.css";
import Loader from "../Loader";
import { getUnixDateTimeOneDayLater } from "../helper/dateTimeHelpers";

import { useToast } from "../../hooks/useToast";
import { selectUserDocId } from "../../slices/userAuthSlice";
import {
  fetchRequirements,
  saveRequirement,
  updateRequirement,
  updateRequirementField,
  deleteRequirement,
  generateRequirementIdAsync,
  setActiveRequirement,
  setNextRequirementId,
  updateRequirementLocal,
  selectAllRequirements,
  selectRequirementsLoading,
  selectActiveRequirementId,
  selectNextRequirementId,
} from "../../slices/requirementSlice";
import { addTask } from "../../slices/userSlice";
import { showLoader, hideLoader } from "../../slices/loaderSlice";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";

const Requirement = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserDocId);
  const requirements = useSelector(selectAllRequirements);
  const loading = useSelector(selectRequirementsLoading);
  const activeRequirementId = useSelector(selectActiveRequirementId);
  const nextReqId = useSelector(selectNextRequirementId);

  // Use activeRequirementId from Redux, fallback to local state for backwards compatibility
  const [activeTab, setActiveTab] = useState(activeRequirementId || "req001");
  const [localRequirement, setLocalRequirement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reqIdToDelete, setReqIdToDelete] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const { addToast, updateToast } = useToast();

  // Create default requirement object
  const createDefaultRequirement = (id) => {
    try {
      return {
        id: id,
        maxBudget: 1500,
        minBudget: null,
        areas: [],
        budgetForAuction: null,
        budgetForPreLaunch: null,
        budgetForExclusiveOpp: null,
        productType: [],
        strategy: [],
        typeOfInvestment: [],
        assetType: [],
        floor: [],
        facing: [],
        projectType: [],
        loan: [],
        microMarket: [],
        plotArea: null,
        villaConfiguration: null,
        sbuaSize: null,
        whenPlanning: [],
        holdingPeriod: null,
        loanPercent: null,
        vastu: null,
        apartmentConfiguration: null,
        preferredBuilderName: [],
        auctionIds: [],
        preLaunchIds: [],
        notes: null,
        showTruestate: true,
        fromTruestate: true,
        added: Date.now(),
        submit: false,
        status: "open",
      };
    } catch (error) {
      console.error("Error creating default requirement:", error);
      return null;
    }
  };

  // Memoized default requirement to prevent re-creation on every render
  const defaultRequirement = useMemo(
    () => createDefaultRequirement("req001"),
    []
  );

  // Fetch user requirements
  useEffect(() => {
    const loadRequirements = async () => {
      try {
        dispatch(showLoader());
        const result = await dispatch(fetchRequirements(userId)).unwrap();

        // Set active tab to the last requirement if we have any
        if (result && result.length > 0) {
          const lastRequirement = result[result.length - 1];
          setActiveTab(lastRequirement.id);
          dispatch(setActiveRequirement(lastRequirement.id));
        } else {
          // No requirements found, set active tab to default
          setActiveTab("req001");
          dispatch(setNextRequirementId("REQ001"));
        }
      } catch (error) {
        console.error("Error loading requirements:", error);
        addToast(
          "Load Failed",
          "error",
          "Failed to Load Requirements",
          "There was an error loading your requirements."
        );
      } finally {
        dispatch(hideLoader());
      }
    };

    if (userId) {
      loadRequirements();
    }
  }, [dispatch, userId]);

  // Initialize with default requirement if empty
  useEffect(() => {
    try {
      console.log("Requirements init useEffect:", {
        requirementsLength: requirements.length,
        userId,
        activeTab,
        localRequirement: !!localRequirement,
      });

      if (requirements.length === 0 && userId) {
        const initialRequirement = createDefaultRequirement("req001");
        console.log("Creating initial requirement:", initialRequirement);
        if (initialRequirement) {
          // Set local requirement for new form
          setLocalRequirement(initialRequirement);
          setActiveTab("req001");
          dispatch(setActiveRequirement("req001"));
        }
      } else if (
        requirements.length > 0 &&
        activeTab !== "req001" &&
        activeTab !== "req new"
      ) {
        // Clear local requirement when we have saved requirements and not creating a new one
        console.log("Clearing local requirement");
        setLocalRequirement(null);
      }
    } catch (error) {
      console.error("Error initializing requirements:", error);
    }
  }, [requirements.length, userId, dispatch, activeTab]);

  // Add new requirement
  const addRequirement = () => {
    try {
      const newId = "req new";
      const newRequirement = createDefaultRequirement(newId);

      // Set local requirement for the new form
      setLocalRequirement(newRequirement);
      setActiveTab(newId);
      dispatch(setActiveRequirement(newId));

      // Log analytics event
      try {
        logEvent(analytics, "click_add_requirement", {
          Name: "add__requirement",
        });
      } catch (analyticsError) {
        console.error("Error logging analytics event:", analyticsError);
      }
    } catch (error) {
      console.error("Error adding requirement:", error);
      addToast(
        "Add Failed",
        "error",
        "Failed to Add Requirement",
        "There was an error adding a new requirement."
      );
    }
  };

  // Delete requirement handler
  const deleteRequirementHandler = async (event, id) => {
    try {
      event.preventDefault();
      setDeleting(true);

      // Handle deletion of local requirement (new/unsaved)
      if (id === "req001" || id === "req new") {
        // Just clear the local requirement and reset to first saved requirement
        setLocalRequirement(null);
        if (requirements.length > 0) {
          setActiveTab(requirements[0].id);
          dispatch(setActiveRequirement(requirements[0].id));
        } else {
          // No saved requirements, create a new default one
          const newRequirement = createDefaultRequirement("req001");
          setLocalRequirement(newRequirement);
          setActiveTab("req001");
          dispatch(setActiveRequirement("req001"));
        }
        setDeleting(false);
        return;
      }

      // Show loading toast for saved requirement deletion
      const loadingToastId = addToast(
        "Processing",
        "loading",
        "Deleting Requirement"
      );

      // Handle deletion of saved requirement
      await dispatch(
        deleteRequirement({
          userId: userId,
          requirementId: `${id}`,
        })
      ).unwrap();

      // After successful deletion, set active tab to the last remaining requirement
      const remainingRequirements = requirements.filter((req) => req.id !== id);
      if (remainingRequirements.length > 0) {
        const lastRequirement =
          remainingRequirements[remainingRequirements.length - 1];
        setActiveTab(lastRequirement.id);
        dispatch(setActiveRequirement(lastRequirement.id));
      } else {
        // No saved requirements left, create a new default one
        const newRequirement = createDefaultRequirement("req001");
        setLocalRequirement(newRequirement);
        setActiveTab("req001");
        dispatch(setActiveRequirement("req001"));
      }

      // Update to success toast
      updateToast(loadingToastId, {
        type: "success",
        heading: "Requirement Deleted",
        description: "The requirement has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting requirement:", error);
      // Update loading toast to error
      if (loadingToastId) {
        updateToast(loadingToastId, {
          type: "error",
          heading: "Delete Failed",
          description:
            error.message || "There was an error deleting the requirement.",
        });
      } else {
        // Fallback
        addToast(
          "Delete Failed",
          "error",
          "Requirement Delete Failed",
          "There was an error deleting the requirement."
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  // Save requirements
  const saveRequirements = async (e, requirementData) => {
    let loadingToastId;
    try {
      e.preventDefault();

      // Use the passed requirement data or find the active requirement
      let currentRequirement = requirementData;
      if (!currentRequirement) {
        if (
          (activeTab === "req001" || activeTab === "req new") &&
          localRequirement
        ) {
          // This is a new requirement from local state
          currentRequirement = localRequirement;
        } else {
          currentRequirement = requirements.find((req) => req.id === activeTab);
        }
      }

      if (!currentRequirement) {
        console.error("No requirement data to save");
        return;
      }

      console.log("Saving requirement:", {
        activeTab,
        currentRequirement,
        userId,
      });

      // Show loading toast
      // loadingToastId = addToast("Processing", "loading", "Saving Requirement");

      await dispatch(
        saveRequirement({
          userId: userId,
          requirement: { ...currentRequirement },
        })
      ).unwrap();

      const taskDetails = {
        actionType: "call",
        agentId: "",
        agentName: "",
        completedTimestamp: 0,
        userId: userId,
        projectId: "",
        schedule: getUnixDateTimeOneDayLater(),
        status: "pending",
        taskName: "share-property",
        taskType: null,
        propertyType: "",
        notes: [],
        document: [],
        loanId: null,
        projectName: "",
      };

      await dispatch(addTask({ userId: userId, taskDetails })).unwrap();

      // Update to success toast
      // updateToast(loadingToastId, {
      //   type: "success",
      //   heading: "Requirement Saved",
      //   description: "Your requirement has been successfully saved.",
      // });

      // The Redux slice will automatically update the state
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error saving requirement:", error);
      // If we have a loading toast, update it to error
      if (loadingToastId) {
        // updateToast(loadingToastId, {
        //   type: "error",
        //   heading: "Save Failed",
        //   description:
        //     error.message || "There was an error saving your requirement.",
        // });
      } else {
        // Fallback to regular toast
        addToast(
          "Save Failed",
          "error",
          "Failed to Save Requirement",
          "There was an error saving your requirement."
        );
      }
    }
  };

  // Update requirement
  const updateRequirement = async (id, field, value, obj) => {
    let loadingToastId;
    try {
      // Check if this is a local requirement (not saved to Firestore yet)
      if ((id === "req001" || id === "req new") && localRequirement) {
        // Update local requirement state (no loading needed for local updates)
        setLocalRequirement((prev) => ({
          ...prev,
          [field]: value,
        }));
        return;
      }

      // For saved requirements, use Redux with optimistic updates
      if (requirements.find((req) => req.id === id)) {
        // Use optimistic update for immediate UI feedback
        dispatch(updateRequirementLocal({ id, changes: { [field]: value } }));

        // For significant updates, show loading toast
        const isSignificantUpdate = [
          "maxBudget",
          "minBudget",
          "areas",
          "productType",
        ].includes(field);

        if (isSignificantUpdate) {
          loadingToastId = addToast(
            "Processing",
            "loading",
            "Updating Requirement"
          );
        }

        // Update in Firestore
        await dispatch(
          updateRequirementField({
            userId,
            requirementId: id,
            field,
            value,
          })
        ).unwrap();

        // Show success toast for significant updates
        if (isSignificantUpdate && loadingToastId) {
          updateToast(loadingToastId, {
            type: "success",
            heading: "Requirement Updated",
            description: "Your requirement has been successfully updated.",
          });
        }
      }
    } catch (error) {
      console.error("Error updating requirement:", error);

      // Revert optimistic update
      dispatch(
        updateRequirementLocal({
          id,
          changes: {
            [field]: requirements.find((req) => req.id === id)?.[field],
          },
        })
      );

      if (loadingToastId) {
        updateToast(loadingToastId, {
          type: "error",
          heading: "Update Failed",
          description:
            error.message || "There was an error updating the requirement.",
        });
      } else {
        addToast(
          "Update Failed",
          "error",
          "Failed to Update Requirement",
          "There was an error updating the requirement."
        );
      }
    }
  };

  // Modal handlers
  const handleModalClose = () => {
    try {
      setIsModalOpen(false);
      setIsSubmitDisabled(false);
    } catch (error) {
      console.error("Error closing modal:", error);
    }
  };

  const handleDeleteModalClose = () => {
    try {
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error closing delete modal:", error);
    }
  };

  const handleModalContinue = async (e) => {
    let loadingToastId;
    try {
      setContinuing(true);

      // Show loading toast
      loadingToastId = addToast(
        "Processing",
        "loading",
        "Submitting Requirement"
      );

      await saveRequirements(e);

      // Update to success toast
      updateToast(loadingToastId, {
        type: "success",
        heading: "Success",
        description: "Your requirement has been successfully submitted.",
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error in modal continue:", error);

      if (loadingToastId) {
        updateToast(loadingToastId, {
          type: "error",
          heading: "Submit Failed",
          description:
            error.message ||
            "There was an error while trying to submit your requirement. Please check your internet connection and try again.",
        });
      } else {
        addToast(
          "Save Failed",
          "error",
          "Save Failed",
          "There was an error while trying to save your changes. Please check your internet connection and try again."
        );
      }
    } finally {
      setContinuing(false);
    }
  };

  const handleDeleteModalContinue = async (e) => {
    try {
      await deleteRequirementHandler(e, reqIdToDelete);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error in delete modal continue:", error);
    }
  };

  // Simulate a network request (replace this with your actual save logic)
  const simulateNetworkRequest = () => {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          if (navigator.onLine) {
            resolve("Success");
          } else {
            reject("Network error");
          }
        }, 1000);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Handle tab click
  const handleTabClick = (reqId) => {
    try {
      setActiveTab(reqId);
      dispatch(setActiveRequirement(reqId));
    } catch (error) {
      console.error("Error handling tab click:", error);
    }
  };

  return (
    <div className={`${styles.bkg} flex flex-col h-screen `}>
      <div>
        <div
          className={`${styles.tabs}  px-4 md:px-8 border-b-2 fixed bg-[#FAFAFA] w-[100vw] z-[9] overflow-x-auto `}
        >
          {requirements &&
            requirements.length > 0 &&
            requirements.map((req, index) => (
              <button
                key={req.id}
                className={`${
                  activeTab === req.id ? styles.tabButton : styles.tabButton2
                } pt-3 md:pt-4`}
                onClick={() => handleTabClick(req.id)}
              >
                <div
                  className={`pb-3 md:pb-4 text-nowrap ${
                    activeTab === req.id ? styles.activeTab : ""
                  } `}
                >
                  {`Requirement ${index + 1}`}
                </div>
              </button>
            ))}

          {/* Show tab for new requirement */}
          {localRequirement &&
            (activeTab === "req001" || activeTab === "req new") && (
              <button
                key={localRequirement.id}
                className={`${styles.tabButton} pt-3 md:pt-4`}
              >
                <div className={`pb-3 md:pb-4 text-nowrap ${styles.activeTab}`}>
                  {requirements.length === 0
                    ? "Requirement 1"
                    : `Requirement ${requirements.length + 1}`}
                </div>
              </button>
            )}
          {(() => {
            const shouldShow =
              !requirements ||
              requirements.length === 0 ||
              !requirements.some(
                (req) => req.id === "req001" || req.id === "req new"
              );
            console.log("Add button condition:", {
              requirements: requirements?.length,
              shouldShow,
              hasReq001: requirements?.some((req) => req.id === "req001"),
              hasReqNew: requirements?.some((req) => req.id === "req new"),
            });
            return shouldShow;
          })() && (
            <button
              className={`px-1 ${styles.tabButton2}`}
              onClick={addRequirement}
            >
              <div className={`flex px-3 py-1 ${styles.addButton}`}>
                <span>+</span>
                <span className="ml-2">Add</span>
                <span className="ml-1">Requirement</span>
              </div>
            </button>
          )}
        </div>
        <div className=" p-4 md:pt-6 md:pb-12 md:px-8 mt-8">
          {/* Render saved requirements */}
          {requirements &&
            requirements.length > 0 &&
            requirements.map((req) => (
              <RequirementForm
                key={req.id}
                isActive={activeTab === req.id}
                requirementId={req.id}
                requirement={req}
                updateRequirement={updateRequirement}
                onDelete={deleteRequirementHandler}
                setReqIdToDelete={setReqIdToDelete}
                saveRequirements={saveRequirements}
                setIsModalOpen={setIsModalOpen}
                setDeleteModalOpen={setDeleteModalOpen}
                isSubmitDisabled={isSubmitDisabled}
                setIsSubmitDisabled={setIsSubmitDisabled}
              />
            ))}

          {/* Render new requirement form when active */}
          {(() => {
            const shouldRenderForm =
              localRequirement &&
              (activeTab === "req001" || activeTab === "req new");
            console.log("Form render condition:", {
              localRequirement: !!localRequirement,
              activeTab,
              shouldRenderForm,
            });
            return shouldRenderForm;
          })() && (
            <RequirementForm
              key={localRequirement.id}
              isActive={true}
              requirementId={localRequirement.id}
              requirement={localRequirement}
              updateRequirement={updateRequirement}
              onDelete={deleteRequirementHandler}
              setReqIdToDelete={setReqIdToDelete}
              saveRequirements={saveRequirements}
              setIsModalOpen={setIsModalOpen}
              setDeleteModalOpen={setDeleteModalOpen}
              isSubmitDisabled={isSubmitDisabled}
              setIsSubmitDisabled={setIsSubmitDisabled}
            />
          )}
        </div>
      </div>

      <div>
        <RequirementSubmitAlert
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onContinue={handleModalContinue}
          continuing={continuing}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          onContinue={handleDeleteModalContinue}
          deleting={deleting}
        />
      </div>
    </div>
  );
};

export default Requirement;
