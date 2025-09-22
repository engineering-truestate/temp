const whatsappIcon = '/assets/shared/icons/whatsappIcon.svg';
import InvManager from "../../utils/InvManager";

const PropertiesDeals = () => {
  const handleClick = () => {
    const phoneNumber = InvManager.phoneNumber;
    const message = encodeURIComponent(
      `Hi - I would like to know more about Exclusive Opportunities at TruEstate`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };
  return (
    <div className="py-20 px-4 md:px-20 lg:px-40">
      <div className="flex flex-col overflow-y-hidden relative gap-3">
        <div className="font-['Montserrat'] font-bold text-[22px] leading-[150%] tracking-[0px] align-middle">
          Unlock Exclusive Real Estate Opportunities with TruEstate
        </div>
        <div className="flex flex-col">
          <div className="font-['Lato'] font-[500] text-[16px] leading-[179%] tracking-[0px] align-middle">
            Go beyond market listings with TruEstate. Our exclusive tie-ups with
            property owners and developers mean that they come directly to us to
            sell, giving our investors early access to exclusive opportunities -
            from special allocations in prime projects to distress sales and
            off-market resale opportunities.
          </div>
          <div className="font-['Lato'] font-[500] text-[16px] leading-[179%] tracking-[0px] align-middle">
            Because we're a trusted name when it comes to real estate investing,
            you benefit from opportunities that never make it to public portals.
            First access. Better prices. No noise. Contact us to know more.
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-4">
          <button
            onClick={handleClick}
            className="bg-[#153E3B] px-[32px] py-[12px] rounded-[4px] inline-flex items-center gap-[8px]"
          >
            <img
              src={whatsappIcon}
              alt="WhatsApp"
              className="w-[24px] h-[24px]"
            />
            <p className="text-[#FAFBFC] font-lato font-semibold text-[14px] leading-[1.5]">
              Know More
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesDeals;
