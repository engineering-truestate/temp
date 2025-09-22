import { useState } from "react";
// Danger icon moved to public folder
// import danger from "../../assets/Images/Vault/Icons/danger.svg";
// Arrow up icon moved to public folder
// import arrowUp from "../../assets/Images/Vault/Icons/Arrow-up.svg";
// Arrow down icon moved to public folder
// import arrowDown from "../../assets/Images/Vault/Icons/Arrow-down.svg";
import { useNavigate } from "react-router-dom";
// Add icon moved to public folder
// import add from "../../assets/Images/Vault/Icons/add.svg";
// Vault magnifier moved to public folder
// import vaultMag from "../../assets/Images/Vault/Images/vault_mag.webp";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { propertiesAdded } from "../../slices/userAuthSlice";

const VaultBoard = ({ onToggleModal }) => {
  const navigate = useNavigate();
  const [collapsedStates, setCollapsedStates] = useState({});

  const toggleCollapse = (index) => {
    // Update the collapse state based on the property index
    setCollapsedStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index], // Toggle the state for the given index
    }));
  };

  const goToAddProperty = () => {
    navigate("/vault/form-page");
  };

  const handleToggleModal = (propertyData, tab = "property") => {
    onToggleModal(propertyData, tab); // Adjust to pass the tab information up
  };

  const _propertiesAdded = useSelector(propertiesAdded);

  const totalAcquisitionValue = _propertiesAdded.reduce((total, property) => {
    return total + (Number(property.purchasePrice) || 0);
  }, 0);

  const totalCurrentValue = _propertiesAdded.reduce((total, property) => {
    return total + (Number(property?.details.current) || 0);
  }, 0);

  const totalPfp = _propertiesAdded.reduce((total, property) => {
    return total + (Number(property?.details.pfp) || 0);
  }, 0);

  const totalNetProfit = _propertiesAdded.reduce((total, property) => {
    return total + (Number(property?.details.netValue) || 0);
  }, 0);

  const totalXirr = _propertiesAdded.reduce((total, property) => {
    return total + (Number(property?.details.xirr) || 0);
  }, 0);

  return (
    <div className="max-w-[83rem] mx-auto h-full flex justify-between bg-[#FAFBFC] mt-4 mb-16 sm:flex-col pr:flex-col ld:px-4 sm:mb-0 pr:mb-0 ld:mb-24">
      <div className="summary-Div w-[400px] flex-col sm:w-full sm:px-4 pr:w-full pr:px-4 ld:w-[350px]">
        <div className="font-montserrat font-semibold text-[18px] text-[#666667]">
          Summary
        </div>
        <div className="w-full h-[187px] mt-[16px] mb-[12px] bg-[#F0FFFF] border-[1px] border-[#B9D7D2] rounded-[8px] flex-col justify-center items-center">
          <div className="flex mt-[24px]">
            <div className="w-1/2 flex-col justify-center items-center text-center ">
              <div className="font-montserrat font-medium text-[14px] text-[#666667]">
                Current Value
              </div>
              <div className="font-lato font-bold text-[20px] text-[#252626]">
                {totalCurrentValue.toLocaleString() || "-"} Cr
              </div>
            </div>
            <div className="w-1/2 flex-col justify-center items-center text-center ">
              <div className="font-montserrat font-medium text-[14px] text-[#666667]">
                Acquisition Value
              </div>
              <div className="font-lato font-bold text-[20px] text-[#252626]">
                {totalAcquisitionValue.toLocaleString() || "-"} Cr
              </div>
            </div>
          </div>
          <div className="w-[321px] h-[2px] bg-[#E4E5E6] mx-auto rounded-full mt-[16px] mb-[8px]"></div>
          <div className="flex mt-[24px]">
            <div className="w-1/3 flex-col justify-center items-center text-center ">
              <div className="font-montserrat font-medium text-[14px] text-[#666667]">
                PFP
              </div>
              <div className="font-lato font-bold text-[16] text-[#252626]">
                {totalPfp.toLocaleString() || "-"} Cr
              </div>
            </div>
            <div className="w-1/3 flex-col justify-center items-center text-center ">
              <div className="font-montserrat font-medium text-[14px] text-[#666667]">
                Net Profit:
              </div>
              <div className="font-lato font-bold text-[16] text-[#1E9941]">
                {totalNetProfit.toLocaleString() || "-"} Cr
              </div>
            </div>
            <div className="w-1/3 flex-col justify-center items-center text-center ">
              <div className="font-montserrat font-medium text-[14px] text-[#666667]">
                XIRR:
              </div>
              <div className="font-lato font-bold text-[16] text-[#F32C24]">
                {totalXirr.toLocaleString() || "-"} %
              </div>
            </div>
          </div>
        </div>
        <div className="font-lato font-medium text-[14px] text-[#7A7B7C]">
          This information is updated every quarter
        </div>
      </div>
      <div className="w-[855px] sm:w-full sm:mt-[20px] sm:px-4 pr:w-full pr:mt-[20px] pr:px-4 ld:w-[600px]">
        <div className="font-montserrat font-semibold text-[18px] text-[#666667]">
          Property Portfolio
        </div>
        <div className="flex-col">
          {_propertiesAdded?.map((property, index) =>
            property?.details?.isComplete ?? "no" ? (
              <div key={index}>
                <div className="parent-div-1 bg-[#FAFBFC] border-[1px] border-[#CFCECE] rounded-[8px] sm:rounded-t-[8px] sm:rounded-none sm:w-full pr:w-full mt-[16px]">
                  <div className="no-property-container w-[843px] overflow-hidden transition-all duration-500 ease-in-out sm:w-full sm:px-4 pr:w-full pr:px-4 ld:w-full ld:px-4">
                    <div className="flex mt-[20px] mb-[20px] justify-between w-[803px] mx-auto sm:w-full sm:flex-col sm:space-y-2 pr:w-full ld:w-full">
                      <div className="font-montserrat font-bold text-[20px] text-[#252626]">
                        {property?.Name.toUpperCase()}
                      </div>
                      <button
                        onClick={() => handleToggleModal(property)}
                        className="flex w-[100px] h-[30px] bg-[#E4E5E6] font-lato font-semibold text-[14px] text-[#153E3B] rounded-[4px] justify-center items-center text-center cursor-pointer"
                      >
                        See Details
                      </button>
                    </div>
                    <div className="w-[803px] sm:w-full h-[1px] bg-[#CFCECE] mx-auto pr:w-full mb-[20px] ld:w-full"></div>
                    <div className="w-full flex-col justify-center items-center text-center mb-[40px] mt-[40px]">
                      <img src="/assets/vault/images/magnifier.webp" alt="vaultMag" className="mx-auto" />
                      <div className="mt-[12px] mb-[4px] font-montserrat font-semibold text-[14px] text-[#252626]">
                        Your valuation report is being prepared
                      </div>
                      <div className="font-lato font-normal text-[14px] text-[#464748]">
                        This will take 7-10 working days
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[630px] h-[40px] bg-[#FFECB6] border-[1px] border-[#FFD459] flex items-center rounded-b-[8px] mx-auto justify-between px-5 sm:w-full sm:h-auto sm:flex-col sm:justify-start sm:items-start sm:px-2 pr:w-full ld:w-full">
                  <div className="flex sm:pt-[8px]">
                    <img src="/assets/vault/icons/actions/warning.svg" alt="danger" className="mr-3 sm:w-7" />
                    <span className="font-lato font-medium text-[14px] text-[#252626]">
                      Add loan details to get additional information (PFP, IRR
                      etc)
                    </span>
                  </div>
                  <div
                    onClick={() => handleToggleModal(property, "financial")}
                    className="font-lato font-medium text-[14px] text-[#22514D] underline sm:ml-[36px] sm:mt-1 sm:pb-[8px] cursor-pointer"
                  >
                    Add Financial Details
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={index}
                className="parent-div-2 w-full lg:overflow-hidden lg:min-h-[216px] lg:max-h-[451px] lg:overflow-y-auto ld:overflow-hidden ld:min-h-[216px] ld:max-h-[451px] ld:overflow-y-auto mt-[16px] flex-col space-y-5 "
              >
                <div className="prop-1 bg-[#FAFBFC] border-[1px] border-[#CFCECE] rounded-[8px] sm:w-full pr:w-full">
                  <div
                    className={`property-container w-[843px] overflow-hidden transition-all duration-500 ease-in-out sm:w-full sm:px-4 pr:w-full pr:px-4 ${collapsedStates[index]
                        ? "h-[140px] sm:h-auto pr:h-auto"
                        : "h-[220px] sm:h-auto pr:h-auto"
                      }`}
                  >
                    <div className="flex mt-[20px] mb-[20px] justify-between w-[803px] mx-auto sm:w-full sm:flex-col sm:space-y-2 pr:w-full">
                      <div className="font-montserrat font-bold text-[20px] text-[#252626]">
                        {property?.Name}
                      </div>
                      <button className="flex w-[116px] h-[30px] bg-[#E4E5E6] font-lato font-semibold text-[14px] text-[#153E3B] rounded-[4px] justify-center items-center text-center">
                        See Details{" "}
                        <img src="/assets/vault/icons/actions/warning.svg" alt="danger" className="ml-2" />
                      </button>
                    </div>
                    <div className="w-[803px] sm:w-full h-[1px] bg-[#CFCECE] mx-auto pr:w-full"></div>
                    <div className="w-[803px] flex-col mx-auto sm:w-full pr:w-full">
                      <div className="w-full sm:flex sm:justify-between">
                        <div className="flex sm:flex-col justify-between text-start sm:w-[35%]">
                          <div className="w-[88px] h-[51px] flex-col justify-center items-center text-start mt-[20px] sm:w-full">
                            <div className="font-montserrat font-medium text-[14px] text-[#666667]">
                              Current
                            </div>
                            <div className="font-lato font-bold text-[18px] text-[#252626]">
                              {property?.details?.current || "-"} Cr
                            </div>
                          </div>
                          <div className="w-[88px] h-[51px] flex-col justify-center items-center text-start mt-[20px] sm:w-full">
                            <div className="font-montserrat font-medium text-[14px] text-[#666667]">
                              PFP
                            </div>
                            <div className="font-lato font-bold text-[18px] text-[#252626]">
                              {property?.details?.pfp || "-"} Cr
                            </div>
                          </div>
                          <div className="w-[88px] h-[51px] flex-col justify-center items-center text-start mt-[20px] sm:w-full">
                            <div className="font-montserrat font-medium text-[14px] text-[#666667]">
                              Loan Pending
                            </div>
                            <div className="font-lato font-bold text-[18px] text-[#252626]">
                              {property?.details?.loanPending || "-"} Cr
                            </div>
                          </div>
                          <div className="w-[88px] h-[51px] flex-col justify-center items-center text-start mt-[20px] sm:w-full">
                            <div className="font-montserrat font-medium text-[14px] text-[#666667]">
                              Rent
                            </div>
                            <div className="font-lato font-bold text-[18px] text-[#252626]">
                              {property?.details?.rent || "-"}
                            </div>
                          </div>
                          <div className="w-[88px] h-[51px] flex-col justify-center items-center text-start mt-[20px] sm:w-full">
                            <div className="font-montserrat font-medium text-[14px] text-[#666667]">
                              Return
                            </div>
                            <div className="font-lato font-bold text-[18px] text-[#252626]">
                              {property?.details?.return || "-"} Cr
                            </div>
                          </div>
                        </div>
                        <div className="flex sm:flex-col justify-between text-start sm:w-[35%] sm:mb-3 pr:mb-3">
                          <div className="w-[88px] h-[51px] flex-col justify-center items-center text-start mt-[20px] sm:w-full">
                            <div className="font-montserrat font-medium text-[14px] text-[#666667]">
                              Acquisition
                            </div>
                            <div className="font-lato font-bold text-[18px] text-[#252626]">
                              {property?.pricePurchase || "-"} Cr
                            </div>
                          </div>
                          <div className="w-[88px] h-[51px] flex-col justify-center items-center text-start mt-[20px] sm:w-full">
                            <div className="font-montserrat font-medium text-[14px] text-[#666667]">
                              Net Value
                            </div>
                            <div className="font-lato font-bold text-[18px] text-[#252626]">
                              {property?.details?.netValue || "-"} Cr
                            </div>
                          </div>
                          <div className="w-[88px] h-[51px] flex-col justify-center items-center text-start mt-[20px] sm:w-full">
                            <div className="font-montserrat font-medium text-[14px] text-[#666667]">
                              Total Loan
                            </div>
                            <div className="font-lato font-bold text-[18px] text-[#252626]">
                              {property?.details?.totalLoan || "-"} Cr
                            </div>
                          </div>
                          <div className="w-[88px] h-[51px] flex-col justify-center items-center text-start mt-[20px] sm:w-full">
                            <div className="font-montserrat font-medium text-[14px] text-[#666667]">
                              Rental Yield
                            </div>
                            <div className="font-lato font-bold text-[18px] text-[#252626]">
                              {property?.details?.rentalYield || "-"} Cr
                            </div>
                          </div>
                          <div className="w-[88px] h-[51px] flex-col justify-center items-center text-start mt-[20px] sm:w-full">
                            <div className="font-montserrat font-medium text-[14px] text-[#666667]">
                              Return %
                            </div>
                            <div className="font-lato font-bold text-[18px] text-[#1E9941]">
                              {property?.details?.returnPercentage || "-"} %
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleCollapse(index)}
                    className="toggle-button w-[102px] h-[33px] font-montserrat font-semibold text-[14px] text-[#153E3B] flex bg-[#E4E5E6] rounded-[4px] justify-center items-center text-center mt-[20px] mb-[20px] ml-5 sm:hidden pr:hidden"
                  >
                    {collapsedStates[index] ? "See less" : "See more"}
                    <img
                      src={collapsedStates[index] ? "/assets/vault/icons/navigation/arrow-down.svg" : "/assets/vault/icons/navigation/arrow-up.svg"}
                      alt={collapsedStates[index] ? "arrowDown" : "arrowUp"}
                      className="ml-2 w-4 "
                    />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
        <button
          onClick={goToAddProperty}
          className="font-lato font-bold text-[14px] text-[#FAFBFC] bg-[#153E3B] rounded-[8px] w-[152px] h-[45px] flex justify-center items-center text-center mt-[32px]"
        >
          <img
            src={add}
            alt="add"
            className="pr-[8px] flex justify-center items-center text-center"
          />
          Add property
        </button>
      </div>
    </div>
  );
};

VaultBoard.propTypes = {
  onToggleModal: PropTypes.func,
};

export default VaultBoard;
