import { liteClient } from "algoliasearch/lite";

// Create search client
const searchClient = liteClient(
  "OX16MFDFLA",
  "6e62a6f6dd7f5ec9d46e46a4aca903f0"
);

// Index configurations
const INDEX_CONFIGS = {
  // Authenticated user indexes
  truEstatePreLaunch: "truEstatePreLaunch",
  map_preLaunch: "map_preLaunch",
  truEstateAuctions: "truEstateAuctions",
  truEstateBdaAuctions: "truEstateBdaAuctions",

  // Non-authenticated user indexes
  truEstate_preLaunch_outside: "truEstate_preLaunch_outside",
  map_preLaunch_outside: "map_preLaunch_outside",

  // Sorting indexes
  "sort-by-pricepersqft-asc": "sort-by-pricepersqft-asc",
  "sort-by-pricepersqft-dsc": "sort-by-pricepersqft-dsc",
  "sort-by-pricepersqft-asc-outside": "sort-by-pricepersqft-asc-outside",
  "sort-by-pricepersqft-dsc-outside": "sort-by-pricepersqft-dsc-outside",
  "sort-by-investmentamt-asc": "sort-by-investmentamt-asc",
  "sort-by-investmentamt-dsc": "sort-by-investmentamt-dsc",
  "sort-by-investmentamt-asc-outside": "sort-by-investmentamt-asc-outside",
  "sort-by-investmentamt-dsc-outside": "sort-by-investmentamt-dsc-outside",
  "sort-by-handover-date-asc": "sort-by-handover-date-asc",
  "cagr_descending": "cagr_descending",
  "cagr_ascending": "cagr_ascending",
};

class AlgoliaService {
  constructor() {
    this.client = searchClient;
  }

  /**
   * Get the appropriate index based on authentication status and view type
   */
  getIndexName(isAuthenticated, viewType = "grid", sortOption = null) {
    if (sortOption) {
      return this.getSortIndex(isAuthenticated, sortOption);
    }

    if (viewType === "map") {
      return isAuthenticated ? INDEX_CONFIGS.map_preLaunch : INDEX_CONFIGS.map_preLaunch_outside;
    }

    return isAuthenticated ? INDEX_CONFIGS.truEstatePreLaunch : INDEX_CONFIGS.truEstate_preLaunch_outside;
  }

  /**
   * Get sorting index based on authentication and sort option
   */
  getSortIndex(isAuthenticated, sortOption) {
    const sortMappings = {
      "price/sqft ascending": isAuthenticated
        ? INDEX_CONFIGS["sort-by-pricepersqft-asc"]
        : INDEX_CONFIGS["sort-by-pricepersqft-asc-outside"],
      "price/sqft descending": isAuthenticated
        ? INDEX_CONFIGS["sort-by-pricepersqft-dsc"]
        : INDEX_CONFIGS["sort-by-pricepersqft-dsc-outside"],
      "investment amount ascending": isAuthenticated
        ? INDEX_CONFIGS["sort-by-investmentamt-asc"]
        : INDEX_CONFIGS["sort-by-investmentamt-asc-outside"],
      "investment amount descending": isAuthenticated
        ? INDEX_CONFIGS["sort-by-investmentamt-dsc"]
        : INDEX_CONFIGS["sort-by-investmentamt-dsc-outside"],
      "handover date ascending": INDEX_CONFIGS["sort-by-handover-date-asc"],
      "cagr high to low": INDEX_CONFIGS.cagr_descending,
      "cagr low to high": INDEX_CONFIGS.cagr_ascending,
    };

    return sortMappings[sortOption] || this.getIndexName(isAuthenticated);
  }

  /**
   * Get auction index based on auction type
   */
  getAuctionIndex(auctionType = "regular") {
    if (auctionType === "bda") {
      return INDEX_CONFIGS.truEstateBdaAuctions;
    }
    return INDEX_CONFIGS.truEstateAuctions;
  }



  /**
   * Search properties with given parameters
   */
  async searchProperties({
    indexName,
    query = "",
    filters = "showOnTruEstate:true",
    hitsPerPage = 12,
    page = 0,
    facets = [],
    analytics = true
  }) {
    try {
      const index = this.client.initIndex(indexName);

      const searchParams = {
        query,
        filters,
        hitsPerPage,
        page,
        analytics,
      };

      if (facets.length > 0) {
        searchParams.facets = facets;
      }

      const response = await index.search(searchParams);

      return {
        hits: response.hits,
        nbHits: response.nbHits,
        page: response.page,
        nbPages: response.nbPages,
        hitsPerPage: response.hitsPerPage,
        facets: response.facets || {},
        processingTimeMS: response.processingTimeMS,
      };
    } catch (error) {
      console.error("Error searching properties:", error);
      throw error;
    }
  }

  /**
   * Get properties for map view with higher limit
   */
  async getMapProperties({
    isAuthenticated,
    filters = "showOnTruEstate:true",
    hitsPerPage = 160
  }) {
    const indexName = this.getIndexName(isAuthenticated, "map");

    return this.searchProperties({
      indexName,
      filters,
      hitsPerPage,
    });
  }

  /**
   * Get auction properties
   */
  async getAuctionProperties({
    auctionType = "regular",
    query = "",
    filters = "showOnTruEstate:true",
    hitsPerPage = 12,
    page = 0
  }) {
    const indexName = this.getAuctionIndex(auctionType);

    return this.searchProperties({
      indexName,
      query,
      filters,
      hitsPerPage,
      page,
    });
  }

  /**
   * Get sorted properties
   */
  async getSortedProperties({
    isAuthenticated,
    sortOption,
    query = "",
    filters = "showOnTruEstate:true",
    hitsPerPage = 12,
    page = 0
  }) {
    const indexName = this.getSortIndex(isAuthenticated, sortOption);

    return this.searchProperties({
      indexName,
      query,
      filters,
      hitsPerPage,
      page,
    });
  }

  /**
   * Search with facet filtering
   */
  async searchWithFacets({
    indexName,
    query = "",
    facetFilters = [],
    numericFilters = [],
    filters = "showOnTruEstate:true",
    hitsPerPage = 12,
    page = 0
  }) {
    try {
      const index = this.client.initIndex(indexName);

      const searchParams = {
        query,
        filters,
        hitsPerPage,
        page,
        analytics: true,
      };

      if (facetFilters.length > 0) {
        searchParams.facetFilters = facetFilters;
      }

      if (numericFilters.length > 0) {
        searchParams.numericFilters = numericFilters;
      }

      const response = await index.search(searchParams);

      return {
        hits: response.hits,
        nbHits: response.nbHits,
        page: response.page,
        nbPages: response.nbPages,
        hitsPerPage: response.hitsPerPage,
        facets: response.facets || {},
        processingTimeMS: response.processingTimeMS,
      };
    } catch (error) {
      console.error("Error searching with facets:", error);
      throw error;
    }
  }

  /**
   * Get property suggestions/autocomplete
   */
  async getPropertySuggestions({
    indexName,
    query,
    hitsPerPage = 5
  }) {
    try {
      const index = this.client.initIndex(indexName);

      const response = await index.search({
        query,
        hitsPerPage,
        attributesToRetrieve: ["title", "location", "objectID"],
        analytics: false,
      });

      return response.hits;
    } catch (error) {
      console.error("Error getting property suggestions:", error);
      throw error;
    }
  }

  /**
   * Get property by ID
   */
  async getPropertyById(indexName, objectID) {
    try {
      const index = this.client.initIndex(indexName);
      const response = await index.getObject(objectID);
      return response;
    } catch (error) {
      console.error("Error getting property by ID:", error);
      throw error;
    }
  }

  /**
   * Get multiple properties by IDs
   */
  async getPropertiesByIds(indexName, objectIDs) {
    try {
      const index = this.client.initIndex(indexName);
      const response = await index.getObjects(objectIDs);
      return response.results;
    } catch (error) {
      console.error("Error getting properties by IDs:", error);
      throw error;
    }
  }

  /**
   * Get available facets for an index
   */
  async getFacets(indexName, facetName) {
    try {
      const index = this.client.initIndex(indexName);
      const response = await index.searchForFacetValues({
        facetName,
        facetQuery: "",
      });
      return response.facetHits;
    } catch (error) {
      console.error("Error getting facets:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const algoliaService = new AlgoliaService();

// Export individual functions for convenience
export const {
  searchProperties,
  getMapProperties,
  getAuctionProperties,
  getSortedProperties,
  searchWithFacets,
  getPropertySuggestions,
  getPropertyById,
  getPropertiesByIds,
  getFacets,
  getIndexName,
  getSortIndex,
  getAuctionIndex,
} = algoliaService;

export default algoliaService;