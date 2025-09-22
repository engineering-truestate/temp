import React from "react";
import AppHeader from "./AppHeader";
import PageSearchBox from "../InstantSearch/PageSearchBox";

const PropertiesHeader = ({
  sidebarOpen,
  toggleSidebar,
  toggleAgentModal,
  isMobile,
  isTablet,
}) => {
  return (
    <AppHeader
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      toggleAgentModal={toggleAgentModal}
      pageTitle="Properties"
    >
      {/* Properties-specific search box */}
      {!(isTablet || isMobile) && (
        <PageSearchBox />
      )}
    </AppHeader>
  );
};

export default PropertiesHeader;