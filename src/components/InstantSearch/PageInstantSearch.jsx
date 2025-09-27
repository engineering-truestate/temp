import React from "react";
import { InstantSearch, Configure } from "react-instantsearch";
import {
  useInstantSearchConfig,
  usePageSearchParams,
} from "../../hooks/useInstantSearch.jsx";

/**
 * Page-specific InstantSearch wrapper component
 * Automatically configures InstantSearch based on the current page
 */
const indexMap = {
  default: "products",
  price_asc: "products_price_asc",
  price_desc: "products_price_desc",
};

const PageInstantSearch = ({
  children,
  viewType = "grid",
  sortOption = null,
  overrides = {}
}) => {
  const { config } = useInstantSearchConfig(overrides);
  const searchParams = usePageSearchParams(viewType, sortOption);

  // Manually override config.indexName
  const instantSearchConfig = {
    ...config,
    indexName: searchParams.indexName,
  };

  return (
    <InstantSearch
      searchClient={instantSearchConfig.searchClient}
      indexName={instantSearchConfig.indexName} // now always uses sorted index
      routing={instantSearchConfig.routing}
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

// export default PageInstantSearch;


export default PageInstantSearch;
