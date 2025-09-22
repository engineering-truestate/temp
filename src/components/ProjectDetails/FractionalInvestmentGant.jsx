
import React, { useState, useEffect } from "react";
import styles from "./InvestmentBreakdownChart.module.css";

import { formatCost } from "../../utils/common";
import { useDispatch, useSelector } from "react-redux";
import lockIcon from "/assets/icons/features/vault.svg";
import { setShowSignInModal } from "../../slices/modalSlice";
import style from "./ProjectDetails.module.css";
import { ViteRuntime } from "vite/runtime";
const FractionalInvestment = ({ seatsFilled, totalSeats, lastDate }) => {
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    if (totalSeats > 0) {
      setRatio(seatsFilled / totalSeats);
    } else {
      setRatio(0);
    }
  }, [seatsFilled, totalSeats]);

  return (
    <div className={`${styles.chartContainer} mb-1 sm:mb-1`}>
      <div className={styles.chartBar} style={{ display: 'flex', width: '100%' }}>
        <div
          className={styles.chartSegment}
          style={{
            backgroundColor: '#144B44',
            width: `${(ratio * 100).toFixed(2)}%`,
            transition: 'width 0.5s',
          }}
        ></div>
        <div
          className={styles.chartSegment}
          style={{
            backgroundColor: '#E0E0E0',
            width: `${(100 - ratio * 100).toFixed(2)}%`,
            transition: 'width 0.5s',
          }}
        ></div>
      </div>

      <div className="flex flex-col justify-between mb-4 mt-3 pb-0 w-full">
        <div
          className={`flex justify-between items-center w-full font-lato text-[14px] ${styles.header}`}
        >
          <div className="flex mb-0">
            <span className="mr-4 font-black">
              {seatsFilled}/{totalSeats} Seats Filled
            </span>
            <span className="border-l border-gray-500 pl-4 text-gray-600 font-semibold">
              Last Date: 
            </span>
            <span style={{ fontWeight: '900', color: '#DE1135' }}>
              {lastDate}
            </span>
          </div>
          <div className={styles.totalAmount}>
            {(ratio * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default FractionalInvestment;