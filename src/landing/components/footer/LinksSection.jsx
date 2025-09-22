import React, { useState, useEffect } from 'react';
import ReraLogo from '../../assets/footer/ReraLogo.png';
import { Link } from 'react-router-dom';
import StartupLogo from '../../assets/footer/startup.png';
import { logEvent } from "firebase/analytics";
import { analytics } from "../../../firebase";

const LinksSection = () => {

  const [padding, setPadding] = useState(getPadding(window.innerWidth));

  // Function to determine padding based on window width
  function getPadding(width) {
    if (width <= 320) return 'px-0';       // 0.5rem padding
    if (width <= 376) return 'px-7';       // 1rem padding
    if (width <= 420) return 'px-12';       // 1.25rem padding
    return 'px-8';                         // 2rem padding for larger screens
  }

  // Update padding based on window resize
  useEffect(() => {
    const handleResize = () => {
      setPadding(getPadding(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="w-full h-[16.813rem] mb-5 md:mb-0">
      <div className={`flex flex-col h-full justify-between gap-10 md:gap-10 lg:gap-10 ${padding}`}>

        {/* Links Container */}
        <div className={`flex justify-between lg:justify-start items-start text-left flex-grow `}
         
        >

          {/* Quick Links */}
          <div className="flex flex-col justify-center md:pr-10 gap-4">
            <div className="font-subheading font-bold text-lg text-DefaultWhite leading-[120%]">
              Quick Links
            </div>
            <div className="flex flex-col font-body font-normal text-xs md:text-base text-AthensGrey gap-3 leading-[120%]">
              <Link to="/" className="cursor-pointer" onClick={() => { 
                        logEvent(analytics, "click_outside_footer_home", {Name: "footer_home" });
                      }}>Home</Link>
              <Link to="/about" className="cursor-pointer" onClick={() => {
                logEvent(analytics, "click_outside_footer_about_us", { Name: "footer_home" });
              }}>About us</Link>
              <Link to="/career" className="cursor-pointer"
                onClick={() => {
                  logEvent(analytics, "click_outside_footer_career", { Name: "footer_home" });
                }}>Career</Link>
              <Link to="/contact" className="cursor-pointer"
                onClick={() => {
                  logEvent(analytics, "click_outside_footer_contact_us", { Name: "footer_home" });
                }}>Contact us</Link>
              <Link to="/insights" className="cursor-pointer" onClick={() => {
                  logEvent(analytics, "click_outside_footer_academy", { Name: "footer_academy" });
                }}>Academy</Link>
            </div>
          </div>

          {/* Combined Products and Legal Section */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-0">

            {/* Products */}
            <div className="flex flex-col justify-center md:pr-10 gap-4">
              <div className="font-subheading font-bold text-lg text-DefaultWhite leading-[120%]">
                Products
              </div>
              <div className="flex flex-col font-body font-normal text-xs md:text-base text-AthensGrey gap-3 leading-[120%]">
                <Link to="/products/vault" className="cursor-pointer" onClick={() => {
                  logEvent(analytics, "cta_click_category_outside_footer_vault", { Name: "footer_vault" });
                }}>Vault</Link>
                <Link to="/products/investment-opportunities" className="cursor-pointer">
                  Investment <br className="block md:hidden" /> Opportunities
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div className="flex flex-col justify-center md:pr-10 gap-4">
              <div className="font-subheading font-bold text-lg text-DefaultWhite leading-[120%]">
                Legal
              </div>
              <div className="flex flex-col font-body font-normal text-xs md:text-base text-AthensGrey gap-3 leading-[120%]">
                <Link to="/privacy" target="_blank" className="cursor-pointer"  onClick={() => {
                  logEvent(analytics, "click_outside_footer_privacy_policy", { Name: "footer_privicy_policy" });
                }}
                >Privacy Policy</Link>
                <Link to="/tnc" target="_blank" className="cursor-pointer" onClick={() => {
                  logEvent(analytics, "click_outside_footer_tnc", { Name: "footer_tnc" });
                }}>Terms and Conditions</Link>
              </div>
            </div>

          </div>
        </div>

        {/* Approval Logos */}
        <div className="flex md:gap-12 justify-between lg:justify-start items-center "
                style={{
                  flexDirection: window.innerWidth < 420 ? 'column' : 'row',
                }}
        >
          <div>
            <img src={StartupLogo} alt="Rera Approved Logo" className="h-7 md:h-9 mb-2 md:mb-4" />
          </div>
          <div>
            <img src={ReraLogo} alt="Startup Logo" className="h-7 md:h-9" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinksSection;
