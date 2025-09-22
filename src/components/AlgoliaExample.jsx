import React, { useState, useEffect } from "react";
import { useAlgolia, useAlgoliaSearch } from "../hooks/useAlgolia";

// Example component showing how to use the algolia service
const AlgoliaExample = () => {
  const {
    loading,
    error,
    getMapProperties,
    getAuctionProperties,
    getSortedProperties,
    getPropertySuggestions,
  } = useAlgolia();

  const {
    searchResults,
    searchParams,
    performSearch,
    updateSearchParams,
    resetSearch,
  } = useAlgoliaSearch();

  const [suggestions, setSuggestions] = useState([]);

  // Example: Search properties
  const handleSearch = async () => {
    try {
      await performSearch({
        query: "bangalore",
        hitsPerPage: 10,
      });
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  // Example: Get map properties
  const handleGetMapProperties = async () => {
    try {
      const mapData = await getMapProperties("showOnTruEstate:true");
      console.log("Map properties:", mapData);
    } catch (err) {
      console.error("Failed to get map properties:", err);
    }
  };

  // Example: Get auction properties
  const handleGetAuctionProperties = async () => {
    try {
      const auctionData = await getAuctionProperties("regular", {
        query: "",
        hitsPerPage: 20,
      });
      console.log("Auction properties:", auctionData);
    } catch (err) {
      console.error("Failed to get auction properties:", err);
    }
  };

  // Example: Get sorted properties
  const handleGetSortedProperties = async () => {
    try {
      const sortedData = await getSortedProperties("price/sqft ascending", {
        query: "",
        hitsPerPage: 15,
      });
      console.log("Sorted properties:", sortedData);
    } catch (err) {
      console.error("Failed to get sorted properties:", err);
    }
  };

  // Example: Get property suggestions
  const handleGetSuggestions = async (query) => {
    if (query.length > 2) {
      try {
        const suggestionData = await getPropertySuggestions(query);
        setSuggestions(suggestionData);
      } catch (err) {
        console.error("Failed to get suggestions:", err);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Algolia Service Examples</h1>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          Loading...
        </div>
      )}

      {/* Search Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Search Properties</h2>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchParams.query}
            onChange={(e) => updateSearchParams({ query: e.target.value })}
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Search
          </button>
          <button
            onClick={resetSearch}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>

        {/* Search Results */}
        <div className="text-sm text-gray-600 mb-2">
          Found {searchResults.nbHits} properties in {searchResults.processingTimeMS}ms
        </div>

        <div className="max-h-64 overflow-y-auto">
          {searchResults.hits.map((hit, index) => (
            <div key={hit.objectID || index} className="p-2 border-b last:border-b-0">
              <div className="font-medium">{hit.title || hit.name || `Property ${index + 1}`}</div>
              <div className="text-sm text-gray-600">{hit.location || "Location not available"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Property Suggestions */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Property Suggestions</h2>

        <input
          type="text"
          placeholder="Type to get suggestions..."
          onChange={(e) => handleGetSuggestions(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
        />

        <div className="max-h-32 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div key={suggestion.objectID || index} className="p-2 border-b last:border-b-0">
              <div className="font-medium">{suggestion.title || suggestion.name || `Suggestion ${index + 1}`}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={handleGetMapProperties}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Get Map Properties
        </button>

        <button
          onClick={handleGetAuctionProperties}
          disabled={loading}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
        >
          Get Auction Properties
        </button>

        <button
          onClick={handleGetSortedProperties}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Get Sorted Properties
        </button>
      </div>

      {/* Service Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Available Service Methods:</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>searchProperties() - General property search</li>
          <li>getMapProperties() - Properties for map view</li>
          <li>getAuctionProperties() - Auction properties</li>
          <li>getSortedProperties() - Properties with sorting</li>
          <li>searchWithFacets() - Search with facet filtering</li>
          <li>getPropertySuggestions() - Autocomplete suggestions</li>
          <li>getPropertyById() - Single property by ID</li>
          <li>getPropertiesByIds() - Multiple properties by IDs</li>
        </ul>
      </div>
    </div>
  );
};

export default AlgoliaExample;