import { useNavigate } from 'react-router-dom';
import { formatCost, toCapitalizedWords } from '../../utils/common.js';
import styles from './Compare.module.css';
import crossCompare from '/assets/icons/features/compare-remove.svg';
import AddProperty from '../Compare/AddProperty.png';

const cardpic = '/assets/properties/images/placeholder.webp';

const CompareTableDesktop = ({ 
  projects, 
  onRemoveProject, 
  onViewDetails, 
  maxCompareItems 
}) => {
  const navigate = useNavigate();
  
  const tableColumns = [
    'XIRR', 'CAGR (4 yrs)', 'Current Price', 'Price/ Sq ft', 
    'TruEstimate', 'Area', 'Micromarket', 'Configuration', 'Stage'
  ];

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
    });

    return `${formatCost2(minPrice)} - ${formatCost2(maxPrice)}`;
  };

  const handleFieldToValue = (field, project) => {
    switch (field) {
      case 'XIRR':
        return project.investmentOverview?.xirr != null && project.investmentOverview.xirr !== 'undefined'
          ? `${project.investmentOverview.xirr}%`
          : 'Not Available';
      case 'Micromarket':
        return toCapitalizedWords(project.micromarket);
      case 'CAGR (4 yrs)':
        return project.cagr != null && project.cagr !== 'undefined' && project.cagr !== 'Not Available'
          ? `${project.cagr}%`
          : 'Not Available';
      case 'Price/ Sq ft':
        return `${formatCost(project.commonPricePerSqft)}/ Sq ft`;
      case 'Current Price':
        return findCurrentPriceRange(project.data);
      case 'Area':
        return toCapitalizedWords(project.area);
      case 'Configuration':
        return project.configurations.join(", ");
      case 'Stage':
        return toCapitalizedWords(project.status);
      case 'Duration':
        return `${project.holdingPeriod} Years`;
      case 'TruEstimate':
        return project.truEstimate != null && project.truEstimate !== 'undefined' && project.truEstimate !== 'Not Available'
          ? `${formatCost(project.truEstimate)}/ Sq ft`
          : 'Not Available';
      default:
        return field;
    }
  };

  const renderAddPropertySlot = (index) => (
    <div key={`add-${index}`} className={`flex relative flex-col items-center mt-[20px] ${styles.addPropertyContainer}`}>
      <div className="flex flex-col items-center sticky top-1/2 -translate-y-20">
        <img src={AddProperty} alt="Add Project" className="rounded-lg mb-[12px]" />
        <div className='w-[113px] font-lato text-[12px] leading-[18px] text-center text-black'>
          Add a project to compare
        </div>
        <button
          className="rounded-[4px] py-2 px-4 bg-[#153E3B] text-white text-[14px] mt-2"
          onClick={() => navigate('/properties')}
        >
          Go To Properties
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative flex justify-between items-start">
      <div className="mt-2 flex px-8">
        <table className={`rounded-lg table-fixed ${styles.tableContainer}`}>
          <thead>
            <tr className="first-row">
              <th className={`py-2 px-4 border-b border-gray-300 ${styles.headerCell}`}></th>
              {projects.map((project, index) => (
                <th key={index} className={`relative ${styles.theadclass} ${styles.projectColumn}`}>
                  <img
                    src={crossCompare}
                    alt="Remove Project"
                    className={`absolute top-0 right-0 mt-0.5 mr-1 cursor-pointer ${styles.imgRemove}`}
                    onClick={() => onRemoveProject(project.id)}
                  />
                  <div className={`flex flex-col items-center relative ${styles.projectImageContainer}`}>
                    <div className='relative w-full h-[7.5rem] flex items-center justify-center overflow-hidden'>
                      <div
                        className="absolute z-0 bg-center bg-cover h-[7.5rem] w-[90%]"
                        style={{
                          backgroundImage: `url(${project.images?.length > 0 ? project.images[0] : cardpic})`,
                          filter: "blur(20px)",
                        }}
                      ></div>
                      <img
                        src={project.images?.length > 0 ? project.images[0] : cardpic}
                        alt={project.projectName}
                        className="relative z-1 object-contain h-[7.5rem] w-auto"
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
                <td className={`py-2 px-4 border border-gray-300 text-base sm:text-sm ${styles.fieldColumn}`}>
                  {field}
                </td>
                {projects.map((project, colIndex) => (
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
              <td className="sticky bottom-0 py-2 px-4 border border-gray-300 text-base sm:text-sm"></td>
              {projects.map((project, index) => (
                <td key={index} className={`sticky bottom-0 border border-gray-300 py-2 px-4 text-center ${styles.btn1}`}>
                  <button 
                    className={`rounded-[4px] sticky bottom-0 mt-2 mb-2 ${styles.btn}`} 
                    onClick={() => onViewDetails(project)}
                  >
                    Check Details
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        
        {/* Render add property slots for remaining spaces */}
        {projects.length < maxCompareItems &&
          Array.from({ length: maxCompareItems - projects.length }).map((_, index) =>
            renderAddPropertySlot(index)
          )}
      </div>
    </div>
  );
};

export default CompareTableDesktop;