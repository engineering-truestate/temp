import React, { useEffect } from "react";
import Overview from "../ProjectDetails/Overview.jsx";
import { toCapitalizedWords } from "../../utils/common.js";

const AssetOverview = ({ project, assetOverviewData, setAssetOverviewData }) => {
  const formatToIndianSystem = (number) => {
    const numStr = number.toString();
    const lastThreeDigits = numStr.slice(-3);
    const otherDigits = numStr.slice(0, -3);

    if (otherDigits !== "") {
      return otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThreeDigits;
    }
    return lastThreeDigits;
  };

  useEffect(() => {
    if (!project) return;

    const assetType = project.assetType;
    const projectData = [];

    if (project.purchaseAmount) {
      projectData.push({
        label: "Purchased Price",
        value: "₹" + formatToIndianSystem(project.purchaseAmount),
      });

      if (assetType === "plot" && project.plotArea) {
        projectData.push({
          label: "Purchased Price / Sq ft",
          value: "₹" + formatToIndianSystem(parseInt(project.purchaseAmount / project.plotArea)) + "/ Sq ft",
        });
      } else if ((assetType === "apartment" || assetType === "villa") && project.sbua) {
        projectData.push({
          label: "Purchased Price / Sq ft",
          value: "₹" + formatToIndianSystem(parseInt(project.purchaseAmount / project.sbua)) + "/ Sq ft",
        });
      }
    }

    if (project.yearOfPurchase) {
      projectData.push({
        label: "Holding Period",
        value: new Date().getFullYear() - project.yearOfPurchase + " Years",
      });
    }

    if (project.truestimatedFullPrice) {
      projectData.push({
        label: "TruEstimate",
        value: "₹" + formatToIndianSystem(parseInt(project.truestimatedFullPrice)),
      });
    }

    projectData.push({
      label: "Type",
      value: toCapitalizedWords(assetType),
    });

    // Add more fields based on asset type
    if ((assetType === "apartment" || assetType === "villa") && project.configuration) {
      projectData.push({ label: "Configuration", value: project.configuration });
    }

    if ((assetType === "apartment" || assetType === "villa") && project.sbua) {
      projectData.push({ label: "Super built up area", value: project.sbua + " Sq ft" });
    } else if (assetType === "plot" && project.plotArea) {
      projectData.push({ label: "Land Size", value: project.plotArea + " Sq ft" });
    }

    // Add optional fields
    if (project.directionOfEntrance) {
      projectData.push({ label: "Facing", value: project.directionOfEntrance });
    }
    if (project.unitNo) {
      projectData.push({ label: "Unit No.", value: project.unitNo });
    }
    if (assetType === "apartment" && project.floor) {
      projectData.push({ label: "Floor", value: project.floor });
    }
    if (project.cornerUnit) {
      projectData.push({ label: "Corner Unit", value: project.cornerUnit });
    }
    if (project.yearOfPurchase) {
      projectData.push({ label: "Purchased on", value: project.yearOfPurchase });
    }

    setAssetOverviewData(projectData);
  }, [project, setAssetOverviewData]);

  return (
    <div className="mb-4">
      <Overview
        title="Asset Overview"
        details={assetOverviewData || []}
        project={{}} // Empty object as it's not used in this context
        isReport={false}
      />
    </div>
  );
};

export default AssetOverview;