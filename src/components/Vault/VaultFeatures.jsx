// Document icon moved to public folder
// import doc from "../../assets/Images/Vault/Icons/doc.svg";
// Loan icon moved to public folder
// import loan from "../../assets/Images/Vault/Icons/loan.svg";
// TDS icon moved to public folder
// import tds from "../../assets/Images/Vault/Icons/tds.svg";
// Municipal icon moved to public folder
// import municipal from "../../assets/Images/Vault/Icons/municipal.svg";
// Rental icon moved to public folder
// import rental from "../../assets/Images/Vault/Icons/rental.svg";
// Sell icon moved to public folder
// import sell from "../../assets/Images/Vault/Icons/sell.svg";
// Valuation icon moved to public folder
// import valuation from "../../assets/Images/Vault/Icons/valuation.svg";
// Live icon moved to public folder
// import live from "../../assets/Images/Vault/Icons/live.svg";
// Upcoming icon moved to public folder
// import upcoming from "../../assets/Images/Vault/Icons/upcoming.svg";

const VaultFeatures = () => {
  return (
    <div className="max-w-[83rem] mx-auto h-full flex-col justify-center items-center text-center bg-[#FAFBFC] lg:mt-20 lg:mb-[86px] ld:mt-20 ld:mb-[86px]sm:justify-start sm:items-start sm:text-left sm:px-4 pr:justify-start pr:items-start pr:text-left pr:px-4 sm:mb-[32px] sm:mt-[32px] pr:mb-[32px] pr:mt-[32px]">
      <div className="w-full mb-[52px] font-noticiaText font-bold text-[40px] text-[#252626] sm:text-[28px] pr:text-[32px] pr:mx-auto pr:justify-center pr:text-center sm:mb-[32px]">
        Features
      </div>
      <div className="lg:flex-col justify-between sm:flex-col pr:justify-center pr:flex-col pr:mx-11 ld:mx-11">
        <div className="flex justify-center lg:space-x-[16px] flex-wrap sm:flex-col pr:flex">
          <div className="lg:flex-col justify-center items-center text-center h-fit w-[306px] py-[24px] px-[32px] border-[1px] border-[#CFCECE] rounded-[8px] mb-[24px] sm:w-full sm:flex sm:px-[20px] sm:py-[16px] sm:items-center sm:text-left sm:space-x-[16px] pr:w-[230px]">
            <img
              src="/assets/vault/icons/features/valuation.svg"
              alt="valuation"
              className="mx-auto mb-[20px] w-[56px] h-[56px] sm:w-[48px] sm:h-auto pr:w-[48px] pr:h-[48px] rounded-full sm:mx-0 sm:my-auto sm:flex sm:justify-start"
            />
            <div className="flex-col sm:grow">
              <div className="mb-[4px] font-montserrat font-semibold text-[18px] text-[#252626] sm:text-[16px] sm:font-bold">
                Valuation Report
              </div>
              <div className="font-lato font-normal text-[15px] text-[#252626]">
                Track valuation and return on your investment every quarter
              </div>
              <img
                src="/assets/vault/icons/status/live.svg"
                alt="live"
                className="mt-[20px] flex justify-center items-center mx-auto sm:mx-0 sm:mt-[10px]"
              />
            </div>
          </div>
          <div className="lg:flex-col ld:flex-col justify-center items-center text-center h-auto w-[306px] py-[24px] px-[32px] border-[1px] border-[#CFCECE] rounded-[8px] mb-[24px] sm:w-full sm:flex sm:px-[20px] sm:py-[16px] sm:items-center sm:text-left sm:space-x-[16px] pr:w-[230px] pr:ml-2 pr:mr-2">
            <img
              src="/assets/vault/icons/features/documents.svg"
              alt="doc"
              className="mx-auto mb-[20px] w-[56px] h-[56px] sm:w-[48px] sm:h-[48px] pr:w-[48px] pr:h-[48px] rounded-full sm:mx-0 sm:my-auto sm:flex sm:justify-start"
            />
            <div className="flex-col sm:grow">
              <div className="mb-[4px] font-montserrat font-semibold text-[18px] text-[#252626] sm:text-[16px] sm:font-bold">
                Document Management
              </div>
              <div className="font-lato font-normal text-[15px] text-[#252626]">
                Keep all real estate related documents in one place
              </div>
              <img
                src="/assets/vault/icons/status/upcoming.svg"
                alt="upcoming"
                className="mt-[20px] flex justify-center items-center mx-auto sm:mx-0 sm:mt-[10px]"
              />
            </div>
          </div>
          <div className="lg:flex-col ld:flex-col justify-center items-center text-center h-auto w-[306px] py-[24px] px-[32px] border-[1px] border-[#CFCECE] rounded-[8px] mb-[24px] sm:w-full sm:flex sm:px-[20px] sm:py-[16px] sm:items-center sm:text-left sm:space-x-[16px] pr:w-[230px]">
            <img
              src="/assets/vault/icons/features/loan.svg"
              alt="loan"
              className="mx-auto mb-[20px] w-[56px] h-[56px] sm:w-[48px] sm:h-[48px] pr:w-[48px] pr:h-[48px] rounded-full sm:mx-0 sm:my-auto sm:flex sm:justify-start sm:"
            />
            <div className="flex-col sm:grow">
              <div className="mb-[4px] font-montserrat font-semibold text-[18px] text-[#252626] sm:text-[16px] sm:font-bold">
                Loan Management
              </div>
              <div className="font-lato font-normal text-[15px] text-[#252626]">
                Track home loans, EMIs, get best rate offers, transfer with ease
              </div>
              <img
                src="/assets/vault/icons/status/upcoming.svg"
                alt="upcoming"
                className="mt-[20px] flex justify-center items-center mx-auto sm:mx-0 sm:mt-[10px]"
              />
            </div>
          </div>
          <div className="lg:flex-col ld:flex-col justify-center items-center text-center h-auto w-[306px] py-[24px] px-[32px] border-[1px] border-[#CFCECE] rounded-[8px] mb-[24px] sm:w-full sm:flex sm:px-[20px] sm:py-[16px] sm:items-center sm:text-left sm:space-x-[16px] pr:w-[230px] ">
            <img
              src="/assets/vault/icons/features/tds.svg"
              alt="tds"
              className="mx-auto mb-[20px] w-[56px] h-[56px] sm:w-[48px] sm:h-[48px] pr:w-[48px] pr:h-[48px] rounded-full sm:mx-0 sm:my-auto"
            />
            <div className="flex-col sm:grow">
              <div className="mb-[4px] font-montserrat font-semibold text-[18px] text-[#252626] sm:text-[16px] sm:font-bold">
                TDS Payment
              </div>
              <div className="font-lato font-normal text-[15px] text-[#252626]">
                Calculate, pay and track TDS payments on every installment
              </div>
              <img
                src="/assets/vault/icons/status/upcoming.svg"
                alt="upcoming"
                className="mt-[20px] flex justify-center items-center mx-auto sm:mx-0 sm:mt-[10px]"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center lg:space-x-[16px] lg:mt-4 ld:mt-4 sm:flex-col pr:flex">
          <div className="lg:flex-col ld:flex-col justify-center items-center text-center h-auto w-[306px] py-[24px] px-[32px] border-[1px] border-[#CFCECE] rounded-[8px] mb-[24px] sm:w-full sm:flex sm:px-[20px] sm:py-[16px] sm:items-center sm:text-left sm:space-x-[16px] pr:w-[230px]">
            <img
              src="/assets/vault/icons/features/municipal.svg"
              alt="municipal "
              className="mx-auto mb-[20px] w-[56px] h-[56px] sm:w-[48px] sm:h-[48px] pr:w-[48px] pr:h-[48px] rounded-full sm:mx-0 sm:my-auto"
            />
            <div className="flex-col sm:grow">
              <div className="mb-[4px] font-montserrat font-semibold text-[18px] text-[#252626] sm:text-[16px] sm:font-bold">
                Local Compliance
              </div>
              <div className="font-lato font-normal text-[15px] text-[#252626]">
                Property tax payments, Khata transfer, electricity bill transfer
              </div>
              <img
                src="/assets/vault/icons/status/upcoming.svg"
                alt="upcoming"
                className="mt-[20px] flex justify-center items-center mx-auto sm:mx-0 sm:mt-[10px]"
              />
            </div>
          </div>
          <div className="lg:flex-col ld:flex-col justify-center items-center text-center h-auto w-[306px] py-[24px] px-[32px] border-[1px] border-[#CFCECE] rounded-[8px] mb-[24px] sm:w-full sm:flex sm:px-[20px] sm:py-[16px] sm:items-center sm:text-left sm:space-x-[16px] pr:w-[230px] pr:ml-2 pr:mr-2">
            <img
              src="/assets/vault/icons/features/rental.svg"
              alt="rental"
              className="mx-auto mb-[20px] w-[56px] h-[56px] sm:w-[48px] sm:h-[48px] pr:w-[48px] pr:h-[48px] rounded-full sm:mx-0 sm:my-auto"
            />
            <div className="flex-col sm:grow">
              <div className="mb-[4px] font-montserrat font-semibold text-[18px] text-[#252626] sm:text-[16px] sm:font-bold">
                Rental Management
              </div>
              <div className="font-lato font-normal text-[15px] text-[#252626]">
                Rental listings, tenant verification and rent collection
              </div>
              <img
                src="/assets/vault/icons/status/upcoming.svg"
                alt="upcoming"
                className="mt-[20px] flex justify-center items-center mx-auto sm:mx-0 sm:mt-[10px]"
              />
            </div>
          </div>
          <div className="lg:flex-col ld:flex-col justify-center items-center text-center h-auto w-[306px] py-[24px] px-[32px] border-[1px] border-[#CFCECE] rounded-[8px] mb-[24px] sm:w-full sm:flex sm:px-[20px] sm:py-[16px] sm:items-center sm:text-left sm:space-x-[16px] pr:w-[230px]">
            <img
              src="/assets/vault/icons/features/sell.svg"
              alt="sell"
              className="mx-auto mb-[20px] w-[56px] h-[56px] sm:w-[48px] sm:h-[48px] pr:w-[48px] pr:h-[48px] rounded-full sm:mx-0 sm:my-auto"
            />
            <div className="flex-col sm:grow">
              <div className="mb-[4px] font-montserrat font-semibold text-[18px] text-[#252626] sm:text-[16px] sm:font-bold">
                Sell Your Property
              </div>
              <div className="font-lato font-normal text-[15px] text-[#252626]">
                Exit your investments hassle free with best returns
              </div>
              <img
                src="/assets/vault/icons/status/upcoming.svg"
                alt="upcoming"
                className="mt-[20px] flex justify-center items-center mx-auto sm:mx-0 sm:mt-[10px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultFeatures;
