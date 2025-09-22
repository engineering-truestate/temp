import React from "react";
import { InstantSearch, Configure } from "react-instantsearch";
import { useInstantSearchConfig, usePageSearchParams } from "../../hooks/useInstantSearch.jsx";

/**
 * Page-specific InstantSearch wrapper component
 * Automatically configures InstantSearch based on the current page
 */
const PageInstantSearch = ({
  children,
  viewType = "grid",
  sortOption = null,
  overrides = {}
}) => {
  const { config } = useInstantSearchConfig(overrides);
  const searchParams = usePageSearchParams(viewType, sortOption);

  return (
    <InstantSearch
      searchClient={config.searchClient}
      indexName={searchParams.indexName}
      routing={config.routing}
    >
      <Configure
        analytics={searchParams.analytics}
        hitsPerPage={searchParams.hitsPerPage}
        filters={searchParams.filters}
      />
      {children}
    </InstantSearch>
  );
};

export default PageInstantSearch;