import React, { useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase.js";
import ServiceButton from "./ServiceButton";
import RequestsList from "./RequestsList";
import { SERVICES_CONFIG } from "../constants/services";

const ServicesPanel = ({ project, userPhoneNumber, clickedServices, setClickedServices }) => {
  useEffect(() => {
    const fetchTaskStatus = async () => {
      if (!project?.projectId || !userPhoneNumber) return;

      try {
        const tasksCollectionRef = collection(db, "truEstateTasks");
        const q = query(
          tasksCollectionRef,
          where("taskType", "==", "vault-service"),
          where("projectId", "==", project.projectId)
        );

        const tasksSnapshot = await getDocs(q);
        
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
    };

    fetchTaskStatus();
  }, [project?.projectId, userPhoneNumber, setClickedServices]);

  return (
    <div className="border border-gray-300 rounded-lg mt-20 p-4">
      <h3 className="font-montserrat text-[1rem] font-bold mb-3">
        Services Available For This Property
      </h3>

      <div className="flex flex-wrap gap-2 mb-6">
        {SERVICES_CONFIG.map((service, index) => (
          <ServiceButton
            key={index}
            service={service}
            project={project}
            userPhoneNumber={userPhoneNumber}
            clickedServices={clickedServices}
            setClickedServices={setClickedServices}
          />
        ))}
      </div>

      <RequestsList clickedServices={clickedServices} />
    </div>
  );
};

export default ServicesPanel;