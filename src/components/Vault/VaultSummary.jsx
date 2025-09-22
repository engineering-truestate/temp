import React from "react";
import styles from "./VaultSummary.module.css";
import { formatCost, toCapitalizedWords } from "../../utils/common";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";

const fieldLabels = {
  projectName: "Project Name",
  assetType: "Asset Type",
  yearOfPurchase: "Year of Purchase",
  plotArea: "Plot Area",
  superBuiltUpArea: "Super Built-Up Area",
  floor: "Floor",
  directionOfEntrance: "Direction of Entrance",
  purchasePrice: "Purchase Price",
  unitNumber: "Unit Number",
  cornerUnit: "Corner Unit",
  configuration: "Configuration",
  landSize: "Size of land",
};

const VaultSummary = ({ formData }) => {  

  logEvent(analytics, "click_inside_vault_summary", { Name: "vault_summary", });
  
  return (
    <div className="mb-6  ">
      <div className={`flex flex-wrap ${styles.btnpar} pr-4`}>
        {Object.entries(formData).map(([key, value]) => (
          value && (
            <button
              key={key}
              type="button"
              className={`${styles.buttonx}`}
            >
              <div className="flex">
                {/* Conditionally render the label based on fieldLabels mapping */}
                <span className={styles.xlbl}>{fieldLabels[key]}:</span>
                <span className={styles.xval}>{(key==="purchasePrice") ? formatCost(value*10000000) : (key==='plotArea' || key==='superBuiltUpArea') ? `${value} Sq ft` : toCapitalizedWords(value)}</span>
              </div>
            </button>
          )
        ))}
      </div>
    </div>
  );
};

export default VaultSummary;
