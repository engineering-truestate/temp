import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InvestmentOverview from './ProjectDetails/InvOverview';
import InvestmentBreakdownChart from './ProjectDetails/GanttChart';
import CashFlowsTable from './ProjectDetails/CashFlowsTable';
import Overview from "../components/ProjectDetails/Overview";


const Finance = ({investmentOverviewData, results, data2, error, isReport, holdingPeriod , isreport2 , data3}) => {

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    console.log("data in finance page is",results);
    let resul = results; // You should replace 'someData' with your actual results or data fetching logic.
    if (resul && results.data) {
        results = results.data; // Ensure results.data is used if available
    }
    useEffect(() => {
        const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", checkIsMobile);
        return () => {
            window.removeEventListener("resize", checkIsMobile);
        };
    }, []);


    if (error) return <div>Error: {error}</div>;

    if (!results) return <div>Loading...</div>;
     
    return (
        <div className='mb-9  lg:mb-12 '>
            <InvestmentOverview data={investmentOverviewData} isReport={isReport} />
            {isreport2 && 
            <>
                <div className="">
                <Overview
                  details={data3}
                  isReport={isreport2}
                />
              </div>
            </>}
            <InvestmentBreakdownChart data2={data2} holdingPeriod={holdingPeriod} />
            <CashFlowsTable isMobile={isMobile} data={results}  />
        </div>
    );
};

export default Finance;
