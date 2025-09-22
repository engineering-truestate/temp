import styles from '../ProjectDetails/ProjectDetails.module.css';
import projectPopupStyles from '../Project_popup/ProjectPopup.module.css';
import infoIcon from '/assets/icons/ui/info.svg'


const InvestmentOverviewVault = ({ data, headingSize }) => {
    return (
      <>
        <div className={`rounded-lg w-full  mb-8 sm:mb-10 font-lato`}>
          <h2 className={`mb-2 ${styles.invtitle} ${headingSize ? `${headingSize}` : 'text-[1.125rem]'}`}>Investment Overview</h2>
          {/* <div className='mb-4 font-lato text-sm flex gap-2 items-center'><span className="text-[16px] italic text-[#]">{location.pathname.includes('report') ? "Disclaimer: These estimates assume an investment made today. Please consult your investment manager before making any decisions." : "Disclaimer: These estimates assume an investment made today with a maximum handover period of 4 years. Variations in cashflows, transfer fees, or timelines may impact returns. Please consult your investment manager before making any decisions."}</span></div> */}
          <div className={`${styles.invoverviewmain} py-6`}>
            <div className="lg:block px-4 ">
              <div className={`mb-2 ${styles.invtext_l_vault}`}>{data[0]?.value || "1000000"}</div>

              <div className={`${styles.invtext_lb} flex justify-center`}>
               <span>{data[0]?.label}</span>
                {/* more info icon with tooltip  */}
                {/* <div className={`${projectPopupStyles.tooltip} cursor-pointer`}>
               <img src={infoIcon} className="ml-1 mr-2 mt-[1px]" alt="info" />
               <span className={`${projectPopupStyles.tooltiptext}`}>
                abcd
               </span>
               </div> */}
              </div>
            </div>

            <div className="text-center  ">
              <div className={`mb-2 ${styles.invtext_l_vault} ${styles.profit_g}`}>{data[1]?.value || "1000000"}</div>
              <div className={`${styles.invtext_lb} flex justify-center`}>
                {data[1]?.label}
                
                {/* more info icon with tooltip  */}
                {/* <div className={`${projectPopupStyles.tooltip} cursor-pointer`}>
               <img src={infoIcon} className="ml-1 mr-2 mt-[1px]" alt="info" />
               <span className={`${projectPopupStyles.tooltiptext}`}>
                abcd
               </span>
               </div> */}
                </div>
            </div>

            <div className="text-center px-4">
              <div className={`mb-2 ${styles.invtext_l_vault} ${styles.profit_g} ${data[2]?.value && (data[2].value.split("")[0] === '-' ? 'text-[red]' : 'text-[#0E8345]')}`}>{data[2]?.value || "1000000"}</div>
              <div className={`${styles.invtext_lb} flex justify-center`}>
                {data[2]?.label}

                {/* more info icon with tooltip  */}
                {/* <div className={`${projectPopupStyles.tooltip} cursor-pointer`}>
               <img src={infoIcon} className="ml-1 mr-2 mt-[1px]" alt="info" />
               <span className={`${projectPopupStyles.tooltiptext}`}>
                abcd
               </span>
               </div> */}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };


  export default InvestmentOverviewVault;