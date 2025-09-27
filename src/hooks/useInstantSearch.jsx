import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { algoliaService } from "../services/algoliaService";

/**
 * Page-specific InstantSearch configurations
 */
const PAGE_CONFIGS = {
  properties: {
    defaultIndex: (isAuth) => algoliaService.getIndexName(isAuth, "grid"),
    defaultFilters: "showOnTruEstate:true",
    defaultHitsPerPage: 12,
    routing: true,
    searchBoxEnabled: true,
    facetsEnabled: true,
    sortingEnabled: true,
    viewToggleEnabled: true,
  },

  auction: {
    defaultIndex: () => algoliaService.getAuctionIndex("regular"),
    defaultFilters: "showOnTruEstate:true",
    defaultHitsPerPage: 12,
    routing: true,
    searchBoxEnabled: true,
    facetsEnabled: true,
    sortingEnabled: false,
    viewToggleEnabled: false,
  },

  "auction/bda-auction": {
    defaultIndex: () => algoliaService.getAuctionIndex("bda"),
    defaultFilters: "",
    defaultHitsPerPage: 12,
    routing: true,
    searchBoxEnabled: true,
    facetsEnabled: false,
    sortingEnabled: false,
    viewToggleEnabled: false,
  },

  wishlist: {
    defaultIndex: (isAuth) => algoliaService.getIndexName(isAuth, "grid"),
    defaultFilters: "showOnTruEstate:true AND wishlisted:true",
    defaultHitsPerPage: 12,
    routing: false,
    searchBoxEnabled: false,
    facetsEnabled: false,
    sortingEnabled: true,
    viewToggleEnabled: true,
  },

  opportunities: {
    defaultIndex: (isAuth) => algoliaService.getIndexName(isAuth, "grid"),
    defaultFilters: "showOnTruEstate:true AND exclusive:true",
    defaultHitsPerPage: 12,
    routing: false,
    searchBoxEnabled: true,
    facetsEnabled: true,
    sortingEnabled: true,
    viewToggleEnabled: false,
  },

  blog: {
    defaultIndex: () => "truEstate_blogs",
    defaultFilters: "published:true",
    defaultHitsPerPage: 10,
    routing: true,
    searchBoxEnabled: true,
    facetsEnabled: true,
    sortingEnabled: true,
    viewToggleEnabled: false,
  },

  vault: {
    // Vault pages typically don't use search
    defaultIndex: (isAuth) => algoliaService.getIndexName(isAuth, "grid"),
    defaultFilters: "showOnTruEstate:true",
    defaultHitsPerPage: 12,
    routing: false,
    searchBoxEnabled: false,
    facetsEnabled: false,
    sortingEnabled: false,
    viewToggleEnabled: false,
  },
};

/**
 * Get page type from pathname
 */
function getPageType(pathname) {
  if (pathname.startsWith("/properties")) return "properties";
  if (pathname.startsWith("/auction/bda-auction")) return "auction/bda-auction";
  if (pathname.startsWith("/auction")) return "auction";
  if (pathname.startsWith("/wishlist")) return "wishlist";
  if (pathname.startsWith("/opportunities")) return "opportunities";
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname.startsWith("/vault")) return "vault";
  return "properties"; // default
}

/**
 * Hook for page-specific InstantSearch configuration
 */
export const useInstantSearchConfig = (overrides = {}) => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const pageType = getPageType(location.pathname);
  const pageConfig = PAGE_CONFIGS[pageType] || PAGE_CONFIGS.properties;

  const config = useMemo(() => {
    const baseConfig = {
      indexName: typeof pageConfig.defaultIndex === "function"
        ? pageConfig.defaultIndex(isAuthenticated)
        : pageConfig.defaultIndex,
      searchClient: algoliaService.client,
      routing: pageConfig.routing,
      ...pageConfig,
      ...overrides,
    };

    return baseConfig;
  }, [pageType, isAuthenticated, pageConfig, overrides]);

  return {
    config,
    pageType,
    pageConfig,
    isAuthenticated,
  };
};

/**
 * Hook for page-specific search parameters
 */
export const usePageSearchParams = (viewType = "grid", sortOption = null) => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const pageType = getPageType(location.pathname);
  const pageConfig = PAGE_CONFIGS[pageType] || PAGE_CONFIGS.properties;

  const searchParams = useMemo(() => {
    let indexName = pageConfig.defaultIndex;

    if (typeof indexName === "function") {
      indexName = indexName(isAuthenticated);
    }

    // Override index for specific view types or sorting
    if (pageType === "properties") {
      if (sortOption) {
        
        indexName = algoliaService.getSortIndex(isAuthenticated, sortOption);
      } else if (viewType === "map") {
        indexName = algoliaService.getIndexName(isAuthenticated, "map");
      } else {
        indexName = algoliaService.getIndexName(isAuthenticated, viewType);
      }
    }

    const hitsPerPage = viewType === "map" ? 160 : pageConfig.defaultHitsPerPage;

    return {
      indexName,
      filters: pageConfig.defaultFilters,
      hitsPerPage,
      analytics: true,
    };
  }, [pageType, pageConfig, isAuthenticated, viewType, sortOption]);

  return searchParams;
};

/**
 * Hook for search box configuration based on page
 */
export const useSearchBoxConfig = () => {
  const location = useLocation();
  const pageType = getPageType(location.pathname);
  const pageConfig = PAGE_CONFIGS[pageType] || PAGE_CONFIGS.properties;

  const searchBoxConfig = useMemo(() => {
    if (!pageConfig.searchBoxEnabled) {
      return null;
    }

    const baseConfig = {
      placeholder: "Search...",
      searchAsYouType: false,
      classNames: {
        root: "flex gap-0 items-center border border-[#B5B3B3] max-w-[343px] h-[44px] rounded-md h-[36px] w-[200px] md:w-[300px] lg:w-[400px]",
        form: "flex w-full h-full",
        input: "w-full h-full px-[12px] py-[4px] ml-7 rounded-md border-none text-sm text-black focus:outline-none font-lato font-medium text-xs",
      },
      resetIconComponent: () => <></>,
      submitIconComponent: () => (
        <button
          type="button"
          className="w-[56px] h-[40px] flex items-center justify-center bg-[#153E3B] hover:bg-black text-white rounded-md px-[8px] py-[6px] font-lato font-bold text-xs transition-all duration-200 mx-[2px]"
        >
          Search
        </button>
      ),
      loadingIconComponent: () => <div className="hidden"></div>,
    };

    // Page-specific configurations
    switch (pageType) {
      case "properties":
        return {
          ...baseConfig,
          placeholder: "Search by project, micro market...",
        };
      case "auction":
        return {
          ...baseConfig,
          placeholder: "Search auction properties...",
        };
      case "blog":
        return {
          ...baseConfig,
          placeholder: "Search articles...",
          searchAsYouType: true,
        };
      case "opportunities":
        return {
          ...baseConfig,
          placeholder: "Search opportunities...",
        };
      default:
        return baseConfig;
    }
  }, [pageType, pageConfig]);

  return searchBoxConfig;
};

/**
 * Hook for facet configuration based on page
 */
export const useFacetConfig = () => {
  const location = useLocation();
  const pageType = getPageType(location.pathname);
  const pageConfig = PAGE_CONFIGS[pageType] || PAGE_CONFIGS.properties;

  const facetConfig = useMemo(() => {
    if (!pageConfig.facetsEnabled) {
      return null;
    }

    // Page-specific facet configurations
    switch (pageType) {
      case "properties":
        return {
          facets: [
            { attribute: "location", label: "Location" },
            { attribute: "configuration", label: "Configuration" },
            { attribute: "investmentType", label: "Investment Type" },
            { attribute: "stage", label: "Stage" },
            { attribute: "builder", label: "Builder" },
          ],
          numericFacets: [
            { attribute: "investmentAmount", label: "Investment Amount" },
            { attribute: "pricePerSqft", label: "Price per Sq ft" },
          ],
        };
      case "auction":
        return {
          facets: [
            { attribute: "location", label: "Location" },
            { attribute: "auctionType", label: "Auction Type" },
            { attribute: "status", label: "Status" },
          ],
          numericFacets: [
            { attribute: "basePrice", label: "Base Price" },
          ],
        };
      case "blog":
        return {
          facets: [
            { attribute: "category", label: "Category" },
            { attribute: "author", label: "Author" },
            { attribute: "tags", label: "Tags" },
          ],
          numericFacets: [],
        };
      case "opportunities":
        return {
          facets: [
            { attribute: "location", label: "Location" },
            { attribute: "opportunityType", label: "Type" },
            { attribute: "exclusiveLevel", label: "Exclusivity" },
          ],
          numericFacets: [
            { attribute: "investmentAmount", label: "Investment Amount" },
          ],
        };
      default:
        return {
          facets: [],
          numericFacets: [],
        };
    }
  }, [pageType, pageConfig]);

  return facetConfig;
};

/**
 * Hook for sorting configuration based on page
 */
export const useSortingConfig = () => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const pageType = getPageType(location.pathname);
  const pageConfig = PAGE_CONFIGS[pageType] || PAGE_CONFIGS.properties;

  const sortingConfig = useMemo(() => {
    if (!pageConfig.sortingEnabled) {
      return null;
    }

    // Page-specific sorting options
    switch (pageType) {
      case "properties":
        const baseSortOptions = [
          { value: "price/sqft ascending", label: "Price / Sq ft - Low to High" },
          { value: "price/sqft descending", label: "Price / Sq ft - High to Low" },
          { value: "investment amount ascending", label: "Investment Amount - Low to High" },
          { value: "investment amount descending", label: "Investment Amount - High to Low" },
        ];

        if (isAuthenticated) {
          baseSortOptions.push(
            { value: "cagr high to low", label: "CAGR - High to Low" },
            { value: "cagr low to high", label: "CAGR - Low to High" }
          );
        }

        return { options: baseSortOptions };

      case "wishlist":
        return {
          options: [
            { value: "dateAdded desc", label: "Recently Added" },
            { value: "dateAdded asc", label: "Oldest First" },
            { value: "price/sqft ascending", label: "Price / Sq ft - Low to High" },
            { value: "price/sqft descending", label: "Price / Sq ft - High to Low" },
          ],
        };

      case "blog":
        return {
          options: [
            { value: "publishDate desc", label: "Latest First" },
            { value: "publishDate asc", label: "Oldest First" },
            { value: "popularity desc", label: "Most Popular" },
            { value: "title asc", label: "Title A-Z" },
          ],
        };

      case "opportunities":
        return {
          options: [
            { value: "exclusiveLevel desc", label: "Most Exclusive" },
            { value: "dateAdded desc", label: "Recently Added" },
            { value: "investment amount ascending", label: "Investment Amount - Low to High" },
            { value: "investment amount descending", label: "Investment Amount - High to Low" },
          ],
        };

      default:
        return { options: [] };
    }
  }, [pageType, pageConfig, isAuthenticated]);

  return sortingConfig;
};

export default useInstantSearchConfig;