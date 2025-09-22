import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  GeoJSON,
  Circle,
  Tooltip,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { divIcon } from "leaflet";
import Select from "react-select";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./Map.css";
import TrueLogo from "/images/TruEstate Logo.svg";
import ProjectPopup from "../Project_popup/ProjectPopup";
import { circle, color } from "highcharts";
import {
  formatCostSuffix,
  getSvgLinkForPrice,
  getSvgLinkForPriceWithTruTag,
  toCapitalizedWords,
} from "../../utils/common";
import resetIcon from "/assets/icons/actions/btn-reset.svg";
const MetroIcon = '/images/metro.png';
import { useSelector } from "react-redux";
import Loader from "../Loader";
import { selectLoader } from "../../slices/loaderSlice";
import styles from "../Table/Table.module.css";
import { Highlight, useHits, useInstantSearch } from "react-instantsearch";
import { useLocation } from "react-router-dom";
import ProjectPopupMap from "../Project_popup/ProjectPopupMap";
import { getProjectImages } from "../../utils/common";
import ResetIcon from "/assets/icons/actions/reset-white.svg";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import Footer from "../../landing/pages/home/Footer";
import NoPropertiesFound from "../NoPropertiesFound/NoPropertiesFound.jsx";

const defaultCenter = [12.9021306, 77.5976507];

const options = [
  { value: "metro", label: "Metros" },
  { value: "school", label: "Schools" },
  { value: "hospital", label: "Hospitals" },
];

const customIcons = {
  metro: new L.Icon({
    iconUrl: "/images/metro.png",
    iconSize: [40, 40],
  }),
  school: new L.Icon({
    iconUrl: "/images/education.png",
    iconSize: [40, 40],
  }),
  hospital: new L.Icon({
    iconUrl: "/images/hospital.png",
    iconSize: [40, 40],
  }),
  project: new L.Icon({
    iconUrl: "/images/hospital.png",
    iconSize: [60, 60],
  }),
};

const MapComponent = ({
  projects,
  selectedProject,
  setSelectedProject=()=>{},
  mapType,
  trueS = "all",
  isAuction = false,
  isBda = false,
}) => {
  const location = useLocation();
  const [isZoomEnabled, setIsZoomEnabled] = useState(false);
  const { indexUiState, setIndexUiState, status } = useInstantSearch();

  // Separate state for handling window resize
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Check if current screen is mobile (768px or less)
  const isMobile = useMemo(() => windowWidth <= 768, [windowWidth]);

  // Optimized resize handler with debouncing
  useEffect(() => {
    let timeoutId;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 150); // Debounce resize events
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Check if current path should disable click-to-zoom functionality
  const shouldDisableClickToZoom = useMemo(() => {
    const pathname = location.pathname;
    const hasQuery = !!location.search;

    return (
      (pathname === "/auction" ||
        pathname === "/properties" ||
        pathname === "/auction/bda-auction") &&
      (!hasQuery || hasQuery)
    );
  }, [location.pathname, location.search]);

  // Calculate zoom props based on mobile state and zoom enabled state
  const getZoomProps = useMemo(() => {
    // On mobile, disable ALL zoom until the center button is clicked
    if (isMobile && !isZoomEnabled) {
      return {
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false,
        keyboard: false,
      };
    }

    // On mobile, when zoom is enabled, enable all zoom
    if (isMobile && isZoomEnabled) {
      return {
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        boxZoom: true,
        keyboard: true,
      };
    }

    // On desktop, use existing behavior
    return {
      scrollWheelZoom: shouldDisableClickToZoom,
      doubleClickZoom: true,
      touchZoom: true,
      boxZoom: true,
      keyboard: true,
    };
  }, [isMobile, isZoomEnabled, shouldDisableClickToZoom]);

  // Recalculate style only when window width actually changes significantly
  const finalMapStyle = useMemo(() => {
    const getMapStyle = (width, pathname, search) => {
      let height = "70vh";
      let mapWidth = "100%";
      const hasQuery = !!search;

      if (pathname === "/properties" && !hasQuery) {
        height = "60vh";
        mapWidth = "100%";
        return { height, width: mapWidth };
      }
      if (pathname === "/auction" && !hasQuery) {
        height = "75vh";
        mapWidth = "100%";
        return { height, width: mapWidth };
      }

      if ((pathname === "/auction" || pathname === "/properties") && hasQuery) {
        height = "85vh";
        mapWidth = "100%";
        return { height, width: mapWidth };
      }
      if (pathname === "/auction/bda-auction") {
        height = "75vh";
        mapWidth = "100%";
        return { height, width: mapWidth };
      }

      if (width < 1024) {
        if (pathname === "/properties") {
          height = "50vh";
        } else if (
          pathname.startsWith("/properties/") ||
          pathname.startsWith("/auction/")
        ) {
          height = "50vh";
          width == "10%";
        } else if (pathname === "/auction") {
          height = "60vh";
        }
      } else {
        if (pathname.startsWith("/auction/")) {
          height = "50vh";
        } else {
          height = "60vh";
        }
      }

      return { height, width: mapWidth };
    };

    return getMapStyle(windowWidth, location.pathname, location.search);
  }, [windowWidth, location.pathname, location.search]);

  // Setting selected project null only once when component mounts
  useEffect(() => {
    if (setSelectedProject) {
      setSelectedProject(null);
    }
  }, []); // Empty dependency array - only run once on mount

  // Set initial zoom state based on path
  useEffect(() => {
    if (shouldDisableClickToZoom) {
      setIsZoomEnabled(true); // Always enable zoom for these paths
    } else {
      setIsZoomEnabled(false); // Use click-to-enable for other paths
    }
  }, [shouldDisableClickToZoom]);

  const resetAllFilters = useCallback(() => {
    logEvent(analytics, "reset_all_filters", {
      event_category: "interaction",
      event_label: "All Filters Cleared",
    });

    setIndexUiState((prevState) => ({
      ...prevState,
      refinementList: {},
      query: "",
      menu: {},
      range: {},
    }));
  }, [setIndexUiState]);

  const { hits, results } = useHits();
  const isReduxLoading = useSelector(selectLoader);

  // Memoize updated projects to prevent unnecessary recalculations
  const updatedProjects = useMemo(() => {
    if (mapType === "all") {
      const filtered = hits.filter(
        (project) =>
          parseFloat(project?.locationAnalysis?.lat) &&
          parseFloat(project?.locationAnalysis?.long)
      );
      return filtered.map((proj) => ({ ...proj, id: proj.objectID }));
    }
    return projects;
  }, [mapType, hits, projects]);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.projectsState);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [metroData, setMetroData] = useState([]);
  const [schoolData, setSchoolData] = useState([]);
  const [hospitalData, setHospitalData] = useState([]);
  const [markers, setMarkers] = useState([]);

  // Memoize default project center
  const defaultProjectCenter = useMemo(() => {
    return updatedProjects && updatedProjects.length === 1
      ? [
          updatedProjects[0]?.locationAnalysis?.lat,
          updatedProjects[0]?.locationAnalysis?.long,
        ]
      : defaultCenter;
  }, [updatedProjects]);

  const [micromarketsData, setMicromarketsData] = useState(null);
  const [showMicromarkets, setShowMicromarkets] = useState(true);
  const [shouldZoom, setShouldZoom] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [currentProjectCenter, setCurrentProjectCenter] =
    useState(defaultProjectCenter);
  const [imageData, setImageData] = useState([]);
  const [isReset, setIsReset] = useState(false);

  // Load data only once on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [metrosResponse, imagesResponse, coordinatesResponse] =
          await Promise.all([
            fetch("/data/metros.json"),
            fetch("/data/projects.json"),
            fetch("/data/coordinates.json"),
          ]);

        const [metros, projects, coordinates] = await Promise.all([
          metrosResponse.json(),
          imagesResponse.json(),
          coordinatesResponse.json(),
        ]);

        setMetroData(metros);
        setImageData(projects);
        setMicromarketsData(coordinates);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []); // Empty dependency array - only run once

  const handleReset = useCallback(() => {
    setIsReset(true);
    if (!shouldDisableClickToZoom) {
      setIsZoomEnabled(false);
    }
  }, [shouldDisableClickToZoom]);

  // Handler for enabling zoom via button (for mobile)
  const handleEnableZoom = useCallback(() => {
    setIsZoomEnabled(true);
  }, []);

  // Memoized component to handle zoom control
  const ZoomController = React.memo(() => {
    const map = useMap();

    useEffect(() => {
      if (isZoomEnabled) {
        map.scrollWheelZoom.enable();
      } else {
        map.scrollWheelZoom.disable();
      }

      // Only add click handler if click-to-zoom is not disabled and not on mobile
      if (!shouldDisableClickToZoom && !isMobile) {
        const handleMapClick = (e) => {
          if (!isZoomEnabled) {
            setIsZoomEnabled(true);
            map.scrollWheelZoom.enable();
            e.originalEvent?.preventDefault();
            e.originalEvent?.stopPropagation();
          }
        };

        map.on("click", handleMapClick);
        return () => {
          map.off("click", handleMapClick);
        };
      }
    }, [map, isZoomEnabled]);

    return null;
  });

  const ResetMapView = React.memo(() => {
    const map = useMap();
    useEffect(() => {
      if (isReset) {
        if (updatedProjects.length === 1) {
          map.setView(
            [
              parseFloat(updatedProjects[0]?.locationAnalysis?.lat),
              parseFloat(updatedProjects[0]?.locationAnalysis?.long),
            ],
            13
          );
        } else {
          map.setView(defaultCenter, 13);
        }
        setIsReset(false);
      }
    }, [isReset, map]);
    return null;
  });

  const handleMarkerClick = useCallback(
    (project) => {
       setSelectedProject(project);
    },
    [mapType, setSelectedProject]
  );

  const handleMicromarketsToggle = useCallback(() => {
    setShowMicromarkets(!showMicromarkets);
  }, [showMicromarkets]);

  const getLeafletIcons = useCallback((src) => {
    return new L.icon({
      iconUrl: src,
      iconSize: [90, 60],
    });
  }, []);

  const micromarketsStyle = useMemo(
    () => ({
      color: "black",
      weight: 1.5,
      fillColor: "ffcccb",
      opacity: 1,
      fillOpacity: 0.1,
    }),
    []
  );


  const ClusteredMarkers = React.memo(({ markers }) => {
    const map = useMap();

   
    useEffect(() => {
      const markersGroup = L.markerClusterGroup({
        showCoverageOnHover: false,
      });

      markers.forEach((marker) => {
        const leafletMarker = L.marker([marker?.locationAnalysis?.lat, marker?.locationAnalysis?.long], {
          icon: !isAuction
            ? selectedProject && selectedProject["id"] !== marker["id"]
              ? getLeafletIcons(
                  marker?.recommended === true
                    ? getSvgLinkForPriceWithTruTag(
                        marker?.unitDetails?.[0]?.minInvestment
                          ? formatCostSuffix(marker.unitDetails[0].minInvestment)
                          : marker?.minInvestment 
                          ? formatCostSuffix(marker.minInvestment)
                          : "₹1.4 Cr",
                        false
                      )
                    : getSvgLinkForPrice(
                        marker?.unitDetails?.[0]?.minInvestment
                          ? formatCostSuffix(marker.unitDetails[0].minInvestment)
                          : marker?.minInvestment 
                          ? formatCostSuffix(marker.minInvestment)
                          : "₹1.4 Cr",
                        false
                      )
                )
              : selectedProject && selectedProject["id"] === marker["id"]
                ? getLeafletIcons(
                    getSvgLinkForPrice(
                      marker?.unitDetails?.[0]?.minInvestment
                        ? formatCostSuffix(marker.unitDetails[0].minInvestment)
                        : marker?.minInvestment 
                        ? formatCostSuffix(marker.minInvestment)
                        : "₹1.4 Cr",
                      true
                    )
                  )
                : getLeafletIcons(
                    getSvgLinkForPrice(
                      marker?.unitDetails?.[0]?.minInvestment
                        ? formatCostSuffix(marker.unitDetails[0].minInvestment)
                        : marker?.minInvestment 
                        ? formatCostSuffix(marker.minInvestment)
                        : "₹1.4 Cr",
                      false
                    )
                  )
            : (marker?.auctionReservePrice || marker?.minInvestmentOfAuction) &&
                selectedProject &&
                selectedProject["id"] !== marker["id"]
              ? getLeafletIcons(
                  marker?.recommended === true
                    ? getSvgLinkForPriceWithTruTag(
                        marker?.minInvestmentOfAuction
                          ? formatCostSuffix(marker.minInvestmentOfAuction * 10000000)
                          : marker?.auctionReservePrice
                          ? formatCostSuffix(marker.auctionReservePrice * 10000000)
                          : "₹40 L",
                        false
                      )
                    : getSvgLinkForPrice(
                        marker?.minInvestmentOfAuction
                          ? formatCostSuffix(marker.minInvestmentOfAuction * 10000000)
                          : marker?.auctionReservePrice
                          ? formatCostSuffix(marker.auctionReservePrice * 10000000)
                          : "₹40 L",
                        false
                      )
                )
              : selectedProject && selectedProject["id"] === marker["id"]
                ? getLeafletIcons(
                    getSvgLinkForPrice(
                      marker?.minInvestmentOfAuction
                        ? formatCostSuffix(marker.minInvestmentOfAuction * 10000000)
                        : marker?.auctionReservePrice
                        ? formatCostSuffix(marker.auctionReservePrice * 10000000)
                        : "₹40 L",
                      true
                    )
                  )
                : getLeafletIcons(
                    getSvgLinkForPrice(
                      marker?.minInvestmentOfAuction
                        ? formatCostSuffix(marker.minInvestmentOfAuction * 10000000)
                        : marker?.auctionReservePrice
                        ? formatCostSuffix(marker.auctionReservePrice * 10000000)
                        : "₹40 L",
                      false
                    )
                  ),
        }).on("click", (function(markerData) {
          return () => handleMarkerClick(markerData);
        })(marker));

        leafletMarker.bindTooltip(
          `<span class='font-bold font-lato text-[14px]'>${toCapitalizedWords(
            marker.projectName
          )}</span>`,
          {
            direction: "top",
            sticky: true,
          }
        );

        markersGroup.addLayer(leafletMarker);
      });

      map.addLayer(markersGroup);
      return () => {
        map.removeLayer(markersGroup);
      };
    }, [
      map,
      markers,
      selectedProject,
      isAuction,
      getLeafletIcons,
      handleMarkerClick,
    ]);

    return null;
  });

  const Markers = React.memo(({ markers }) => {
    const map = useMap();

    useEffect(() => {
      const markersGroup = L.layerGroup();

      const updateMarkersVisibility = () => {
        const currentZoom = map.getZoom();
        setZoomLevel(currentZoom);

        const CurrentCenter = map.getCenter();

        if (
          currentProjectCenter[0] !== CurrentCenter?.locationAnalysis?.lat ||
          currentProjectCenter[1] !== CurrentCenter?.locationAnalysis?.lng
        ) {
          setCurrentProjectCenter([CurrentCenter?.locationAnalysis?.lat, CurrentCenter?.locationAnalysis?.lng]);
        }

        if (currentZoom >= 13) {
          markersGroup.clearLayers(); // Clear existing markers
          markers.forEach((marker) => {
            const leafletMarker = L.marker(
              [marker.coordinates.latitude, marker.coordinates.longitude],
              {
                icon: new L.icon({
                  iconUrl: MetroIcon,
                  iconSize: [20, 20],
                }),
              }
            );
            leafletMarker.bindTooltip(
              `<span class='font-bold font-lato text-[12px]'>${marker.name}</span>`
            );
            markersGroup.addLayer(leafletMarker);
          });
        } else {
          markersGroup.clearLayers(); // Clear markers when zoom is less than 13
        }
      };

      map.addLayer(markersGroup);
      map.on("zoomend", updateMarkersVisibility);
      map.on("moveend", updateMarkersVisibility);
      updateMarkersVisibility();

      return () => {
        map.off("zoomend", updateMarkersVisibility);
        map.off("moveend", updateMarkersVisibility);
        map.removeLayer(markersGroup);
      };
    }, [map, markers]);

    return null;
  });

  // Memoized event handlers for micromarkets
  const onMouseOver = useCallback((event) => {
    event.target.bringToFront();
    event.target.setStyle({
      color: "orange",
      fillColor: "orange",
      weight: 2,
    });
  }, []);

  const onMouseOut = useCallback((event) => {
    event.target.bringToBack();
    event.target.setStyle({
      color: "black",
      weight: 1.5,
      fillColor: "ffcccb",
      opacity: 1,
      fillOpacity: 0.1,
    });
  }, []);

  const onMouseClick = useCallback((event) => {
    event.target.setStyle({
      color: "orange",
      weight: 3,
    });
  }, []);

  const onEachFeature = useCallback(
    (feature, layer) => {
      layer.bindTooltip(
        `<span class='font-bold font-lato text-[14px]'>${feature.properties.Micromarket}</span>`,
        {
          direction: "left",
        }
      );

      layer.on({
        mouseover: onMouseOver,
        mouseout: onMouseOut,
        click: onMouseClick,
      });
    },
    [onMouseOver, onMouseOut, onMouseClick]
  );

  // Check if we should show reset button
  const shouldShowResetButton = useMemo(() => {
    return (
      zoomLevel !== 13 ||
      currentProjectCenter[0] !== defaultProjectCenter[0] ||
      currentProjectCenter[1] !== defaultProjectCenter[1]
    );
  }, [zoomLevel, currentProjectCenter, defaultProjectCenter]);

  if (hits.length === 0 && !loading && !isBda) {
    return (
      <NoPropertiesFound
        trueS={trueS}
        onResetFilters={() => {
          resetAllFilters();
          logEvent(analytics, `click_reset_map_property`, {
            Name: `chng_reset_map_property`,
          });
        }}
      />
    );
  }

  return (
    <>
      {(updatedProjects && updatedProjects.length > 0) || isBda ? (
        <section className="relative px-1 md:px-4 py-2 md:px-5">
          {/* Mobile: Show enable zoom button */}
          {!isZoomEnabled && !shouldDisableClickToZoom && isMobile && (
            <button
              onClick={handleEnableZoom}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1] bg-white text-black text-semi-bold px-4 py-2 rounded-md shadow-md transition-colors"
            >
              <span className="text-sm">Click to Explore</span>
            </button>
          )}

          {/* Desktop: Show click to enable zoom message */}
          {!isZoomEnabled && !shouldDisableClickToZoom && !isMobile && (
            <div className="absolute top-4 left-4 z-[1] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md shadow-md pointer-events-none">
              <span className="text-sm text-gray-700">
                Click on map to enable zoom
              </span>
            </div>
          )}

          {shouldShowResetButton && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleReset();
              }}
              className={`absolute right-3 vs:top-6 vs:right-2 sr:top-6 sr:right-2 md:right-6 sl:top-7 sl:right-2 top-5 z-[1] font-lato text-[1rem] bg-white px-3 py-1 rounded-md shadow-md hover:bg-gray-50 transition-colors ${
                finalMapStyle.width === "90%" ? "" : ""
              }`}
              style={
                {
                  // right: finalMapStyle.width === '90%' ? '10%' : '4px'
                }
              }
            >
              <div className="flex gap-2 items-center">
                <span>Reset</span>
                <img src={resetIcon} alt="reset" className="w-4 h-4" />
              </div>
            </button>
          )}

          <MapContainer
            center={defaultProjectCenter}
            zoom={13}
            style={finalMapStyle}
            key={isReset ? Date.now() : "map"}
            scrollWheelZoom={getZoomProps.scrollWheelZoom}
            doubleClickZoom={getZoomProps.doubleClickZoom}
            touchZoom={getZoomProps.touchZoom}
            boxZoom={getZoomProps.boxZoom}
            keyboard={getZoomProps.keyboard}
          >
            <ZoomController />
            {isReset && <ResetMapView />}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {mapType === "all" && micromarketsData && (
              <GeoJSON
                data={micromarketsData}
                style={micromarketsStyle}
                onEachFeature={onEachFeature}
              />
            )}

            <ClusteredMarkers markers={updatedProjects} />
            <Markers markers={metroData} />
          </MapContainer>
        </section>
      ) : null}

      {results.nbHits === 0 && status === "idle" && !isBda && (
        <NoPropertiesFound
          trueS={trueS}
          onResetFilters={resetAllFilters}
        />
      )}

      {(status === "loading" || status === "stalled" || isReduxLoading) && (
        <div className="flex h-[40vh] z-[97]">
          <Loader />
        </div>
      )}

      {!isAuthenticated && location.pathname === "/properties" && (
        <div className="mt-10">
          <Footer />
        </div>
      )}
    </>
  );
};

export default MapComponent;
