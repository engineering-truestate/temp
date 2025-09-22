import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Breadcrumb.css';
import {
  customRound,
  formatCost,
  formatCostSuffix,
  formatMonthYear,
  formatTimestampDate,
  formatToOneDecimal,
  toCapitalizedWords,
  upperCaseProperties,
} from "../../utils/common.js";

const Breadcrumb = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Split the pathname into its segments
  const pathSegments = pathname.split('/').filter(Boolean);

  const idRegex = /^[A-Za-z0-9\-]+$/;

  // Check if the last segment is an ID
  const isLastSegmentId = idRegex.test(pathSegments[pathSegments.length - 1]);

  return (
    <nav aria-label="breadcrumb">
      <ul className="breadcrumb">
        {pathSegments.map((segment, index) => {

           if (isLastSegmentId && index === pathSegments.length - 1) {
            return null;
          }

          const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
          // If the last segment is an ID, make the second-last segment the last breadcrumb item
          const isLast = isLastSegmentId && index === pathSegments.length - 2 ? true : index === pathSegments.length - 1;
         
          // Replace "main" with "Properties" but keep other segments intact

          let displaySegment = segment.toLowerCase() === 'main' ? 'Properties' : segment.charAt(0).toUpperCase() + segment.slice(1).split("%20").join(" ");
       
         displaySegment = displaySegment.toLowerCase() ;
        //  console.log(displaySegment);
         displaySegment = Object.keys(upperCaseProperties).includes(displaySegment) ? upperCaseProperties[displaySegment] : toCapitalizedWords(displaySegment)  ;

          return (
            <li key={path} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
              {isLast ? (
                <>
                  {displaySegment}
                </>
              ) : (
                <>
                  <Link to={path}>{displaySegment}</Link>
                  <span className="separator">{' > '}</span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
