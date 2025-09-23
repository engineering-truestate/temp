import React from "react";
import { toCapitalizedWords } from "../../../utils/common.js";

const VaultHeader = ({ project }) => {
  if (!project) return null;

  return (
    <div className="mt-3 mb-8">
      <p className="font-montserrat text-[1.375rem] font-bold text-[#0A0B0A] leading-[150%] mb-1">
        {toCapitalizedWords(project.projectName)}
      </p>
      {project.lastUpdated && (
        <p className="font-lato text-[1rem] font-semibold text-[#5A5555] leading-[150%] mb-6">
          Updated on <span className="ml-1">{project.lastUpdated}</span>
        </p>
      )}
    </div>
  );
};

export default VaultHeader;