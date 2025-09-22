import { clientAuctions } from "..";

// Initialize Algolia search client
const searchClient = clientAuctions;

const INDEX_NAME = "truEstate-auction";

/**
 * Utility function to build the Algolia filter string from selected filters
 *
 * @param {Object} filters - Filters object containing the different filters
 * @returns {string} - A string representation of the filter parameters
 */
const buildFilterString = (filters = {}) => {
  const filterParts = [];

  // Handle 'strategy' filter
  if (filters.strategy?.length && !filters.strategy.includes("all")) {
    filterParts.push(
      `(${filters.strategy.map((value) => `strategy:"${value}"`).join(" OR ")})`
    );
  }

  // Handle 'growthPotential' filter
  if (
    filters.growthPotential?.length &&
    !filters.growthPotential.includes("all")
  ) {
    filterParts.push(
      `(${filters.growthPotential
        .map((value) => `auctionOverview.auctionCAGR:"${value}"`)
        .join(" OR ")})`
    );
  }

  // Handle 'value' filter
  if (filters.value?.length && !filters.value.includes("all")) {
    filterParts.push(
      `(${filters.value
        .map((value) => `auctionOverview.auctionValue:"${value}"`)
        .join(" OR ")})`
    );
  }

  // Handle 'commercialType' filter
  if (
    filters.commercialType?.length &&
    !filters.commercialType.includes("all")
  ) {
    filterParts.push(
      `(${filters.commercialType
        .map((value) => `commercialType:"${value}"`)
        .join(" OR ")})`
    );
  }

  // Handle 'assetType' filter
  if (filters.assetType?.length && !filters.assetType.includes("all")) {
    filterParts.push(
      `(${filters.assetType
        .map((value) => `assetType:"${value}"`)
        .join(" OR ")})`
    );
  }

  // Handle 'loanEligible' filter
  if (filters.loanEligible?.length && !filters.loanEligible.includes("all")) {
    filterParts.push(
      `(${filters.loanEligible
        .map((value) => `auctionOverview.loanEligiblity:"${value}"`)
        .join(" OR ")})`
    );
  }

  // Handle 'possession' filter
  if (filters.possession?.length && !filters.possession.includes("all")) {
    filterParts.push(
      `(${filters.availablePossession
        .map((value) => `availablePssession:"${value}"`)
        .join(" OR ")})`
    );
  }

  // Handle 'budget' filter
  if (filters.budget?.length === 2) {
    const [min, max] = filters.budget.map(Number);
    filterParts.push(
      `minInvestmentOfAuction >= ${min} AND minInvestmentOfAuction <= ${max}`
    );
  }

  // Return the concatenated filter string
  return filterParts.join(" AND ");
};

/**
 * Search auctions using filters
 *
 * @param {Object} params - The parameters for searching auctions
 * @param {string} [params.query=""] - The search query string
 * @param {Object} [params.filters={}] - Filters to apply to the search
 * @param {number} [params.page=0] - The page number for pagination
 * @param {number} [params.hitsPerPage=20] - Number of results per page
 * @param {string} [params.sortBy=""] - Sorting criteria
 * @returns {Promise<Object>} - The search results with hits and metadata
 */
export const searchAuction = async (params = {}) => {
  const {
    query = "",
    filters = {},
    page = 0,
    hitsPerPage = 20,
    sortBy = "",
  } = params;

  try {
    // Clear cache before searching
    await searchClient.clearCache();

    // Perform search query with filters
    const response = await searchClient.search([
      {
        indexName: getIndexName(sortBy),
        params: {
          query,
          page,
          hitsPerPage,
          filters: buildFilterString(filters),
          facets: [
            "strategy",
            "auctionOverview.auctionCAGR",
            "auctionOverview.auctionValu",
            "commercialType",
            "assetType",
            "auctionOverview.loanEligiblity",
            "possession",
          ],
          maxValuesPerFacet: 100,
        },
      },
    ]);

    const result = response.results[0];

    // Return the formatted search results
    return {
      hits: result.hits,
      nbHits: result.nbHits || 0,
      page: result.page || 0,
      nbPages: result.nbPages || 0,
      hitsPerPage: result.hitsPerPage || 0,
      processingTimeMS: result.processingTimeMS,
      facets: result.facets,
    };
  } catch (error) {
    console.error("Search error:", error);
    throw new Error("Search failed");
  }
};

/**
 * Get all facet values for filters
 *
 * @returns {Promise<Object>} - The facet values for the available filters
 */
export const getAuctionFacets = async () => {
  try {
    const response = await searchClient.search([
      {
        indexName: INDEX_NAME,
        params: {
          query: "",
          hitsPerPage: 0,
          facets: [
            "strategy",
            "auctionOverview.auctionCAGR",
            "auctionOverview.auctionValu",
            "commercialType",
            "assetType",
            "auctionOverview.loanEligiblity",
            "possession",
          ],
          maxValuesPerFacet: 100,
        },
      },
    ]);

    const result = response.results[0];
    const facets = {};

    // Extract facet values and sort by count
    Object.entries(result.facets || {}).forEach(([facetName, values]) => {
      facets[facetName] = Object.entries(values)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count);
    });

    return facets;
  } catch (error) {
    console.error("Facet fetch error:", error);
    throw new Error("Failed to get facet values");
  }
};

/**
 * Get values for a specific facet with optional filters
 *
 * @param {string} facetName - The facet name to retrieve values for
 * @param {Object} [filters={}] - Optional filters to apply to the facet values
 * @param {number} [maxFacetHits=100] - Maximum number of facet values to return
 * @returns {Promise<Array>} - The facet values sorted by count
 */
export const getAuctionFacetValues = async (
  facetName,
  filters = {},
  maxFacetHits = 100
) => {
  try {
    const response = await searchClient.search({
      requests: [
        {
          indexName: INDEX_NAME,
          query: "",
          hitsPerPage: 0,
          facets: [facetName],
          maxValuesPerFacet: maxFacetHits,
          filters: buildFilterString(filters),
        },
      ],
    });

    const result = response.results[0];
    const facetValues = result.facets?.[facetName] || {};

    return Object.entries(facetValues)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error(`Error getting facet values for ${facetName}:`, error);
    throw new Error("Failed to get facet values");
  }
};

/**
 * Get index name based on sorting criteria
 *
 * @param {string} [sortBy=""] - Sorting criteria
 * @returns {string} - The index name based on sorting
 */
const getIndexName = (sortBy = "") => {
  const sortMap = {
    created_desc: `${INDEX_NAME}__created_desc`,
    created_asc: `${INDEX_NAME}__created_asc`,
    budget_desc: `${INDEX_NAME}_budget_desc`,
    budget_asc: `${INDEX_NAME}_budget_asc`,
  };

  return sortMap[sortBy] || INDEX_NAME;
};

export default {
  searchAuction,
  getAuctionFacets,
  getAuctionFacetValues,
};
