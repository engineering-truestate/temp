import { formatCost, toCapitalizedWords } from "../../utils/common.js";
import styles from "./Compare.module.css";
import crossCompare from "/assets/icons/features/compare-remove.svg";
import addicon from "/images/addicon_compare.png";

const cardpic = "/assets/properties/images/placeholder.webp";

const CompareTableMobile = ({
  projects,
  onRemoveProject,
  onViewDetails,
  onNavigateToAddCompare,
}) => {
  const tableColumns = [
    "XIRR",
    "CAGR (4 yrs)",
    "Current Price",
    "Price/ Sq ft",
    "TruEstimate",
    "Area",
    "Micromarket",
    "Configuration",
    "Stage",
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
      case "XIRR":
        return project.investmentOverview?.xirr != null &&
          project.investmentOverview.xirr !== "undefined"
          ? `${project.investmentOverview.xirr}%`
          : "Not Available";
      case "Micromarket":
        return toCapitalizedWords(project.micromarket);
      case "CAGR (4 yrs)":
        return project.cagr != null &&
          project.cagr !== "undefined" &&
          project.cagr !== "Not Available"
          ? `${project.cagr}%`
          : "Not Available";
      case "Price/ Sq ft":
        return `${formatCost(project.commonPricePerSqft)}/ Sq ft`;
      case "Current Price":
        return findCurrentPriceRange(project.data);
      case "Area":
        return toCapitalizedWords(project.area);
      case "Configuration":
        return project.configurations.join(", ");
      case "Stage":
        return toCapitalizedWords(project.status);
      case "Duration":
        return `${project.holdingPeriod} Years`;
      case "TruEstimate":
        return project.truEstimate != null &&
          project.truEstimate !== "undefined" &&
          project.truEstimate !== "Not Available"
          ? `${formatCost(project.truEstimate)}/ Sq ft`
          : "Not Available";
      default:
        return field;
    }
  };

  return (
    <div className="bg-gray rounded  md:px-0">
      <div className="relative">
        {/* Floating Add Button */}
        <div>
          <img
            src={addicon}
            onClick={onNavigateToAddCompare}
            className="fixed bottom-16 right-0 w-12 h-12 z-50 cursor-pointer"
          />
        </div>

        {/* Table Container */}
        <div className="relative flex">
          <table
            className={`relative table-auto md:border-2 ${styles.tableclass}`}
          >
            <thead>
              <tr>
                {projects.map((project, index) => (
                  <th key={index} className="relative w-60">
                    <img
                      src={crossCompare}
                      alt="Remove Project"
                      className="ml-auto mt-2 cursor-pointer"
                      onClick={() => onRemoveProject(project.id)}
                      style={{ width: "24px", height: "24px" }}
                    />
                    <div className="relative">
                      {/* Project Image with Blur Background */}
                      <div className="relative mx-auto w-[90%] h-24 flex items-center justify-center overflow-hidden">
                        <div
                          className="absolute z-0 bg-center bg-cover h-24 w-[90%]"
                          style={{
                            backgroundImage: `url(${
                              project.images?.length > 0
                                ? project.images[0]
                                : cardpic
                            })`,
                            filter: "blur(20px)",
                          }}
                        ></div>
                        <img
                          src={
                            project.images?.length > 0
                              ? project.images[0]
                              : cardpic
                          }
                          alt={project.projectName}
                          className="relative z-1 object-contain h-24 w-auto"
                        />
                      </div>

                      {/* Project Name */}
                      <div>
                        <div
                          className={`mt-2 mb-2 ${styles.projname} ${styles.multi}`}
                        >
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
                  {projects.map((project, colIndex) => (
                    <td
                      key={colIndex}
                      className={`py-2 px-4 text-center border border-gray-300 ${styles.tdclass}`}
                    >
                      <div className={styles.h1}>{field}</div>
                      <div className={styles.h2}>
                        {handleFieldToValue(field, project) || "____"}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="sticky -bottom-2 bg-white z-10">
                {projects.map((project, index) => (
                  <td
                    key={index}
                    className="py-2 px-4 text-center border border-gray-300"
                  >
                    <button
                      className={`rounded-[4px] py-2 px-4 ${styles.btn}`}
                      onClick={() => onViewDetails(project)}
                    >
                      Check Details
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompareTableMobile;
