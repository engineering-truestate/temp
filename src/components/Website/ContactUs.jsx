// Logo moved to public folder
// import logo from "../../assets/Images/LogoC.png";
// WhatsApp QR moved to public folder
// import whatsapp from "../../assets/Images/Qr Whatsapp.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { setShowSignInModal } from "../../slices/modalSlice";

const ContactUs = () => {
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Get authentication state from Redux


  const openWhatsapp = () => {
    window.open("https://wa.me/message/MEBQO22EMS6NI1", "_blank");
  };

  const handleNavigate = () => {
    dispatch(setShowSignInModal({ showSignInModal: true, redirectUrl: ('/properties') }));
  };

  return (
    <div
      className="lg:flex-col mx-auto lg:text-center justify-between px-6 h-full"
      style={{
        backgroundImage: "linear-gradient(to bottom, #032E2C, #011A19)",
      }}
    >
      <div className="flex justify-center items-center w-full pt-12">
        <img src="/assets/shared/images/logo.png" alt="logo" className="" />
      </div>
      <div className="mt-8 w-full text-center flex-col justify-center">
        <h2 className="text-[40px] break-words lg:px-80 text-[#F0F1F2] font-bold font-montserrat leading-normal sm:text-3xl sm:leading-normal">
          Interested in knowing more? Send us your details and we’ll be in
          touch!
        </h2>
        <h3 className="mt-4 text-lg text-[#C2C3C4] font-lato sm:text-[16px]">
          PS: Our current dataset is restricted to new projects in Bengaluru.
          More cities coming soon.
        </h3>
      </div>
      <div className="w-full flex justify-center mt-12">
        {!isAuthenticated && (
          <button
            onClick={() => {
              handleNavigate();
              logEvent(analytics, "sign_up_contact", {
                location: "contact", // Specify the location of the button
              });
            }}
            className="text-black bg-[#DC8B06] px-10 py-3 rounded-md flex font-lato text-3xl font-bold sm:text-xl sm:py-4 cursor-pointer"
          >
            Can’t Wait, Sign Me Up!
          </button>
        )}
      </div>
      {/* <div className="w-full flex justify-center items-center mt-10 space-x-6">
        <div className="border border-[#C2C3C4] w-36 rounded-lg"></div>
        <div className="text-[#F0F1F2] font-lato">Or</div>
        <div className="border border-[#C2C3C4] w-36 rounded-lg"></div>
      </div> */}
      <div className="flex justify-center mt-6 space-x-28 items-center">
        <div
          onClick={openWhatsapp}
          className="flex-col items-center justify-center cursor-pointer"
        >
          <img
            src="/assets/shared/images/qr-whatsapp.png"
            alt="whatsapp"
            className="mx-auto mb-2 w-28 sm:w-24 pr:w-28"
          />
          <span className="text-[#C2C3C4] font-lato sm:text-base sm:flex sm:text-center">
            Scan or Tap for whatsapp
          </span>
        </div>
      </div>
      <div className="max-w-[83rem] mx-auto mt-14">
        <div className="border border-[#393939]"></div>
        <div className="flex text-[#FAFBFC] justify-between">
          <h6 className="mt-4 font-lato sm:text-[12px]">
            © Iqol Technologies Pvt. Ltd.
          </h6>
          <h6
            onClick={() => {
              navigate("/privacy");
            }}
            className="mt-4 underline cursor-pointer font-lato sm:text-[12px]"
          >
            Privacy Policy
          </h6>
        </div>
        <div className="flex font-lato sm:text-[12px] space-x-4 text-[#FAFBFC] mt-4">
          <a href="mailto:contact@truestate.in" className="underline">
            contact@truestate.in
          </a>
          <a href="tel:+918420566770" className="underline">
            +91 842-056-6770
          </a>
        </div>
        <div className="pb-10 mt-4">
          <p
            className={`text-justify font-lato text-[#A3A4A5] sm:text-[12px] ${showFullDisclaimer ? "" : "line-clamp-2"
              }`}
          >
            <span className="text-[#FAFBFC]">Disclaimer:</span> TruEstate does
            not make any representation regarding the suitability of investment
            opportunities that appear on this website. Nothing on this website
            should be construed legally as financial, business, legal or tax
            advice regarding investment in real estate assets. Listing of the
            content on this website regarding opportunities in real estate
            assets does not constitute an offer by the website to sell, solicit
            or make an offer to participate in the mentioned opportunities. No
            content available on this website should be interpreted as a
            solicitation of an offer to buy or sell any property. Any decision
            to make direct or indirect investments in real estate assets are
            subject to significant market risks including risk of loss of
            capital. These decisions should be made only after seeking
            independent legal, business and tax advice. No government body nor
            private organisation can guarantee or assure any returns to any user
            who decides to use the information on this website to make
            investments in real estate assets.
          </p>
          {!showFullDisclaimer && (
            <button
              onClick={() => setShowFullDisclaimer(true)}
              className="text-[#F0F1F2] underline mt-2 sm:text-[12px]"
            >
              Show more...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
