import React from "react";
import AuctionCard from "../Project_popup/AuctionPopup";
import PropCard from "../Project_popup/ProjectPopup";
import styles from "../Project_popup/ProjectPopup.module.css";
import PropTypes from "prop-types";

const AgentSuggestedProperties = ({ view, matchedProperties }) => {
  return (
    <div>
      {view === "grid" && (
        <div
          className={`grid ${styles.lg_custom} ${styles.md_custom} ${styles.xl_custom} sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 relative z-1`}
        >
          {matchedProperties.map((project) => {
            if (project?.projectId) {
              if (project.propertyType === "auction") {
                return (
                  <div key={project.projectId}>
                    <AuctionCard project={project} />
                  </div>
                );
              }
              return (
                <div key={project.projectId}>
                  <PropCard project={project} />
                </div>
              );
            }
            return null; // If project is missing a projectId, skip rendering
          })}
        </div>
      )}
    </div>
  );
};

AgentSuggestedProperties.propTypes = {
  view: PropTypes.string.isRequired,
  matchedProperties: PropTypes.array.isRequired,
};

export default AgentSuggestedProperties;
