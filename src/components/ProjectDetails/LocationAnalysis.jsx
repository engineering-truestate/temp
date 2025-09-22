import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Map from '../Map/Map';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import styles from './ProjectDetails.module.css';
import loc from '/assets/icons/ui/info.svg';
import Dropdown from '../Dropdown'; //

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationAnalysis = ({ project, isAuction=false }) => {

  const [selectedFilter, setSelectedFilter] = useState({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  const scrollRef = useRef(null);

  const handleScroll = () => {
    const scrollLeftPos = scrollRef.current.scrollLeft;
    const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;

    setCanScrollLeft(scrollLeftPos > 0);

    setCanScrollRight(scrollLeftPos < maxScrollLeft);

    setCanScrollRight(scrollLeftPos < maxScrollLeft - 2);

  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check

      return () => {
        if (scrollRef.current) {
          scrollRef.current.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, []);

  return (
    <div className=" rounded mt-9 mb-9  lg:mt-12 lg:mb-12">
      <h2 className={`${styles.legalTitle}  mb-3`}>Location</h2>
      {project.locationAnalysis.location  &&
        <AddressWithToggle project={project} loc={loc} styles={styles}/>
      }
      <Map projects={[{ ...project }]} mapType={"individual"} isAuction={isAuction} />
    </div>
  );
};

const AddressWithToggle = ({ project, loc, styles }) => {
  const [isTruncated, setIsTruncated] = useState(true); // State to toggle truncation

  const tooLong = (project.locationAnalysis.location > 50);

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  return (
    <div 
      className={`flex mb-6 ${isTruncated ? "items-center" : "items-start"} ${tooLong ? "cursor-pointer" : ""}`}
      onClick={toggleTruncate}
    >
      <img src={loc} alt="" className="mr-1" />
      <p className={`${styles.location1} ${isTruncated ? "truncate" : ""}`}>
        {project.locationAnalysis.location}
      </p>
    </div>
  );
};

export default LocationAnalysis;
