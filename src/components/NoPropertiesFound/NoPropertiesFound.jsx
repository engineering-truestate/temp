import emptyImage from "/images/emptyproppg.png";
import ResetIcon from "/assets/icons/actions/reset-white.svg";
import InvManagerIcon from "/assets/icons/brands/investment-manager.svg";
import InvManager from "../../utils/InvManager";

const NoPropertiesFound = ({
  trueS,
  onResetFilters,
  title = "No property available",
  subtitle = null
}) => {
  const openWhatsapp = () => {
    const phoneNumber = InvManager.phoneNumber;
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  const defaultSubtitle =
    trueS === "true"
      ? "Due to some technical issue we're unable to show the recommended properties. Please try again later!"
      : "Please edit your preferences and try again.";

  return (
    <div className="flex flex-col items-center justify-center h-96">
      <img
        src={emptyImage}
        alt="No projects"
        className="w-48 h-48 object-contain mb-4"
      />
      <p className="font-lato text-2xl font-bold text-[#2B2928] mb-2">
        {title}
      </p>
      <p className="font-lato text-base font-normal text-[#5A5555] text-center mb-5 max-w-[600px]">
        {subtitle || defaultSubtitle}
      </p>
      <div className="flex gap-4">
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="hidden sm:flex items-center justify-center gap-2 text-left w-fit h-9 bg-[#153E3B] rounded-md py-2 px-3 mt-5"
          >
            <img src={ResetIcon} alt="" className="w-[18px] h-[18px]" />
            <span className="text-[#FAFAFA]">Reset</span>
          </button>
        )}
        <button
          className="hidden sm:flex items-center justify-center gap-2 text-left w-fit h-9 bg-[#153E3B] rounded-md py-2 px-3 mt-5"
          onClick={openWhatsapp}
        >
          <img src={InvManagerIcon} alt="IM" className="w-6 h-6 md:w-6 md:h-6" />
          <div className="hidden sm:hidden md:block lg:block text-white">
            Contact Inv. Manager
          </div>
        </button>
      </div>
    </div>
  );
};

export default NoPropertiesFound;