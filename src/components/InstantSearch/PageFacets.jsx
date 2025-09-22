import React from "react";
import { RefinementList, RangeInput, ClearRefinements } from "react-instantsearch";
import { useFacetConfig } from "../../hooks/useInstantSearch.jsx";

/**
 * Page-specific facets component
 * Automatically configures facets based on the current page
 */
const PageFacets = ({ className = "" }) => {
  const facetConfig = useFacetConfig();

  if (!facetConfig) {
    return null; // Page doesn't support facets
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Clear all filters */}
      <div className="border-b pb-4">
        <ClearRefinements
          classNames={{
            button:
              "px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors",
            disabledButton: "opacity-50 cursor-not-allowed",
          }}
          translations={{
            resetButtonText: "Clear all filters",
          }}
        />
      </div>

      {/* Regular facets */}
      {facetConfig.facets.map((facet) => (
        <div key={facet.attribute} className="border-b pb-4">
          <h3 className="font-medium text-gray-900 mb-3">{facet.label}</h3>
          <RefinementList
            attribute={facet.attribute}
            limit={10}
            showMore={true}
            showMoreLimit={20}
            classNames={{
              root: "space-y-2",
              list: "space-y-2",
              item: "flex items-center",
              label: "flex items-center cursor-pointer text-sm",
              checkbox:
                "mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500",
              labelText: "text-gray-700",
              count:
                "ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full",
              showMore:
                "mt-3 text-sm text-blue-600 hover:text-blue-800 cursor-pointer",
            }}
            translations={{
              showMoreButtonText: (expanded) =>
                expanded ? "Show less" : "Show more",
            }}
          />
        </div>
      ))}

      {/* Numeric facets (ranges) */}
      {facetConfig.numericFacets.map((facet) => (
        <div key={facet.attribute} className="border-b pb-4">
          <h3 className="font-medium text-gray-900 mb-3">{facet.label}</h3>
          <RangeInput
            attribute={facet.attribute}
            classNames={{
              root: "space-y-2",
              form: "flex space-x-2",
              input:
                "flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              submit:
                "px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
            }}
            translations={{
              separatorElementText: "to",
              submitButtonText: "Apply",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default PageFacets;