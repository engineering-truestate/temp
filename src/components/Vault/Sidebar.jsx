const sidebarImg = '/assets/vault/images/sidebar-illustration.png';
//const logo = '/assets/vault/images/vault_logo.png';
const tick = '/assets/vault/icons/status/success.svg';
const whatsapp = '/assets/vault/images/whatsapp-contact.png';
import PropTypes from "prop-types";
import InvManager from "../../utils/InvManager";

const Sidebar = ({ currentStep, stepsCompleted }) => {
  const lineColor = (step) =>
    stepsCompleted[step]
      ? "bg-[#27A84A] h-6 sm:h-1 sm:w-[35px] pr:h-1 pr:w-[104px]"
      : "bg-[#E4E5E6] h-6 sm:h-1 sm:w-[35px] pr:h-1 pr:w-[104px]";

  const openWhatsapp = () => {
    const phoneNumber = InvManager.phoneNumber;
    const message = encodeURIComponent(
      "Hi TruEstate team, I would like to connect."
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="flex w-[30%] lg:bg-vault-gradient ld:bg-vault-gradient sm:bg-[#FFF8E7] pr:bg-[#FFF8E7] main-content relative sm:w-full sm:h-[90px] pr:w-full pr:h-[100px] sm:border-b sm:border-[#FFD459] pr:border-b pr:border-[#FFD459] border-r border-[#FFD459]">
      <img
        src={sidebarImg}
        alt="sidebar background"
        className="absolute bottom-0 right-0 sm:hidden pr:hidden"
      />
      <div className="flex flex-col h-full w-[65%] sm:w-full mx-auto pr:w-full ld:py-10 lg:py-8 justify-start items-start lg:ml-24">
        <div className="flex items-center mb-6 sm:hidden pr:hidden ">
          {/*<img src={logo} alt="Vault logo" className="h-[75px] w-[75px]" />*/}
          <div className="ml-2">
            <div className="font-noticiaText font-bold text-[32px] text-[#252626]">
              Vault
            </div>
            <div className="font-lato font-medium text-[12px] text-[#666667]">
              Track and Manage Your RE Investment
            </div>
          </div>
        </div>
        <div className="stepper lg:justify-start lg:items-start ld:flex lg:flex sm:flex-col pr:flex-col mt-6 sm:items-center sm:justify-between sm:mt-0 sm:pl-0 pr:items-center pr:justify-between pr:mt-0 pr:pl-0 lg:ml-2 ld:ml-2 sm:mx-auto pr:mx-auto">
          <div className="flex ld:flex-col lg:flex-col ld:items-center ld:mr-4 lg:items-center lg:mr-4 sm:flex-row sm:justify-center sm:items-center sm:space-x-0 sm:mt-6 pr:flex-row pr:justify-between pr:items-center pr:space-x-0 pr:mt-6 pr:w-[100%] mx-auto">
            {[1, 2, 3].map((step, index) => {
              return (
                <div
                  key={step}
                  className="flex flex-col sm:flex-row items-center pr:flex-row"
                >
                  {index !== 0 && (
                    <div
                      className={`ld:w-[2px] lg:w-[2px] sm:block pr:block w-full ${lineColor(
                        step - 1
                      )}`}
                    ></div>
                  )}
                  <button
                    className={`w-10 h-10 sm:w-[28px] sm:h-[28px] rounded-full flex items-center justify-center  
                                ${
                                  stepsCompleted[step]
                                    ? "bg-[#27A84A]"
                                    : "bg-[#F0FFFF] ring-[1px] ring-[#95BAB6]"
                                }
                                ${step === currentStep ? "" : ""}
                                font-montserrat text-[14px] sm:text-[14px] font-semibold `}
                  >
                    {stepsCompleted[step] ? (
                      <img src={tick} alt="Completed" className="w-6 h-6" />
                    ) : (
                      step
                    )}
                  </button>
                  {index !== 2 && (
                    <div
                      className={`ld:w-[2px] lg:w-[2px] sm:block pr:block w-full ${lineColor(
                        step
                      )}`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col sm:flex-row sm:mt-2 sm:w-full sm:justify-between pr:flex-row pr:justify-between pr:mt-2 pr:w-full">
            <div className="font-lato font-semibold text-[14px] text-[#252626] mt-[12px] sm:mt-0 pr:mt-0 sm:font-medium sm:text-[12px]">
              Project
            </div>
            <div className="font-lato font-semibold text-[14px] text-[#252626] mt-[67px] sm:mt-0 pr:mt-0 sm:font-medium sm:text-[12px]">
              Unit Details
            </div>
            <div className="font-lato font-semibold text-[14px] text-[#252626] mt-[67px] sm:mt-0 pr:mt-0 sm:font-medium sm:text-[12px]">
              Summary
            </div>
          </div>
        </div>
        <div className="flex items-end justify-start pl-[10px] mt-36 space-x-4 sm:hidden pr:hidden grow ">
          <img
            src={whatsapp}
            alt="whatsapp"
            onClick={openWhatsapp}
            className="h-[56px] w-[56px] cursor-pointer"
          />
          <div className="ml-2 space-y-[6px]">
            <div className="font-montserrat font-medium text-[12px] text-[#252626]">
              Need Help?
            </div>
            <div className="font-lato font-bold text-[18px] text-[#252626]">
              Tell Us
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  currentStep: PropTypes.number.isRequired,
  stepsCompleted: PropTypes.object.isRequired,
};

export default Sidebar;
