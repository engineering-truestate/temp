import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCompareProjects, selectCompareProjects, removeProjectFromComparison } from '../../slices/compareSlice';
import styles from './Compare.module.css';
import emptyImage from '../Compare/Compare.png';
import crossCompare from '/assets/icons/features/compare-remove.svg'; // Import your SVG icon
const cardpic = '/assets/properties/images/placeholder.webp';
import searchimage from '../Compare/searchimage.png';
import AddProperty from '../Compare/AddProperty.png';
import addProperty from '/assets/icons/actions/add-property.svg';
import compareimage from "./compare-image.png"
import addicon from "/images/addicon_compare.png"
import { useToast } from "../../hooks/useToast.jsx";
import { formatCost, toCapitalizedWords } from '../../utils/common.js';
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";

const ComparePage = () => {
  const dispatch = useDispatch();
  const compareProjects = useSelector(selectCompareProjects);
  const [isMobile, setIsMobile] = useState(false);
  const { addToast } = useToast(); // Access the toast function

  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/properties'); // Replace '/' with the correct path for MainContent.jsx
  };

  const handleadd = () => {
    navigate('/compare/addcompare');
  };


  useEffect(() => {
    dispatch(fetchCompareProjects());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRemoveProject = (id) => {
    try {
      dispatch(removeProjectFromComparison(id));
      dispatch(fetchCompareProjects());
      addToast("Dummy", "error", "Property Removed from Compare", "The property has been removed from the compare list.");
    } catch (error) {
      addToast("Dummy", "error", "Compare Action Failed", "You are offline or there's an issue updating the compare list. Please try again.");
    }

  };

  const tableColumns = ['XIRR', 'CAGR (4 yrs)', 'Current Price', 'Price/ Sq ft', 'TruEstimate', 'Area', 'Micromarket', 'Configuration', 'Stage'];

  const formatCost2 = (cost) => {
    if (cost >= 10000000) {
      return `₹${(cost / 10000000).toFixed(2)} Cr`;
    } else if (cost >= 100000) {
      return `₹${(cost / 100000).toFixed(0)} Lacs`;
    } else {
      return `₹${cost}`;
    }
  };

  const findCurrentPriceRange = (data) => {
    let minPrice = 1000000000;
    let maxPrice = 0;
    data.map((d) => {
      let price = d.totalPrice;
      if (price < minPrice) {
        minPrice = price;
      }
      if (price > maxPrice) {
        maxPrice = price;
      }
    })

    return `${formatCost2(minPrice)} - ${formatCost2(maxPrice)}`;
  }

  const handleFieldToValue = (field, project) => {
    if (field === 'XIRR') {
  return project.investmentOverview?.xirr != null && project.investmentOverview.xirr !== 'undefined'
         ? `${project.investmentOverview.xirr}%`
         : 'Not Available';
} else if (field === 'Micromarket') {
      return toCapitalizedWords(project.micromarket);
    }else if (field === 'CAGR (4 yrs)') {
  return project.cagr != null && project.cagr !== 'undefined' && project.cagr !== 'Not Available'
         ? `${project.cagr}%`
         : 'Not Available';
} else if (field === 'Price/ Sq ft') {
      return `${formatCost(project.commonPricePerSqft)}/ Sq ft`;
    } else if (field === 'Current Price') {
      return findCurrentPriceRange(project.data);
    } else if (field === 'Area') {
      return toCapitalizedWords(project.area);
    } else if (field === 'Configuration') {
      return project.configurations.join(", ");
    } else if (field === 'Stage') {
      return toCapitalizedWords(project.status);
    } else if (field === 'Duration') {
      return `${project.holdingPeriod} Years`;
    } else if (field === 'TruEstimate') {
  return project.truEstimate != null && project.truEstimate !== 'undefined' &&  project.truEstimate !== 'Not Available'
         ? `${formatCost(project.truEstimate)}/ Sq ft`
         : 'Not Available';
}

    return field;
  };

  const renderDesktopView = () => {
    const maxCompareItems = 4; // Maximum number of properties to compare
    const projectsToShow = compareProjects.slice(0, maxCompareItems);

    return (
      <div className="bg-gray rounded">
        {projectsToShow.length === 0 ? (
          <div className={`fixed top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 ${styles.emptyPageDiv}`}>
            <img src={emptyImage} alt="No Projects" className={styles.emptyImage} />
            <div className={`${styles.emptyContent}`}>
              <div className={` ${styles.secondarydiv}`}>
                <h2 className={`${styles.projname}`}>No Projects Added Currently</h2>
                <p className={` ${styles.tertiarydiv}`}>Add a project to compare</p>
              </div>
              <button onClick={() => {
                handleButtonClick()
                logEvent(analytics,"click_compare_go_to_prop",{Name:"_compare_gotoproperties"}) 
               }} className={styles.emptyButton}>Go to Properties Page</button>
            </div>
          </div>
        ) : (
          <div className="relative flex justify-between items-start  ">
            <div className=" mt-2 flex  px-8">
              <table
                className={`rounded-lg table-fixed ${styles.tableContainer} `}

              >
                <thead>
                  <tr className="first-row">
                    <th className={`py-2 px-4 border-b border-gray-300 ${styles.headerCell}`}></th>
                    {projectsToShow.map((project, index) => (
                      <th key={index} className={`relative  ${styles.theadclass} ${styles.projectColumn}`}>
                        <img
                          src={crossCompare}
                          alt="Remove Project"
                          className={`absolute top-0 right-0 mt-0.5 mr-1 cursor-pointer ${styles.imgRemove}`}
                          onClick={() => {
                            handleRemoveProject(project.id)
                            logEvent(analytics, "click_compare_remove_prop", { Name: "_compare_remove property" })
                            
                          }}
                        />
                        <div className={`flex flex-col items-center relative ${styles.projectImageContainer}`}>
                          <div className='relative w-full h-[7.5rem] flex items-center justify-center overflow-hidden'>
                            <div
                              className="absolute z-0 bg-center bg-cover h-[7.5rem] w-[90%]"
                              style={{
                                backgroundImage: `url(${project.images.length > 0 ? project.images[0] : cardpic})`,
                                filter: "blur(20px)", // Adjust the blur level as needed
                              }}
                            ></div>
                            <img
                              src={project.images.length > 0 ? project.images[0] : cardpic}
                              alt={project.projectName}
                              className={`relative z-1 object-contain  h-[7.5rem] w-auto`}
                            />
                          </div>
                          <span className={`${styles.projname} text-base sm:text-sm`}>
                            {toCapitalizedWords(project.projectName)}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableColumns.map((field, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className={`py-2 px-4 border border-gray-300 text-base sm:text-sm ${styles.fieldColumn}`}>{field}</td>
                      {projectsToShow.map((project, colIndex) => (
                        <td
                          key={colIndex}
                          className={`py-4 px-4 text-center text-base sm:text-sm border border-gray-300 ${styles.projectValueCell}`}
                        >
                          <div>{handleFieldToValue(field, project) || '____'}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className={`z-10 bottom-0 sticky ${styles.targetedrow}`}>
                    <td className="sticky bottom-0 py-2 px-4 border border-gray-300 text-base sm:text-sm "></td> {/* Empty first cell */}
                    {projectsToShow.map((project, index) => (
                      <td key={index} className={`sticky bottom-0 border border-gray-300 py-2 px-4 text-center  ${styles.btn1} `}>
                        <button className={` rounded-[4px] sticky bottom-0 mt-2 mb-2 ${styles.btn}`} onClick={() => {
                          handleViewMore(project)
                          logEvent(analytics, "click_compare_check_details", { Name: "compare_check_details" })
                        }
                        }>
                          Check Details
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              {projectsToShow.length < maxCompareItems &&
                Array.from({ length: maxCompareItems - projectsToShow.length }).map((_, index) => (
                  <div key={index} className={`flex relative flex-col items-center mt-[20px] ${styles.addPropertyContainer} `} >
                    <div className={`flex flex-col items-center sticky top-1/2 -translate-y-20`}>
                      <img src={AddProperty} alt="Add Project" className={`rounded-lg mb-[12px]`} />
                      <div className='w-[113px] font-lato text-[12px] leading-[18px] text-center text-black'>
                        Add a project to compare
                      </div>
                      <button
                        className={`rounded-[4px] py-2 px-4 bg-[#153E3B] text-white text-[14px] mt-2`}
                        onClick={() => { navigate('/properties') }}
                      >
                        Go To Properties
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const { projects, lastVisible, batchCount, loading, noMoreProjects } = useSelector(state => state.projectsState);
  const handleViewMore = (project) => {
    const projectName = project.projectName.replace(/\s+/g, '-');   // Encodes special characters
    navigate(`/properties/${project.projectName}`, { state: { name: project.projectName } });
  };

  const renderMobileView = () => {
    const maxCompareItems = 4; // Maximum number of properties to compare
    const projectsToShow = compareProjects.slice(0, maxCompareItems);


    return (
      <div className=" bg-gray rounded px-4 md:px-0 " >
        {projectsToShow.length === 0 ? (
          <div className={`fixed top-[60%] left-[50%] transform -translate-x-1/2 -translate-y-1/2  ${styles.emptyPageDiv}`}>
            <img src={emptyImage} alt="No Projects" className={styles.emptyImage} />
            <div className={`${styles.emptyContent}`}>
              <div className={` ${styles.secondarydiv}`}>
                <h2 className={`${styles.projname}`}>No Projects Added Currently</h2>
                <p className={` ${styles.tertiarydiv}`}>Add a project to compare</p>
              </div>

              <button onClick={handleButtonClick} className={styles.emptyButton}>Go to Properties Page</button>
            </div>
          </div>
        ) : (
          <div className='relative'  >
            <div >
              <img src={addicon} onClick={handleadd} className=' fixed bottom-16 right-0 w-12 h-12 z-50' />
            </div>
            <div className="relative flex"  >
              <table className={`relative table-auto md:border-2  ${styles.tableclass} `}>
                <thead>
                  <tr>
                    {projectsToShow.map((project, index) => (
                      <th key={index} className="relative w-60 ">
                        <img
                          src={crossCompare}
                          alt="Remove Project"
                          className=" ml-auto  mt-2 cursor-pointer"
                          onClick={() => handleRemoveProject(project.id)}
                          style={{ width: '24px', height: '24px' }}
                        />
                        <div className="relative ">

                          {/* <img
                            src={project.images.length > 0 ? project.images[0] : cardpic}
                            alt={project.project_name}
                            className=" mx-auto h-24 object-fit rounded-lg p-1"
                          /> */}
                          <div className='relative mx-auto w-[90%] h-24 flex items-center justify-center overflow-hidden'>
                            <div
                              className="absolute z-0 bg-center bg-cover h-24 w-[90%]"
                              style={{
                                backgroundImage: `url(${project.images.length > 0 ? project.images[0] : cardpic})`,
                                filter: "blur(20px)", // Adjust the blur level as needed
                              }}
                            ></div>
                            <img
                              src={project.images.length > 0 ? project.images[0] : cardpic}
                              alt={project.projectName}
                              className={`relative z-1 object-contain  h-24 w-auto`}
                            />
                          </div>
                          <div >
                            <div className={`mt-2 mb-2  ${styles.projname}   ${styles.multi}`}>
                              {toCapitalizedWords(project.projectName)}
                            </div>
                          </div>

                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableColumns.map((field, rowIndex) => (
                    <tr key={rowIndex}>

                      {projectsToShow.map((project, colIndex) => (
                        <td
                          key={colIndex}
                          className={`py-2 px-4 text-center border border-gray-300 ${styles.tdclass}`}
                        >
                          <div className={`${styles.h1}`}>{field}</div>
                          <div className={`${styles.h2}`}>{handleFieldToValue(field, project) || '____'}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* <tr className={`z-10 bottom-0 sticky ${styles.targetedrow}`}>
                    {projectsToShow.map((project, index) => (
                      <td key={index} className={`py-2 px-4 text-center  ${styles.btn1} `}>
                        <button className={` rounded-[4px] sticky bottom-0 mt-2 mb-2 ${styles.btn}`} onClick={() => handleViewMore(project)}>
                          Check Details
                        </button>
                      </td>
                    ))}
                  </tr> */}
                </tbody>
              </table>
            </div>

            {/* Sticky button row moved outside the table */}
            <div className={`sticky bottom-0  bg-white w-full ${styles.targetedrow}`}   >
              <div className="flex justify-between bg-[#FAFAFA] w-fit  py-2">
                {projectsToShow.map((project, index) => (
                  <div className='  min-w-[180px] flex justify-center items-center'>
                    <button
                      key={index}
                      className={`rounded-[4px] py-2 px-4 ${styles.btn} min-w-[144px] `}
                      onClick={() => handleViewMore(project)}
                    >
                      Check Details
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

    );

  };

  return isMobile ? renderMobileView() : renderDesktopView();
};

export default ComparePage;
