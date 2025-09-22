import React, { useState, useEffect } from "react";
import styles from "./InvestmentBreakdownChart.module.css";
import { formatCost } from "../../utils/common";
import { useDispatch, useSelector } from "react-redux";
import lockIcon from "/assets/images/illustrations/cashflow-lock.png";
import { setShowSignInModal } from "../../slices/modalSlice";

const InvestmentBreakdownChart = ({
  data2,
  holdingPeriod,
  totalInvestment,
  results, // Add results prop to access API response directly
}) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  
  console.log("Here is data2", data2);
  console.log("Here is results", results);
  
  // Extract values from API response if available, otherwise use data2
  const getBookingAmount = () => {
    if (results?.monthly_cf && results.monthly_cf.length > 0) {
      // Find the first month with builder amount (down payment + builder's remaining amount)
      const firstMonth = results.monthly_cf[0];
      if (firstMonth && firstMonth[2] && firstMonth[2].value) {
        return parseFloat(parseFloat(firstMonth[2].value).toFixed(2)) || 0;
      }
    }
    return parseFloat(parseFloat(data2?.booking_amt).toFixed(2)) || 0;
  };

  const getInterestAmount = () => {
    if (results?.monthly_cf && results.monthly_cf.length > 0) {
      // Sum all interest payments from monthly_cf
      const total = results.monthly_cf.reduce((sum, month) => {
        const interest = parseFloat(month[4]) || 0; // Interest is at index 4
        return sum + interest;
      }, 0);
      return parseFloat(total.toFixed(2));
    }
    return parseFloat(parseFloat(data2?.intrest).toFixed(2)) || 0;
  };

  const getPrincipalAmount = () => {
    if (results?.monthly_cf && results.monthly_cf.length > 0) {
      // Sum all principal payments from monthly_cf
      const total = results.monthly_cf.reduce((sum, month) => {
        const principal = parseFloat(month[5]) || 0; // Principal is at index 5
        return sum + principal;
      }, 0);
      return parseFloat(total.toFixed(2));
    }
    return parseFloat(parseFloat(data2?.principal).toFixed(2)) || 0;
  };

  const getChargesValue = () => {
    if (results?.monthly_cf && results.monthly_cf.length > 0) {
      // Find charges from monthly_cf (stamp duty & registration charges)
      for (const month of results.monthly_cf) {
        if (month[2] && month[2].components) {
          const stampDutyComponent = month[2].components.find(comp => 
            comp.includes('stamp duty') || comp.includes('registration charges')
          );
          if (stampDutyComponent) {
            // Extract the amount from the component string like "stamp duty & registraion charges (-₹32,500)"
            const match = stampDutyComponent.match(/₹([\d,]+)/);
            if (match) {
              const value = parseFloat(match[1].replace(/,/g, ''));
              return parseFloat(value.toFixed(2));
            }
          }
        }
      }
    }
    return parseFloat(parseFloat(data2?.charges_value).toFixed(2)) || 0;
  };

  // Use the API response values
  const booking_amt = getBookingAmount();
  const intrest = getInterestAmount();
  const principal = getPrincipalAmount();
  const charges_value = getChargesValue();
  const constructionCompletionDate = data2?.constructionCompletionDate;

  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);

  // Calculate if charges should be included
  const shouldIncludeCharges = () => {
    if (!constructionCompletionDate) return false;
    try {
      const completionDate = new Date(constructionCompletionDate);
      const today = new Date();
      const handoverPeriod = completionDate.getFullYear() - today.getFullYear();
      return handoverPeriod < holdingPeriod;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const includeCharges = shouldIncludeCharges();
    
    // Calculate total and round to 2 decimal places
    const calculatedTotal = includeCharges 
      ? booking_amt + intrest + principal + charges_value
      : booking_amt + intrest + principal;
    
    // Ensure total is a valid number and round to 2 decimal places
    const safeTotal = isNaN(calculatedTotal) ? 0 : parseFloat(calculatedTotal.toFixed(2));
    setTotal(safeTotal);

    // Set items based on whether charges should be included
    const newItems = [
      { name: "Booking Amount", value: booking_amt, color: "#FFC0CB" },
      { name: "Interest", value: intrest, color: "#FFA07A" },
      { name: "Principal", value: principal, color: "#87CEEB" },
    ];

    if (includeCharges && charges_value > 0) {
      newItems.push({
        name: "Stamp Duty & Reg Charges",
        value: charges_value,
        color: "#98FB98",
      });
    }

    setItems(newItems);
  }, [booking_amt, intrest, principal, charges_value, constructionCompletionDate, holdingPeriod]);

  return (
    <div className={`${styles.chartContainer} mb-8 sm:mb-10`}>
      <div className={`flex justify-between flex-wrap ${styles.header} mt-5`}>
        <div className={styles.title}>Investment Breakdown</div>
        <div className={styles.totalAmount}>
          {!isAuthenticated
            ? formatCost(totalInvestment || 0)
            : formatCost(Math.round(total))}
        </div>
      </div>
      
      <div className={styles.chartBar}>
        {items?.map((item, index) => (
          <div
            key={index}
            className={styles.chartSegment}
            style={{
              backgroundColor: item.color,
              width: `${
                isAuthenticated && total > 0
                  ? (item.value / total) * 100
                  : ((totalInvestment || 1000000) / 5) / ((totalInvestment || 1000000) / 100) // fallback calculation
              }%`,
            }}
          ></div>
        ))}
      </div>
      
      <div
        className={`grid ${
          items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
        } md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-4 mt-9`}
      >
        {items?.map((item, index) => (
          <div key={index} className={`${styles.segmentLabel}`}>
            <div className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className={styles.iname}>{item.name}</div>
            </div>
            <div className={`${styles.ival} ml-6`}>
              {!isAuthenticated && item.value === 0 ? (
                <img
                  onClick={() =>
                    dispatch(
                      setShowSignInModal({
                        showSignInModal: true,
                        redirectUrl: "/properties",
                      })
                    )
                  }
                  className="mt-2 cursor-pointer"
                  src={lockIcon}
                />
              ) : (
                formatCost(item.value || 0)
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentBreakdownChart;