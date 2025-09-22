import React from 'react';
import styles from './MonthlyCashFlowTable.module.css';
import { arrayToString, formatCost } from '../../utils/common';

const MonthlyCashFlowTable = ({ cashflowData, results }) => {
  // Process API response to match component structure
  // results=results.data
  const processApiData = (apiResults) => {
    // Check if we have the nested structure (results.data.monthly_cf) or direct structure (results.monthly_cf)
    const monthlyData = apiResults?.data?.monthly_cf || apiResults?.monthly_cf;
    if (!monthlyData || !Array.isArray(monthlyData)) return [];
    
    return monthlyData.map(monthData => {
      // Extract components from the API response structure
      const components = monthData[2]?.components || [];
      
      return {
        month: monthData[0], // Month name at index 0
        openingBalance: parseFloat(parseFloat(monthData[1] || 0).toFixed(2)), // Opening loan balance at index 1
        others: {
          value: parseFloat(parseFloat(monthData[2]?.value || 0).toFixed(2)), // Other cash flows at index 2
          components: components
        },
        payment: parseFloat(parseFloat(monthData[3] || 0).toFixed(2)), // EMI payment at index 3
        interest: parseFloat(parseFloat(monthData[4] || 0).toFixed(2)), // Interest at index 4
        principal: parseFloat(parseFloat(monthData[5] || 0).toFixed(2)), // Principal at index 5
        closingBalance: parseFloat(parseFloat(monthData[6] || 0).toFixed(2)), // Closing loan balance at index 6
        builderAmount: parseFloat(parseFloat(monthData[7] || 0).toFixed(2)), // Builder amount at index 7
        finalCashflow: parseFloat(parseFloat(monthData[8] || 0).toFixed(2)) // Final cash flow at index 8
      };
    });
  };

  // Use processed API data if available, otherwise use cashflowData prop
  const dataToRender = results ? processApiData(results) : cashflowData;

  // Function to format month string to short format (e.g., "September 2025" -> "Sep 25")
  const formatMonthYear = (monthString) => {
    if (!monthString) return '';
    
    try {
      // Handle different possible date formats
      let date;
      
      // Try parsing as "Month Year" format first
      if (monthString.includes(' ')) {
        const [monthName, year] = monthString.split(' ');
        date = new Date(`${monthName} 1, ${year}`);
      } else {
        // Fallback to direct parsing
        date = new Date(monthString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return monthString; // Return original if parsing fails
      }
      
      // Format to "MMM YY" using modern string methods
      const shortMonth = date.toLocaleString("default", { month: "short" });
      const shortYear = date.getFullYear().toString().slice(-2);
      
      return `${shortMonth} ${shortYear}`;
    } catch (error) {
      console.warn('Error formatting month:', error);
      // If parsing fails, return the original string
      return monthString;
    }
  };

  // Format currency values with proper decimal handling
  const formatValue = (value) => {
    if (value === null || value === undefined || value === "0.00" || value === 0) return "₹0";
    
    // Handle string values from API and ensure proper number conversion
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Check if the conversion resulted in a valid number
    if (isNaN(numValue)) return "₹0";
    
    // Format with currency symbol and proper formatting
    return formatCost(Math.abs(numValue));
  };

  return (
    <div className="mt-8  mb-8">
      <h3 className={`text-xl font-bold mb-4 ${styles.mcf}`}>Monthly Cash Flows</h3>
      <div className={`rounded-lg border-2 h-[300px] overflow-y-auto ${styles.scrollable}`}>
        <table className={`${styles.cashflowTable} table-auto w-full text-left`}>
          <thead className="sticky z-10 top-0 bg-white">
            <tr className='border-b-2'>
              <th className={`px-4 py-2 ${styles.head1}`}>Month</th>
              <th className={`px-4 py-2 ${styles.head1}`}>Opening Balance</th>
              <th className={`px-4 py-2 ${styles.head1}`}>Others</th>
              <th className={`px-4 py-2 ${styles.head1}`}>EMI Payment</th>
              <th className={`px-4 py-2 ${styles.head1}`}>Interest</th>
              <th className={`px-4 py-2 ${styles.head1}`}>Principal</th>
              <th className={`px-4 py-2 ${styles.head1}`}>Closing Balance</th>
            </tr>
          </thead>
          <tbody>
            {dataToRender && dataToRender.length > 0 ? (
              dataToRender.map((row, index) => (
                <tr key={index} className='border-b-2 '>
                  <td className={`px-4 py-2 ${styles.val1} `}>
                    {formatMonthYear(row?.month)}
                  </td>
                  <td className={`px-4 py-2 ${styles.val1} `}>
                    {formatValue(row?.openingBalance)}
                  </td>
                  <td className={`px-4 py-2 ${styles.val1} ${styles.tooltip}`}>
                    {formatValue(row?.others?.value)}

                    {row?.others?.components && row?.others?.components?.length > 0 && 
                      <span className={`${index === dataToRender?.length - 1 ? styles.tooltiptext2 : styles.tooltiptext1}`}>
                        {arrayToString(row?.others?.components)} 
                      </span>
                    }
                  </td>
                  <td className={`px-4 py-2 ${styles.val1}`}>
                    {formatValue(row?.payment)}
                  </td>
                  <td className={`px-4 py-2 ${styles.val1}`}>
                    {formatValue(row?.interest)}
                  </td>
                  <td className={`px-4 py-2 ${styles.val1}`}>
                    {formatValue(row?.principal)}
                  </td>
                  <td className={`px-4 py-2 ${styles.val1}`}>
                    {formatValue(row?.closingBalance)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyCashFlowTable;