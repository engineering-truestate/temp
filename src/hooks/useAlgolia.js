import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { algoliaService } from "../services/algoliaService";

/**
 * Custom hook for Algolia search operations
 */
export const useAlgolia = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search properties with loading state
  const searchProperties = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);

    try {
      const result = await algoliaService.searchProperties(searchParams);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get map properties
  const getMapProperties = useCallback(async (filters = "showOnTruEstate:true") => {
    setLoading(true);
    setError(null);

    try {
      const result = await algoliaService.getMapProperties({
        isAuthenticated,
        filters,
      });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Get auction properties
  const getAuctionProperties = useCallback(async (auctionType = "regular", searchParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await algoliaService.getAuctionProperties({
        auctionType,
        ...searchParams,
      });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get sorted properties
  const getSortedProperties = useCallback(async (sortOption, searchParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await algoliaService.getSortedProperties({
        isAuthenticated,
        sortOption,
        ...searchParams,
      });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Search with facets
  const searchWithFacets = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);

    try {
      const result = await algoliaService.searchWithFacets(searchParams);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get property suggestions
  const getPropertySuggestions = useCallback(async (query, indexName = null) => {
    setLoading(true);
    setError(null);

    try {
      const index = indexName || algoliaService.getIndexName(isAuthenticated);
      const result = await algoliaService.getPropertySuggestions({
        indexName: index,
        query,
      });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Get property by ID
  const getPropertyById = useCallback(async (objectID, indexName = null) => {
    setLoading(true);
    setError(null);

    try {
      const index = indexName || algoliaService.getIndexName(isAuthenticated);
      const result = await algoliaService.getPropertyById(index, objectID);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Get multiple properties by IDs
  const getPropertiesByIds = useCallback(async (objectIDs, indexName = null) => {
    setLoading(true);
    setError(null);

    try {
      const index = indexName || algoliaService.getIndexName(isAuthenticated);
      const result = await algoliaService.getPropertiesByIds(index, objectIDs);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Get index name helper
  const getIndexName = useCallback((viewType = "grid", sortOption = null) => {
    return algoliaService.getIndexName(isAuthenticated, viewType, sortOption);
  }, [isAuthenticated]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    isAuthenticated,

    // Methods
    searchProperties,
    getMapProperties,
    getAuctionProperties,
    getSortedProperties,
    searchWithFacets,
    getPropertySuggestions,
    getPropertyById,
    getPropertiesByIds,
    getIndexName,
    clearError,

    // Service access
    algoliaService,
  };
};

/**
 * Hook for managing search state
 */
export const useAlgoliaSearch = (initialParams = {}) => {
  const { searchProperties, loading, error, clearError, getIndexName } = useAlgolia();

  const [searchResults, setSearchResults] = useState({
    hits: [],
    nbHits: 0,
    page: 0,
    nbPages: 0,
    hitsPerPage: 12,
    facets: {},
    processingTimeMS: 0,
  });

  const [searchParams, setSearchParams] = useState({
    query: "",
    filters: "showOnTruEstate:true",
    hitsPerPage: 12,
    page: 0,
    ...initialParams,
  });

  // Perform search
  const performSearch = useCallback(async (params = {}) => {
    const mergedParams = { ...searchParams, ...params };

    try {
      const indexName = getIndexName();
      const results = await searchProperties({
        indexName,
        ...mergedParams,
      });

      setSearchResults(results);
      return results;
    } catch (err) {
      console.error("Search failed:", err);
      throw err;
    }
  }, [searchParams, searchProperties, getIndexName]);

  // Update search params
  const updateSearchParams = useCallback((newParams) => {
    setSearchParams(prev => ({ ...prev, ...newParams }));
  }, []);

  // Reset search
  const resetSearch = useCallback(() => {
    setSearchResults({
      hits: [],
      nbHits: 0,
      page: 0,
      nbPages: 0,
      hitsPerPage: 12,
      facets: {},
      processingTimeMS: 0,
    });
    setSearchParams({
      query: "",
      filters: "showOnTruEstate:true",
      hitsPerPage: 12,
      page: 0,
      ...initialParams,
    });
    clearError();
  }, [initialParams, clearError]);

  // Auto-search when params change
  useEffect(() => {
    if (searchParams.query !== "" || searchParams.filters !== "showOnTruEstate:true") {
      performSearch();
    }
  }, [searchParams, performSearch]);

  return {
    // State
    searchResults,
    searchParams,
    loading,
    error,

    // Methods
    performSearch,
    updateSearchParams,
    resetSearch,
    clearError,
  };
};

export default useAlgolia;