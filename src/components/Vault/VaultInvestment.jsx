import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ElectricityBill from "/assets/icons/features/electricity-bill.svg";
import house from "/assets/icons/ui/house.svg";
import KahataTransfer from "/assets/icons/features/kahata-transfer.svg";
import SellProperty from "/assets/icons/ui/money-bag.svg";
import TitleClearence from "/assets/icons/features/title-clearance.svg";
import Wallet from "/assets/icons/ui/wallet.svg";
import MyBreadcrumb from "../BreadCrumbs/Breadcrumb.jsx";
import Overview from "../ProjectDetails/Overview";
import styles from "./Vaultinvestment.module.css";

import { logEvent } from "firebase/analytics";
import {
  arrayUnion,
  collection,
  doc,
  getDoc, 
  getDocs,
  query,
  updateDoc,
  setDoc,
  where,
} from "firebase/firestore";
import tick from "/assets/vault/icons/status/success.svg";
import close from "/assets/vault/icons/actions/close.svg";
import { analytics, db } from "../../firebase.js";
import { fetchUserProfile } from "../../slices/userSlice.js";
import Draganddrop from "./Drag-and-drop.jsx";
import downloadsvg from "/assets/icons/actions/btn-download.svg";
// import pdfsvg from "/icons-1/PDF.svg"; // File no longer exists
import trashes from "/assets/icons/actions/btn-delete.svg";
import { getStorage, deleteObject, ref } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { selectUserPhoneNumber } from "../../slices/userAuthSlice.js";
// helper functions
import {
  getUnixDateTime,
  getUnixDateTimeOneDayLater,
} from "../helper/dateTimeHelpers.js";

// Import necessary icons
import { v4 as uuidv4 } from "uuid";
import ElectricityBillTransfer from "/assets/icons/features/electricity-bill.svg";
import FindTenant from "/assets/icons/ui/house.svg";
import CollectRent from "/assets/icons/ui/wallet.svg";
import { useToast } from "../../hooks/useToast.jsx";
import {
  getVaultDataByFormId,
  handleVaultDocumentUpload,
  raiseRequest,
} from "../../slices/apis/vault.js";
import { formatCostSuffix, toCapitalizedWords } from "../../utils/common.js";
import { showLoader, hideLoader, selectLoader } from "../../slices/loaderSlice";
import InvestmentOverviewVault from "./InvestmentOverviewVault.jsx";
import { storage } from "../../firebase.js";

import ConfirmationModal from "./ConfirmationModal.jsx";

// Assuming these components are already implemented

const holding = [
  {
    name: "Adarsh welkin park",
    type: "Apartment",
    size: "1830",
    config: "2 BHK",
    truEstimate: "₹00.00 Crs",
    investment: "₹00.00 Crs",
    totalReturn: "₹00.00 Crs",
    returnPercent: "15",
  },
];

const VaultInvestment = ({ data }) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { holdingName } = params;
  const formId = location.state?.formId;
  const dispatch = useDispatch();
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState({
    doc: null,
    index: null,
  });

  const [project, setProject] = useState({
    id: "100_TREES",
    LandCost: 90000000,
    reg_no: "PRM/KA/RERA/1251/309/PR/180627/001939",
    ProjectStatus: "New Project Launch",
    promoter_name: "ADHISHREE VENTURES INDIA PVT LTD",
    open_area: 2267,
    project_name: "100 TREES",
    total_area: 4248,
    district: "BENGALURU URBAN",
    ProjectCost: 320000000,
    ApprovingAuth: "BBMP - Bruhat Bengaluru Mahanagara Palike",
    ack_no: "PR/KN/171223/002565",
    ProjectStartDate: "2017-01-12 00:00:00",
    "internal Id": 11716,
    approved_on: "27-06-2018",
    proposed_completion_date: "2021-01-09 00:00:00",
    covid_extension_date: "01-12-2020 - 01-09-2021",
    status: "APPROVED",
  });
  const isReport = false;

  const services = [
    { title: "Khata Transfer", icon: KahataTransfer },
    { title: "Sell Property", icon: SellProperty },
    { title: "Title Clearance", icon: TitleClearence },
    { title: "Electricity Bill Transfer", icon: ElectricityBill },
    { title: "Find Tenant", icon: house },
    { title: "Collect Rent", icon: Wallet },
  ];

  const [clickedServices, setClickedServices] = useState([]);
  const [isConfirmationModalOpen2, setIsConfirmationModalOpen2] =
    useState(false);

  const handleButtonClick = (serviceTitle) => {
    // Add clicked service to the list and mark it as "Not Discussed"
    logEvent(analytics, "vault_service_button_click", { name: serviceTitle });

    if (
      !clickedServices.map((services) => services?.name).includes(serviceTitle)
    ) {
      setClickedServices((prev) => [
        ...prev,
        { name: serviceTitle, status: "pending" },
      ]);
      handleRaiseRequest(serviceTitle);
      setIsRequestConfirmationOpen(true);
    } else {
      addToast("Dummy", "error", "Service already requested for this property");
    }
    setSelectedService(null);
  };

  const [serviceTitle2, setServiceTitle2] = useState(null);

  const handleRaiseRequestPropertyPage = (serviceTitle) => {
    setServiceTitle2(serviceTitle);
    setIsConfirmationModalOpen2(true);
  };

  const handleRaiseRequestPropertyPage2 = (serviceTitle) => {
    logEvent(analytics, "vault_service_button_click", { name: serviceTitle });
    setIsConfirmationModalOpen2(false);
    if (
      !clickedServices.map((services) => services?.name).includes(serviceTitle)
    ) {
      setClickedServices((prev) => [
        ...prev,
        { name: serviceTitle, status: "pending" },
      ]);
      handleRaiseRequest(serviceTitle);
    } else {
      addToast("Dummy", "error", "Service already requested for this property");
    }
    setSelectedService(null);
  };

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const loading = useSelector(selectLoader);
  const [loadingDocument, setLoadingDocument] = useState(false);

  const [document, setDocument] = useState(null);
  const [documents, setDocuments] = useState(null);

  const [investmentOverviewData, setInvestmentOverviewData] = useState([]);
  const [assetOverviewData, setAssetOverviewData] = useState([]);
  const [projectOverviewData, setProjectOverviewData] = useState([]);

  const { addToast } = useToast();
  const [project1, setProject1] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // const documents = ["MasterPlan", "Brochure"];

  const userPhoneNumber = useSelector(selectUserPhoneNumber);
  const { profile } = useSelector((state) => state.user);

  useEffect(() => {
    const GetVaultDataByFormId = async () => {
      dispatch(hideLoader());
      const response = await getVaultDataByFormId(formId);

      if (response.success) {

        const vaultData = response.finalCombinedData;
        //console.log('vault data', vaultData)
        setProject1(vaultData);
        console.log(vaultData?.documents);
        setDocuments(
          vaultData?.documents ? [...vaultData?.documents].reverse() : []
        );

        let truEstimate;
        truEstimate = vaultData?.truestimatedFullPrice;

        const totalReturns = truEstimate - vaultData?.purchaseAmount;
        const returnPer =
          totalReturns && vaultData?.purchaseAmount
            ? parseInt((totalReturns / vaultData?.purchaseAmount) * 100)
            : null;

        const holdingPeriod =
          new Date().getFullYear() - vaultData.yearOfPurchase;
        const cagr = (
          (Math.pow(
            vaultData?.truestimatedFullPrice / vaultData?.purchaseAmount,
            1 / holdingPeriod
          ) -
            1) *
          100
        ).toFixed(2);

        setInvestmentOverviewData([
          {
            label: "Amount Invested",
            value: formatCostSuffix(vaultData?.purchaseAmount),
          },
          {
            label: "Current Value",
            value: formatCostSuffix(truEstimate),
          },
          {
            label: "CAGR",
            value: `${cagr} %`,
          },
        ]);
      } else {
        addToast("Dummy", "error", "Something went wrong");
        navigate("/vault/investment");
        dispatch(hideLoader());
      }
    };
   
    dispatch(showLoader());
    GetVaultDataByFormId();
  }, [formId]);

  useEffect(() => {
    if (project1) {
      const assetType = project1.assetType;

      const projectData = [];

      if (project1.purchaseAmount) {
        projectData.push({
          label: "Purchased Price",
          value: "₹" + formatToIndianSystem(project1.purchaseAmount) || 0,
        });
      }
      if (project1.purchaseAmount) {
        if (assetType === "plot" && project1?.plotArea) {
          const area = project1?.plotArea;
          projectData.push({
            label: "Purchased Price / Sq ft",
            value:
              "₹" +
                formatToIndianSystem(parseInt(project1.purchaseAmount / area)) +
                "/ Sq ft" || 0,
          });
        } else if (
          (assetType === "apartment" || assetType === "villa") &&
          project1.sbua
        ) {
          projectData.push({
            label: "Purchased Price / Sq ft",
            value:
              "₹" +
                formatToIndianSystem(
                  parseInt(project1.purchaseAmount / project1.sbua)
                ) +
                "/ Sq ft" || 0,
          });
        }
      }
      if (project1.yearOfPurchase) {
        projectData.push({
          label: "Holding Period",
          value:
            new Date().getFullYear() - project1.yearOfPurchase + " Years" || 0,
        });
      }
      if (project1.truestimatedFullPrice) {
        projectData.push({
          label: "TruEstimate",
          value:
            "₹" +
              formatToIndianSystem(parseInt(project1.truestimatedFullPrice)) ||
            0,
        });
      }
      projectData.push({
        label: "Type",
        value: toCapitalizedWords(assetType),
      });
      if (
        (assetType === "apartment" || assetType === "villa") &&
        project1.configuration
      ) {
        projectData.push({
          label: "Configuration",
          value: project1.configuration,
        });
      }
      if (
        (assetType === "apartment" || assetType === "villa") &&
        project1.sbua
      ) {
        projectData.push({
          label: "Super built up area",
          value: project1.sbua + " Sq ft" || 0,
        });
      } else if (assetType === "plot" && project1?.plotArea) {
        const area = project1?.plotArea;
        projectData.push({
          label: "Land Size",
          value: area + " Sq ft" || 0,
        });
      }
      if (project1.directionOfEntrance) {
        projectData.push({
          label: "Facing",
          value: project1.directionOfEntrance || 0,
        });
      }
      if (project1.unitNo) {
        projectData.push({
          label: "Unit No.",
          value: project1.unitNo || 0,
        });
      }
      if (assetType === "apartment" && project1.floor) {
        projectData.push({
          label: "Floor",
          value: project1.floor || 0,
        });
      }
      if (project1.cornerUnit) {
        projectData.push({
          label: "Corner Unit",
          value: project1.cornerUnit,
        });
      }
      if (project1.yearOfPurchase) {
        projectData.push({
          label: "Purchased on",
          value: project1.yearOfPurchase || 0,
        });
      }

      setAssetOverviewData(projectData);
    }
  }, [project1]);

  useEffect(() => {
    if (userPhoneNumber) {
      dispatch(fetchUserProfile(userPhoneNumber));
    }
  }, [dispatch, userPhoneNumber]);

  useEffect(() => {
    if (!formId || formId.trim() === "") navigate("/vault/investment");
  }, [formId]);

  useEffect(() => {
  const fetchTaskStatus = async () => {
    if (project1?.projectId && userPhoneNumber) {
      try {
        // Query truEstateTasks collection for vault-service tasks
        const tasksCollectionRef = collection(db, "truEstateTasks");
        const q = query(
          tasksCollectionRef,
          where("taskType", "==", "vault-service"),
          where("projectId", "==", project1.projectId),
          //where("userPhoneNumber", "==", userPhoneNumber)
        );

        const tasksSnapshot = await getDocs(q);
        
        // Map task names back to service titles
        const taskToServiceMapping = {
          "khata-transfer": "Khata Transfer",
          "sell-property": "Sell Property",
          "title-clearance": "Title Clearance", 
          "electricity-bill": "Electricity Bill Transfer",
          "find-tenant": "Find Tenant",
          "rent-collection": "Collect Rent"
        };

        const vaultTasks = tasksSnapshot.docs.map((doc) => {
          const task = doc.data();
          return {
            name: taskToServiceMapping[task.taskName] || task.taskName,
            status: task.status === "pending" ? "pending" : "completed",
          };
        });

        setClickedServices(vaultTasks);
      } catch (error) {
        console.error("Error fetching task status:", error);
      }
    }
  };

  fetchTaskStatus();
}, [project1?.projectId, userPhoneNumber]);

  // useEffect(() => {
  //   if (profile.tasks && project1?.id) {
  //     // Ensure project1 and its id are available

  //     const serviceTitles = services.map((service) => service.title);
  //     const vaultTasks = profile.tasks
  //       .filter(
  //         (task) =>
  //           task.type === "Vault" &&
  //           serviceTitles.includes(task.taskName) &&
  //           task.projectId === project1.id // Check if projectId matches project1.id
  //       )
  //       .map((task) => ({
  //         name: task.taskName,
  //         status:
  //           task.formType && task.formType === "Not Discussed"
  //             ? "Pending"
  //             : task.formType,
  //       }));

  //     setClickedServices(vaultTasks);
  //   }
  // }, [profile.tasks, project1?.id]); 

  const formatToIndianSystem = (number) => {
    const numStr = number.toString();
    const lastThreeDigits = numStr.slice(-3); // Extract the last three digits
    const otherDigits = numStr.slice(0, -3); // Extract the rest of the digits

    if (otherDigits !== "") {
      return (
        otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
        "," +
        lastThreeDigits
      );
    } else {
      return lastThreeDigits;
    }
  };

  const openServiceModal = () => {
    setIsServiceModalOpen(true);
  };

  const handleServiceSelection = (service) => {
    setSelectedService(service);
  };

  const handleRaiseRequest = async (service) => {
  setIsServiceModalOpen(false);

  try {
    const result = await raiseRequest(service, project1, userPhoneNumber);
    
    if (result.success) {
      addToast("Update Successful", "success", `Scheduled for ${service}`);
    } else {
      addToast("Error", "error", result.message);
    }
  } catch (error) {
    console.error("Error in handleRaiseRequest:", error);
    addToast("Error", "error", error.message);
  }
};

//   const handleRaiseRequest = async (service) => {
//   setIsServiceModalOpen(false);

//   try {
//     // Map service titles to task names
    
//     const serviceToTaskMapping = {
//       "Khata Transfer": "khata-transfer",
//       "Sell Property": "sell-property", 
//       "Title Clearance": "title-clearance",
//       "Electricity Bill Transfer": "electricity-bill",
//       "Find Tenant": "find-tenant",
//       "Collect Rent": "rent-collection"
//     };

//     // Generate task ID
//     const tasksCollectionRef = collection(db, "truEstateTasks");
//     const tasksSnapshot = await getDocs(tasksCollectionRef);
//     const taskCount = tasksSnapshot.size || 0;

//     let nextTaskId = '1';
//     if (taskCount >= 1000) {
//       nextTaskId = `task${taskCount + 1}`;
//     } else {
//       nextTaskId = `task${(taskCount + 1).toString().padStart(3, '0')}`;
//     }

//     if (!nextTaskId) {
//       throw new Error("Failed to generate task ID");
//     }

//     // Find user document
//     const usersCollectionRef = collection(db, "truEstateUsers");
//     const q = query(
//       usersCollectionRef,
//       where("phoneNumber", "==", userPhoneNumber)
//     );

//     const querySnapshot = await getDocs(q);
//     if (querySnapshot.empty) {
//       throw new Error("User not found");
//     }

//     const userDoc = querySnapshot.docs[0];
//     const userId = userDoc.id;

//     // Create task object
//     const task = {
//       taskId: nextTaskId, 
//       projectName: project1.projectName,
//       actionType: "Call",
//       agentId: "TRUES03", 
//       agentName: "amit",
//       //formType: "Not Discussed",
//       createdTimestamp: getUnixDateTime(),
//       schedule: getUnixDateTimeOneDayLater(),
//       status: "pending",
//       taskType: "vault-service",
//       propertyType: "preLaunch",
//       taskName: serviceToTaskMapping[service] || service.toLowerCase().replace(/\s+/g, '-'),
//       userId: userId,
//       userPhoneNumber: userPhoneNumber,
//       projectId: project1.projectId
//     };

//     // Save task to truEstateTasks collection
//     const taskRef = doc(db, "truEstateTasks", nextTaskId);
//     await setDoc(taskRef, task);

//     // Call toast with correct success message
//     addToast("Update Successful", "success", `Scheduled for ${service}`);
//   } catch (error) {
//     console.error("Error in handleRaiseRequest:", error);
//     // Display toast with error message
//     addToast("Error", "error", error.message);
//     return { success: false, message: error.message };
//   }
// };
  // const handleRaiseRequest = async (service) => {
  //   setIsServiceModalOpen(false);
  //   setIsConfirmationModalOpen(true);
  //   // services
  //   const task = {
  //     actionType: "Call",
  //     agent: "srikanth@truestate.in",
  //     formType: "Not Discussed",
  //     type: "Vault",
  //     objectID: uuidv4(),
  //     taskName: service,
  //     reportUrl: `${window.location.origin}/vault/investment/${encodeURIComponent(project1.projectName)}`,
  //     projectId: project1.id,
  //     projectName: project1.projectName,
  //     vaultFormId: formId,
  //     timestamp: getUnixDateTime(),
  //     schedule: getUnixDateTimeOneDayLater(),
  //   };

  //   try {
  //     const usersCollectionRef = collection(db, "truEstateUsers");
  //     const q = query(
  //       usersCollectionRef,
  //       where("phoneNumber", "==", userPhoneNumber)
  //     );

  //     const querySnapshot = await getDocs(q);
  //     if (querySnapshot.empty) {
  //       throw new Error("User not found");
  //     }
  //     const userDocRef = querySnapshot.docs[0].ref;

  //     await updateDoc(userDocRef, {
  //       tasks: arrayUnion(task),
  //     });

  //     // console.log(task);

  //     const docRef = doc(collection(db, "vaultForms"), formId);
  //     let updatedData = {};
  //     updatedData[`${service}`] = true;

  //     await updateDoc(docRef, updatedData);

  //     // Call toast with correct success message
  //     addToast("Update Successful", "success", `Scheduled for ${service}`);
  //   } catch (error) {
  //     // Display toast with error message
  //     addToast("Error", "error", error.message);

  //     return { success: false, message: error.message };
  //   }

  //   const response = await raiseRequest(service || selectedService, formId);
  //   if (response.success) {
  //     setIsConfirmationModalOpen(true);
  //   } else {
  //   }
  // };

  const handleContinue = () => {
    setIsConfirmationModalOpen(false);
    // You can add further logic after the final confirmation
  };

  const handleUpload = async (doc) => {
    setLoadingDocument(true);
    const response = await handleVaultDocumentUpload(doc, formId,profile);
    if (response.success) {
      setDocument(null);
      setDocuments((prev) => [
        {
          name: doc?.name,
          downloadURL: response?.downloadURL,
          path: response?.path,
        },
        ...prev,
      ]);
      setLoadingDocument(false);
      addToast("Dummy", "success", response.message);
    } else {
      setLoadingDocument(false);
      addToast("Dummy", "error", response.message);
    }
  };

  const handleDelete = async (document, index) => {
  try {
    setDeleting(true);

    // ✅ Delete from Firebase Storage
    const storage = getStorage();
    const fileRef = ref(storage, document.path);
    await deleteObject(fileRef);

    // ✅ Delete from Firestore (remove doc object from unit.documents[])
    const userRef = doc(db, "truEstateUsers", profile.id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    const userData = userSnap.data();
    const updatedUnits = userData.units.map((unit) => {
      if (unit.unitId === formId) {
        return {
          ...unit,
          documents: (unit.documents || []).filter(
            (d) => d.path !== document.path // remove matching document
          ),
        };
      }
      return unit;
    });

    await updateDoc(userRef, { units: updatedUnits });

    // ✅ Update local state
    setDocuments((prev) => prev.filter((_, i) => i !== index));

    addToast("Dummy", "success", "File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
    addToast("Dummy", "error", "Failed to delete file");
  } finally {
    setshowDeleteModal(false);
    setDeleting(false);
  }
};


  const handleStatusColour = (status) => {
    if (status === "pending") {
      return "#FBDD97";
    } else if (status === "In Progress") {
      return "#FCE9BA";
    } else if (status === "completed") {
      return "#91F3BF";
    } else if (status === "Not Solved") {
      return "#F9ABB9";
    } else {
      return "";
    }
  };

  return (
    <>
      {isConfirmationModalOpen2 && (
        <>
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-[#FAFAFA] w-full max-w-[344px] md:w-[344px] ml-4 mr-4 h-auto p-[16px] px-[24px] rounded-lg border border-transparent">
              <div className="flex flex-col justify-between mb-6">
                <img
                  src={tick}
                  className="w-[24px] h-[24px] p-[2px] mb-3"
                  alt="tick"
                />
                <h2 className="font-montserrat font-bold text-[16px] leading-[24px] tracking-[0.25px] mb-[6px]">
                  You're raising a request for {serviceTitle2}
                </h2>
                <p className="font-lato text-[14px] leading-[21px] text-[#433F3E] font-medium">
                  We'll contact you for more details.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="w-full h-[37px] px-[24px] py-[8px] font-lato font-semibold text-[14px] leading-[21px] bg-[#FAFAFA] border-[1px] border-[#153E3B] text-black rounded-md"
                  onClick={() => setIsConfirmationModalOpen2(false)}
                >
                  Go Back
                </button>
                <button
                  className="w-full h-[37px] px-[24px] py-[8px] font-lato font-semibold text-[14px] leading-[21px] bg-[#153E3B] text-white rounded-md"
                  onClick={() => handleRaiseRequestPropertyPage2(serviceTitle2)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
        <>
          <div className="flex    px-4 md:px-8 ">
            <div className="  w-full lg:w-[60%] ">
              <div className=" mt-3 mb-3  ">
                <MyBreadcrumb />
              </div>
              <div className="mt-3 mb-8">
                <p
                  className={`  font-montserrat text-[1.375rem] font-bold text-[#0A0B0A] leading-[150%] mb-1`}
                >
                  {toCapitalizedWords(project1?.projectName)}
                </p>
                {project1?.lastUpdated && (
                  <p
                    className={`  font-lato text-[1rem] font-semibold text-[#5A5555] leading-[150%] mb-6`}
                  >
                    Updated on{" "}
                    <span className="ml-1">{project1.lastUpdated}</span>
                  </p>
                )}
              </div>

              <InvestmentOverviewVault
                data={investmentOverviewData}
                isReport={isReport}
                headingSize={"text-[1.4rem]"}
              />

              <hr style={{ borderTop: "solid 1px #E3E3E3" }} />

              <div className=" mb-4 ">
                <Overview
                  title="Asset Overview"
                  details={assetOverviewData || []}
                  project={project}
                  isReport={isReport}
                />
              </div>

              <hr style={{ borderTop: "solid 1px #E3E3E3" }} />

              {projectOverviewData && projectOverviewData.length > 0 && (
                <div className=" mb-4">
                  <Overview
                    title="Project Overview"
                    details={data.projectOverview}
                    project={project}
                    isReport={isReport}
                  />
                </div>
              )}
              <hr style={{ borderTop: "solid 1px #E3E3E3" }} />

              <div className="flex flex-col rounded  mt-9 mb-9 lg:mt-12 lg:mb-12 ">
                <div>
                  <h2
                    className={`font-montserrat text-[1.375rem] font-bold text-[#0A0B0A] leading-[150%] mb-2 mt-4`}
                  >
                    Documents
                  </h2>
                  <Draganddrop
                    file={document}
                    setFile={setDocument}
                    loadingDocument={loadingDocument}
                    handleUpload={handleUpload}
                  />
                </div>
                {/* {console.log(documents)} */}
                {documents &&
                  documents.length > 0 &&
                  documents.map((doc, index) => (
                    <button
                      key={index}
                      className="w-full text-left py-4 px-4 border mt-4 rounded hover:bg-gray-100 flex justify-between items-center "
                    >
                      <span className="flex">
                        {/* <img src={pdfsvg} className="mr-2" alt="" /> */}
                        <p
                          className={`font-lato text-[0.875rem] font-medium text-[#0A0B0A]  min-w-[300px] md:w-full `}
                        >
                          {toCapitalizedWords(doc?.name)}
                        </p>
                      </span>
                      <div className=" flex gap-4">
                        <img
                          onClick={() => window.open(doc?.downloadURL)}
                          src={downloadsvg}
                          alt=""
                        />

                        <img
                          onClick={() => {
                            setDocumentToDelete({ doc, index });
                            setshowDeleteModal(true);
                          }}
                          src={trashes}
                          alt=""
                        />
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            <div className=" ml-auto hidden lg:block  lg:w-[35%]">
              <div className="border border-gray-300 rounded-lg mt-20 p-4">
                <h3 className={` ${styles.h1} mb-3`}>
                  {" "}
                  Services Available For This Property
                </h3>

                <div className="flex flex-wrap gap-2 mb-6">
                  {services.map((service, index) => {
                    const isServiceClicked = clickedServices.some(
                      (clickedService) => clickedService.name === service.title
                    );

                    return (
                      <button
                        key={index}
                        onClick={async () => {
                          if (!isServiceClicked) {
                            handleRaiseRequestPropertyPage(service.title);
                          }
                        }}
                        className={`rounded px-6 py-2 flex items-center gap-2 hover:bg-gray-100 transition border border-gray-300   ${
                          isServiceClicked
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }`}
                      >
                        <img
                          src={service.icon}
                          alt={service.title}
                          className="w-4 h-4"
                        />
                        <span className={`${styles.h3}`}>{service.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Render Requests Section */}
                <h4 className="text-[#0A0B0A] font-montserrat text-[0.875rem] font-semibold leading-[150%]">
                  Requests ({clickedServices.length})
                </h4>
                <div>
                  {clickedServices.length > 0 ? (
                    clickedServices.map((service, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2"
                      >
                        <span className="text-[#0A0B0A] font-lato text-[1rem] font-medium leading-[150%]">
                          {service.name}
                        </span>
                        <span
                          className="font-lato text-[12px] leading-[18px] font-semibold text-[#2B2928] text-xs px-3 py-1 rounded-[14px]"
                          style={{
                            backgroundColor: handleStatusColour(service.status),
                          }}
                        >
                          {service.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No requests yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className=" bg-[#FAFAFA] border-t-2  lg:hidden sticky bottom-0 left-0 w-full">
            <div className="flex  justify-between px-4 py-3">
              <button className="font-montserrat text-[1rem] font-bold text-[#0A0B0A] leading-[150%] ">
                Need Help ?
              </button>
              <button
                className="px-4 py-2 bg-[#153E3B] font-lato text-[0.875rem] font-semibold leading-[150%]  text-white rounded"
                onClick={openServiceModal}
              >
                Raise Request
              </button>
            </div>

            {/* Service Selection Modal */}
            {isServiceModalOpen && (
              <div className="fixed  inset-0 z-50 flex justify-center  items-center  bg-black bg-opacity-50">
                <div className=" w-full bg-[#FAFAFA] h-auto p-[20px] px-[24px]  rounded-lg border  ">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-5  ">
                    <h2 className="font-montserrat font-bold text-[18px] leading-[27px] text-left">
                      Request Service
                    </h2>
                    <img
                      className="w-8 h-8"
                      src={close}
                      onClick={() => {
                        setIsServiceModalOpen(false);
                        setSelectedService(null);
                      }}
                    ></img>
                  </div>

                  {/* Subheading */}
                  <p className="font-montserrat font-semibold text-[14px] leading-[21px] tracking-[0.25px] text-left mb-5 ">
                    Please select a service
                  </p>

                  {/* Radio button group */}
                  <div className="grid grid-cols-1 gap-[12px] ">
                    {/* Khata Transfer */}
                    <label
                      className={`flex items-center justify-between w-full h-[45px] p-[12px] border-t border-l-0 border-r-0 border-b-0 ${
                        selectedService === "Khata Transfer"
                          ? "bg-gray-200"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="service"
                          checked={selectedService === "Khata Transfer"}
                          onChange={() =>
                            handleServiceSelection("Khata Transfer")
                          }
                        />
                        {/* Service Name - Styled with Lato */}
                        <span className="font-lato font-semibold text-[14px] leading-[21px] text-[#153E3B] text-left">
                          Khata Transfer
                        </span>
                      </div>
                      <img
                        src={KahataTransfer}
                        alt="Khata Transfer"
                        className="w-5"
                      />
                    </label>

                    {/* Sell Property */}
                    <label
                      className={`flex items-center justify-between w-full h-[45px] p-[12px] border-t border-l-0 border-r-0 border-b-0 ${
                        selectedService === "Sell Property" ? "bg-gray-200" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="service"
                          checked={selectedService === "Sell Property"}
                          onChange={() =>
                            handleServiceSelection("Sell Property")
                          }
                        />
                        <span className="font-lato font-semibold text-[14px] leading-[21px] text-[#153E3B] text-left">
                          Sell Property
                        </span>
                      </div>
                      <img
                        src={SellProperty}
                        alt="Sell Property"
                        className="w-5"
                      />
                    </label>

                    {/* Title Clearance */}
                    <label
                      className={`flex items-center justify-between w-full h-[45px] p-[12px] border-t border-l-0 border-r-0 border-b-0 ${
                        selectedService === "Title Clearance"
                          ? "bg-gray-200"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="service"
                          checked={selectedService === "Title Clearance"}
                          onChange={() =>
                            handleServiceSelection("Title Clearance")
                          }
                        />
                        <span className="font-lato font-semibold text-[14px] leading-[21px] text-[#153E3B] text-left">
                          Title Clearance
                        </span>
                      </div>
                      <img
                        src={TitleClearence}
                        alt="Title Clearance"
                        className="w-5"
                      />
                    </label>

                    {/* Find Tenant */}
                    <label
                      className={`flex items-center justify-between w-full h-[45px] p-[12px] border-t border-l-0 border-r-0 border-b-0 ${
                        selectedService === "Find Tenant" ? "bg-gray-200" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="service"
                          checked={selectedService === "Find Tenant"}
                          onChange={() => handleServiceSelection("Find Tenant")}
                        />
                        <span className="font-lato font-semibold text-[14px] leading-[21px] text-[#153E3B] text-left">
                          Find Tenant
                        </span>
                      </div>
                      <img src={FindTenant} alt="Find Tenant" className="w-5" />
                    </label>

                    {/* Collect Rent */}
                    <label
                      className={`flex items-center justify-between w-full h-[45px] p-[12px] border-t border-l-0 border-r-0 border-b-0 ${
                        selectedService === "Collect Rent" ? "bg-gray-200" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="service"
                          checked={selectedService === "Collect Rent"}
                          onChange={() =>
                            handleServiceSelection("Collect Rent")
                          }
                        />
                        <span className="font-lato font-semibold text-[14px] leading-[21px] text-[#153E3B] text-left">
                          Collect Rent
                        </span>
                      </div>
                      <img
                        src={CollectRent}
                        alt="Collect Rent"
                        className="w-5"
                      />
                    </label>

                    <label
                      className={`flex items-center justify-between w-full h-[45px] p-[12px] border-t border-l-0 border-r-0 border-b-0 ${
                        selectedService === "Electricity Bill Transfer"
                          ? "bg-gray-200"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="service"
                          checked={
                            selectedService === "Electricity Bill Transfer"
                          }
                          onChange={() =>
                            handleServiceSelection("Electricity Bill Transfer")
                          }
                        />
                        <span className="font-lato font-semibold text-[14px] leading-[21px] text-[#153E3B] text-left">
                          Electricity Bill Transfer
                        </span>
                      </div>
                      <img
                        src={ElectricityBillTransfer}
                        alt="Electricity Bill Transfer"
                        className="w-5"
                      />
                    </label>
                  </div>

                  {/* Raise Request Button */}
                  <button
                    className="mt-5 w-full h-[37px] px-[32px] py-[8px] bg-[#153E3B] text-white font-lato font-semibold text-[14px] leading-[21px] text-center rounded-md"
                    onClick={async () => {
                      handleButtonClick(selectedService);
                    }}
                  >
                    Raise Request
                  </button>
                </div>
              </div>
            )}

            {/* Confirmation Modal */}
            {isConfirmationModalOpen && (
              <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
                {/* Big box */}
                <div className="bg-[#FAFAFA] w-full max-w-[344px] md:w-[344px] ml-4 mr-4 h-auto p-[16px] px-[24px] rounded-lg border border-transparent">
                  {/* Modal Header */}
                  <div className="flex flex-col justify-between   mb-6">
                    {/* Request Raised successfully */}
                    <img
                      src={tick}
                      className="w-[24px] h-[24px] p-[2px]  mb-3"
                      alt="tick"
                    />
                    <h2 className="font-montserrat font-extrabold text-[16px] leading-[24px] tracking-[0.25px] mb-[6px] text-[#0A0B0A]">
                      Request Raised successfully
                    </h2>
                    {/* Green tick */}

                    {/* After deleting the form... */}
                    <p className="font-lato text-[14px] leading-[21px] text-[#433F3E] font-semibold">
                      {/* After deleting the form you will not be able to recover it. */}
                      You will hear from us shortly.
                    </p>
                  </div>

                  {/* Buttons */}
                  <button
                    className=" w-full h-[37px] px-[24px] py-[8px] font-lato font-semibold text-[14px] leading-[21px] bg-[#153E3B] text-white rounded-md"
                    onClick={handleContinue}
                  >
                    Back to Vault
                  </button>
                  {/* <div className="flex justify-between  gap-3">
                <button
                  className=" w-full  md:w-[142px] h-[37px] px-[24px] py-[8px] border font-lato font-semibold text-[14px] leading-[21px]  border-gray-300 rounded-md"
                  onClick={() => setIsConfirmationModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className=" w-full md:w-[142px] h-[37px] px-[24px] py-[8px]  font-lato font-semibold text-[14px] leading-[21px]  bg-[#153E3B] text-white rounded-md"
                  onClick={handleContinue}
                >
                  Continue
                </button>
              </div> */}
                </div>
              </div>
            )}
          </div>

          <ConfirmationModal
            isOpen={showDeleteModal}
            title="Delete this file?"
            message="This file will be permanently deleted."
            onCancel={() => {
              setshowDeleteModal(false);
            }}
            onConfirm={() =>
              handleDelete(documentToDelete.doc, documentToDelete.index)
            }
          />
        </>
      
    </>
  );
};

export default VaultInvestment;
