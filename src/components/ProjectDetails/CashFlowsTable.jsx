import React from "react";
import styles from "./ProjectDetails.module.css";
import { formatCost } from "../../utils/common";
import lock from "/assets/icons/ui/info.svg";
import { useDispatch, useSelector } from "react-redux";
import { setShowSignInModal } from "../../slices/modalSlice.js";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";

const CashFlowsTable = ({ data, data2, isMobile, isAuthenticated = true }) => {
  const dispatch = useDispatch();

  // Process API response data for authenticated users
  const processApiData = (apiData) => {
    if (!apiData || !apiData.monthly_cf) return null;

    // Extract years from cashflows_yearly or derive from monthly_cf
    const years = apiData.cashflows_yearly ? 
      apiData.cashflows_yearly.map((_, index) => new Date().getFullYear() + index) :
      [...new Set(apiData.monthly_cf.map(month => new Date(month[0]).getFullYear()))].sort();

    // Initialize rows structure
    let rows = [
      { header: "Down Payment / Extra Charges", values: new Array(years.length).fill(0) },
      { header: "Interest", values: new Array(years.length).fill(0) },
      { header: "Principal", values: new Array(years.length).fill(0) },
      { header: "EMI Payments", values: new Array(years.length).fill(0) },
      { header: "Payment to Builder", values: new Array(years.length).fill(0) },
      { header: "Sale Proceeds", values: new Array(years.length).fill(0) },
      { header: "Loan Repayment At Sale", values: new Array(years.length).fill(0) },
      { header: "Stamp Duty / Transfer Fees", values: new Array(years.length).fill(0) },
      { header: "Total", values: apiData.cashflows_yearly || new Array(years.length).fill(0) },
    ];

    // Process monthly_cf data
    apiData.monthly_cf.forEach((monthData) => {
      const monthDate = new Date(monthData[0]); // Month is at index 0
      const year = monthDate.getFullYear();
      const yearIndex = years.indexOf(year);

      if (yearIndex >= 0) {
        // Interest (index 4 in monthly_cf)
        const interest = parseFloat(monthData[4]) || 0;
        if (interest > 0) {
          rows[1].values[yearIndex] -= interest;
        }

        // Principal (index 5 in monthly_cf)  
        const principal = parseFloat(monthData[5]) || 0;
        if (principal > 0) {
          rows[2].values[yearIndex] -= principal;
        }

        // EMI (index 3 in monthly_cf)
        const emi = parseFloat(monthData[3]) || 0;
        if (emi > 0) {
          rows[3].values[yearIndex] -= emi;
        }

        // Builder Amount (index 7 in monthly_cf)
        const builderAmount = parseFloat(monthData[7]) || 0;
        if (builderAmount > 0) {
          rows[4].values[yearIndex] -= builderAmount;
        }

        // Process other cash flows (index 2 in monthly_cf)
        if (monthData[2] && monthData[2].components && Array.isArray(monthData[2].components)) {
          monthData[2].components.forEach(component => {
            const lowerComponent = component.toLowerCase();
            
            // Down payment and booking amounts
            if (lowerComponent.includes('down payment') || lowerComponent.includes('booking') || lowerComponent.includes("builder's remaining")) {
              const matches = component.match(/₹([\d,]+)/);
              if (matches) {
                const amount = parseFloat(matches[1].replace(/,/g, ''));
                rows[0].values[yearIndex] -= amount;
              }
            }
            
            // Stamp duty and registration charges
            if (lowerComponent.includes('stamp duty') || lowerComponent.includes('registration') || lowerComponent.includes('possession amount')) {
              const matches = component.match(/₹([\d,]+)/);
              if (matches) {
                const amount = parseFloat(matches[1].replace(/,/g, ''));
                rows[7].values[yearIndex] -= amount;
              }
            }
            
            // Sale proceeds
            if (lowerComponent.includes('selling price')) {
              const matches = component.match(/₹([\d,]+)/);
              if (matches) {
                const amount = parseFloat(matches[1].replace(/,/g, ''));
                rows[5].values[yearIndex] += amount;
              }
            }
            
            // Loan repayment at sale
            if (lowerComponent.includes('loan repayment at sale')) {
              const matches = component.match(/₹([\d,]+)/);
              if (matches) {
                const amount = parseFloat(matches[1].replace(/,/g, ''));
                rows[6].values[yearIndex] -= amount;
              }
            }
          });
        }
      }
    });

    return { rows, years };
  };

  // Mock data for unauthenticated users
  const getMockData = () => {
    const years = [2025, 2026, 2027, 2028, 2029];
    const rows = [
      {
        header: "Down Payment / Extra Charges",
        values: [-1003520, null, null, null, null],
      },
      {
        header: "Interest",
        values: [-90236.85, -347044.18, -521853.81, -618111.23, -54862.46],
      },
      {
        header: "Principal", 
        values: [-21672.8, -90871.55, -151657.21, -200557.29, -18885.36],
      },
      {
        header: "EMI Payments",
        values: [-111909.67, -437915.77, -673511.01, -818668.51, -73747.83],
      },
      {
        header: "Payment to Builder",
        values: [0, 0, 0, 0, -821632],
      },
      {
        header: "Sale Proceeds",
        values: [0, 0, 0, 0, 14639181],
      },
      {
        header: "Loan Repayment At Sale",
        values: [0, 0, 0, 0, -7726404],
      },
      {
        header: "Stamp Duty / Transfer Fees",
        values: [0, 0, 0, 0, -200704],
      },
      {
        header: "Total",
        values: [-1115429.66, -437915.74, -673511.01, -818668.51, 5816693.4],
      },
    ];
    return { rows, years };
  };

  // Use appropriate data based on authentication
  const { rows, years } = isAuthenticated ? 
    processApiData(data) || getMockData() : 
    getMockData();

  const shortMonth = new Date().toLocaleString("default", { month: "short" });
  const prevShortMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toLocaleString("default", { month: "short" });
  const endIndex = years.length - 1;

  return (
    <>
      {isAuthenticated ? (
        <div>
          <h1 className={`${styles.heading11}`}>Cash Flows</h1>
          <div className="border border-[#CCCBCB] rounded-lg mt-6 overflow-x-auto">
            <div className="overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              <table
                className={`max-w-full w-full text-nowrap ${styles.cashflowtable}`}
              >
                <thead>
                  <tr>
                    <th
                      className={`sm:min-w-[10vw] min-w-[30vw] px-3 py-2 border-b border-gray-300 text-left tracking-wider border-r-2 ${styles.font1} ${!isMobile && styles.fixedcolumn}`}
                    >
                      Category
                    </th>
                    {years.map((year, index) => (
                      <th
                        key={index}
                        className={`sm:min-w-[10vw] min-w-[30vw] px-3 py-3 border-b border-[#CCCBCB] text-right font-semibold tracking-wider ${styles.doctext}`}
                      >
                        {index === 0
                          ? `${shortMonth} - Dec ${year}`
                          : index === endIndex
                            ? `Jan - ${prevShortMonth} ${year}`
                            : `Jan - Dec ${year}`}
                      </th>
                    ))}
                    <th
                      className={`sm:min-w-[10vw] min-w-[30vw] px-3 py-2 border-b border-gray-300 text-right tracking-wider border-r-2 ${styles.font1} ${!isMobile && styles.fixedcolumn}`}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows &&
                    rows.length > 0 &&
                    rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={`${rowIndex === rows.length - 1 ? "rounded-b-lg" : ""} ${rowIndex === 0 ? styles.fixedrow : ""}`}
                      >
                        <td
                          className={`sm:min-w-[10vw] min-w-[30vw] border-b border-gray-200 text-left tracking-wider px-3 py-2 ${styles.font1} ${rowIndex === rows.length - 1
                              ? "rounded-bl-lg bg-gray-200"
                              : "border-b border-gray-300"
                            } border-r-2 ${!isMobile && styles.fixedcolumn}`}
                        >
                          {row.header}
                        </td>
                        {row.values &&
                          row.values.length > 0 && (
                            <>
                              {row.values.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className={`px-3 py-2 ${styles.doctext} text-right ${rowIndex === rows.length - 1
                                      ? cellIndex === row.values.length - 1
                                        ? "rounded-br-lg bg-gray-200 font-semibold"
                                        : "bg-gray-200 font-semibold"
                                      : "border-b border-gray-300"
                                    }`}
                                >
                                  {cell ? formatCost(parseInt(cell)) : formatCost(0)}
                                </td>
                              ))}

                              {/* Total Sum Cell */}
                              <td
                                className={`px-3 py-2 ${styles.doctext} text-right ${rowIndex === rows.length - 1
                                    ? "bg-gray-200 font-semibold"
                                    : "border-b border-gray-300"
                                  }`}
                              >
                                {formatCost(
                                  row.values.reduce((sum, val) => sum + parseFloat(val || 0), 0)
                                )}
                              </td>
                            </>
                          )}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className={`${styles.heading11}`}>Cash Flows</h1>

          <div className="border border-[#CCCBCB] rounded-lg mt-6 overflow-x-auto">
            <div className="overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 relative bg-[#FDECDF]">
              <div className="absolute inset-0 flex items-center left-[80%] md:left-[70%] xl:left-[65%] z-[5]">
                <img
                  onClick={() => {
                    dispatch(setShowSignInModal({ showSignInModal: true, redirectUrl: ('/properties') }))
                    logEvent(analytics, "click_cashflow_lock");
                  }}
                  className="mt-2 cursor-pointer w-9 h-9"
                  src={lock}
                />
              </div>

              <table
                className={`max-w-full w-full text-nowrap ${styles.cashflowtable}`}
              >
                <thead>
                  <tr>
                    <th
                      className={`sm:min-w-[10vw] min-w-[30vw] px-3 py-2 border-b border-gray-300 text-left sticky left-0 bg-[#FAFAFA] tracking-wider border-r-2 ${styles.font1} ${!isMobile && styles.fixedcolumn}`}
                    >
                      Category
                    </th>
                    {years.map((year, index) => (
                      <th
                        key={index}
                        className={`sm:min-w-[10vw] min-w-[30vw] px-3 py-3 border-b border-[#CCCBCB] text-right font-semibold tracking-wider ${styles.doctext}`}
                      >
                        {index === 0
                          ? `${shortMonth} - Dec ${year}`
                          : index === endIndex
                            ? `Jan - ${prevShortMonth} ${year}`
                            : `Jan - Dec ${year}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows &&
                    rows.length > 0 &&
                    rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={`${rowIndex === rows.length - 1 ? "rounded-b-lg" : ""} ${rowIndex === 0 ? styles.fixedrow : ""}`}
                      >
                        <td
                          className={`sm:min-w-[10vw] min-w-[30vw] border-b border-gray-200 text-left tracking-wider sticky left-0 bg-[#FAFAFA] z-[5] px-3 py-2 ${styles.font1} ${rowIndex === rows.length - 1
                              ? "rounded-bl-lg bg-gray-200"
                              : "border-b border-gray-300"
                            } border-r-2 ${!isMobile && styles.fixedcolumn}`}
                        >
                          {row.header}
                        </td>
                        {row.values &&
                          row.values.length > 0 &&
                          row.values.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className={`px-3 py-2 blur-md ${styles.doctext} text-right ${rowIndex === rows.length - 1
                                  ? cellIndex === row.values.length - 1
                                    ? "rounded-br-lg bg-gray-200 font-semibold"
                                    : "bg-gray-200 font-semibold"
                                  : "border-b border-gray-300"
                                }`}
                            >
                              {cell
                                ? formatCost(parseInt(cell))
                                : formatCost(0)}
                            </td>
                          ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CashFlowsTable;