import React from 'react';
import { useDispatch, useSelector } from "react-redux";
const DisclaimerSection = () => {

    

  const isPropertiesPath = () => location.pathname.startsWith('/properties');
  const isAuthenticated = useSelector((state=>state.auth.isAuthenticated));


  return (
    <div className= {`  flex flex-col items-center pt-5    ${ !isAuthenticated && isPropertiesPath()  ? `pb-28 md:pb-20 lg:pb-10 ` : `pb-10`  }   `}   >
      {/* Separator Line */}
      <hr className="w-full border-[1px] border-[#F0F1F2] opacity-20" />

      {/* Company Information */}
      <div className="flex justify-between pt-4 text-DefaultWhite">
        <h6 className="mx-auto font-body text-center">
          © 2025 IQOL Technologies Pvt Ltd, All Rights Reserved.
        </h6>
      </div>

      {/* Disclaimer Text */}
      <div className="mt-4 flex items-start justify-center">
        <p className="relative text-base font-regular text-justify font-body text-RegentGray">
          <span className="text-DefaultWhite">Disclaimer:</span> TruEstate does not make any
          representation regarding the suitability of investment opportunities that appear on this
          website. Nothing on this website should be construed legally as financial, business, legal
          or tax advice regarding investment in real estate assets. Listing of the content on this
          website regarding opportunities in real estate assets does not constitute an offer by the
          website to sell, solicit or make an offer to participate in the mentioned opportunities. No
          content available on this website should be interpreted as a solicitation of an offer to buy
          or sell any property. Any decision to make direct or indirect investments in real estate
          assets are subject to significant market risks including risk of loss of capital. These
          decisions should be made only after seeking independent legal, business and tax advice. No
          government body nor private organisation can guarantee or assure any returns to any user who
          decides to use the information on this website to make investments in real estate assets.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerSection;
