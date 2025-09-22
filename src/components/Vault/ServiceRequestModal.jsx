import React, { useEffect, useRef, useState } from "react";
import tick from "/assets/vault/icons/status/success.svg";
import close from "/assets/vault/icons/actions/close.svg";
import { raiseRequest } from "../../slices/apis/vault";
import { useDispatch, useSelector } from "react-redux";
import { selectUserPhoneNumber } from "../../slices/userAuthSlice";
import { fetchUserProfile } from "../../slices/userSlice";
import { toCapitalizedWords } from "../../utils/common";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import { 
  collection, 
  getDocs, 
  query, 
  where 
} from "firebase/firestore";
import { db } from "../../firebase";

const ServiceRequestModal = ({
  isOpen,
  onClose,
  service,
  properties,
  onSubmit,
}) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const userPhoneNumber = useSelector(selectUserPhoneNumber);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isConfirmationModalOpen2, setIsConfirmationModalOpen2] = useState(true);
  const [filteredProperties, setFilteredProperties] = useState([]);

  const { profile } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const raiseRequestRef = useRef(null);

  // Fetch profile data based on userPhoneNumber
  useEffect(() => {
    if (userPhoneNumber) {
      dispatch(fetchUserProfile(userPhoneNumber));
    }
  }, [dispatch, userPhoneNumber]);


  // useEffect(() => {
  //   if (profile && profile.tasks && service && properties) {

  //     // Get the tasks related to the current service
  //     const matchingServiceTasks = profile.tasks.filter(
  //       (task) => task.taskName === service
  //     );

  //     // Get the property IDs from the tasks
  //     const servicePropertyIds = matchingServiceTasks.map(
  //       (task) => task.projectId
  //     );

  //     // Filter out the properties that are already in the service task
  //     const updatedFilteredProperties = properties.filter(
  //       (property) => !servicePropertyIds.includes(property.id)
  //     );

  //     setFilteredProperties(updatedFilteredProperties);
  //   } else {
  //     setFilteredProperties(properties || []);
  //   }
  // }, [profile, properties, service]); 

//   useEffect(() => {
//   const filterPropertiesByTasks = async () => {
//     if (service && properties && userPhoneNumber) {
//       setLoading(true);
//       try {
//         // Map service titles to task names
//         const serviceToTaskMapping = {
//           "Khata Transfer": "khata-transfer",
//           "Sell Property": "sell-property", 
//           "Title Clearance": "title-clearance",
//           "Electricity Bill Transfer": "electricity-bill",
//           "Find Tenant": "find-tenant", // Note: "Find Tenants" maps to "find-tenant"
//           "Collect Rent": "rent-collection"
//         };
//         console.log("service",service)
//         const taskName = serviceToTaskMapping[service];

//         console.log("taskName", taskName);
//         // Query truEstateTasks collection for this service
//         const tasksCollectionRef = collection(db, "truEstateTasks");
//         const q = query(
//           tasksCollectionRef,
//           where("taskType", "==", "vault-service"),
//           where("taskName", "==", taskName),
//         );

//         const tasksSnapshot = await getDocs(q);
//         console.log("tasksSnapshot", tasksSnapshot);
        
//         // Get property IDs that already have this service requested
//         const servicePropertyIds = tasksSnapshot.docs.map(doc => doc.data().projectId);

//         // Filter out properties that already have this service requested
//         const updatedFilteredProperties = properties.filter(
//           (property) => !servicePropertyIds.includes(property.projectId)
//         );

//         setFilteredProperties(updatedFilteredProperties);
//       } catch (error) {
//         console.error("Error filtering properties by tasks:", error);
//         setFilteredProperties(properties || []);
//       }
//     } else {
//       setFilteredProperties(properties || []);
//     }
//   };

//   filterPropertiesByTasks();
// }, [service, properties, userPhoneNumber]);


  useEffect(() => {
    const filterPropertiesByTasks = async () => {
      if (service && properties && userPhoneNumber) {
        setLoading(true);
        try {
          // Map service titles to task names
          const serviceToTaskMapping = {
            "Khata Transfer": "khata-transfer",
            "Sell Property": "sell-property", 
            "Title Clearance": "title-clearance",
            "Electricity Bill Transfer": "electricity-bill",
            "Find Tenants": "find-tenant",
            "Find Tenant": "find-tenant", // Handle both variations
            "Collect Rent": "rent-collection"
          };

          const taskName = serviceToTaskMapping[service];

          if (taskName) {
            // Query truEstateTasks collection for this service
            if (taskName === "find-tenant" || taskName === "rent-collection") {
              setFilteredProperties(properties || []);
            } 

            else {

            const tasksCollectionRef = collection(db, "truEstateTasks");
            const q = query(
              tasksCollectionRef,
              where("taskType", "==", "vault-service"),
              where("taskName", "==", taskName),
              //where("userPhoneNumber", "==", userPhoneNumber)
            );

            const tasksSnapshot = await getDocs(q);
            
            // Get property IDs that already have this service requested
            const servicePropertyIds = tasksSnapshot.docs.map(doc => doc.data().projectId);

            // Filter out properties that already have this service requested
            const updatedFilteredProperties = properties.filter(
              (property) => !servicePropertyIds.includes(property.projectId)
            );

            setFilteredProperties(updatedFilteredProperties);
            }
          } else {
            setFilteredProperties(properties || []);
          }
        } catch (error) {
          console.error("Error filtering properties by tasks:", error);
          setFilteredProperties(properties || []);
        } finally {
          setLoading(false);
        }
      } else {
        setFilteredProperties(properties || []);
      }
    };

    filterPropertiesByTasks();
  }, [service, properties, userPhoneNumber]);

  // Log changes to filtered properties for debugging
  const handleClickOutside = (e) => {
    if (raiseRequestRef.current && !raiseRequestRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle the submission of the request
  const handleContinue = async () => {
    setLoading(true);

    const response = await raiseRequest(
      service,
      selectedProperty,
      userPhoneNumber
    );

    if (response.success) {
      setSelectedProperty(null);
      setIsConfirmationModalOpen2(false);
      setIsConfirmationModalOpen(true);
      dispatch(fetchUserProfile(userPhoneNumber));

      logEvent(analytics, "vault_service_request_raised_success", {
        name: service,
        property_name: selectedProperty.projectName,
      });
    } else {
      logEvent(analytics, "vault_service_request_raised_failed", {
        name: service,
        property_name: selectedProperty?.projectName || "N/A",
        error: response.message,
      });
    }
  };

  // Handle continue button click in confirmation modal
  const handleContinue2 = () => {
    setIsConfirmationModalOpen(false);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedProperty(null);
    setIsConfirmationModalOpen(false);
    setIsConfirmationModalOpen2(true);
    onClose();
  };

  useEffect(() => {
    setIsConfirmationModalOpen(false);
    setIsConfirmationModalOpen2(true);
  }, [service]);

  if (!isOpen) return null;

  return (
    <>
      {isConfirmationModalOpen2 && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div 
            className="bg-[#FAFAFA] w-full max-w-[448px] md:w-[448px] h-fit py-5 px-6 rounded-lg border ml-4 mr-4 border-gray-300" 
            ref={raiseRequestRef}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-montserrat font-bold text-[18px] text-[#0A0B0A]">
                {service}
              </h2>
              <img src={close} onClick={handleCloseModal} className="cursor-pointer" />
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#153E3B]"></div>
              </div>
            ) : (
              <>
                <p className="font-montserrat font-semibold text-[14px] leading-[21px] tracking-[0.25px] mb-3">
                  {filteredProperties.length > 0
                    ? "Please select a property"
                    : "No Property Available"}
                </p>
                
                <div className="grid grid-cols-1 mb-5">
                  {filteredProperties.map((property, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-[10px] p-[12px] border border-gray-300 md:w-[400px] h-[45px] rounded-md mb-3 cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="property"
                        value={property.projectName}
                        checked={selectedProperty?.projectName === property?.projectName}
                        onChange={() => setSelectedProperty(property)}
                        className="w-5 h-5 border border-gray-400 checked:bg-[#153E3B] checked:border-none"
                      />
                      <span className="font-lato font-medium text-[14px] leading-[21px] text-[#0A0B0A]">
                        {toCapitalizedWords(property.projectName)}
                      </span>
                    </label>
                  ))}
                </div>
                
                <button
                  className={`w-full md:w-[400px] px-[32px] py-[8px] ${
                    filteredProperties.length > 0 && selectedProperty && !loading
                      ? "bg-[#153E3B] text-[#FAFBFC]" 
                      : "bg-[#CCCBCB] text-[#5A5555]"
                  } rounded-[4px] text-center font-lato text-[14px] font-medium leading-[21px]`}
                  onClick={() => {
                    handleContinue();
                    logEvent(analytics, "click_inside_vault_raise_request", { Name: "raise_request" });
                  }}
                  disabled={!selectedProperty || loading || filteredProperties.length === 0}
                >
                  {loading ? "Raising Request..." : "Raise Request"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {isConfirmationModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-[#FAFAFA]  w-full max-w-[344px] md:w-[344px] ml-4 mr-4 h-auto p-[16px] px-[24px] rounded-lg border border-transparent">
            <div className="flex flex-col justify-between mb-6">
              <img
                src={tick}
                className="w-[24px] h-[24px] p-[2px] mb-3"
                alt="tick"
              />
              <h2 className="font-montserrat font-bold text-[16px] leading-[24px] tracking-[0.25px] mb-[6px]">
                Request Raised successfully for {service}
              </h2>
              <p className="font-lato text-[14px] leading-[21px] text-[#433F3E] font-medium">
                {/* After deleting the form you will not be able to recover it. */}
                You will hear from us shortly.
              </p>
            </div>
            <button
              className=" w-full h-[37px] px-[24px] py-[8px] font-lato font-semibold text-[14px] leading-[21px] bg-[#153E3B] text-[#FAFBFC] rounded-md"
              onClick={handleContinue2}
            >
              Back to Vault
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceRequestModal;
