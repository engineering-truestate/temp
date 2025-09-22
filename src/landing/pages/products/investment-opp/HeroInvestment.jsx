import LargeButton from '../../../components/button/LargeButton';
// import BackGrid from '../../assets/home/BackGrid.webp'; 
import interfaceImg from '../../../assets/investment-opp/opportuniteHero.webp';
import fwdArrow from '../../../assets/home/fwdArrow.svg';

import InvManager from "../../../../utils/InvManager";

import { logEvent } from 'firebase/analytics';
import { analytics } from '../../../../firebase';
import { setShowSignInModal } from '../../../../slices/modalSlice';
import { useDispatch } from 'react-redux';

const LandingPage = () => {
  const dispatch = useDispatch();

  return (
    <div className="container md:h-auto lg:min-h-screen lg:h-full overflow-hidden py-16 md:py-20 lg:py-24 lg:pb-25 px-4 md:px-20 lg:px-24">

      {/* Content Section */}
      <div className="relative z-10 flex flex-col items-center text-center gap-5 md:gap-6 lg:gap-7 font-body">

        {/* Alert Badge */}
        <a
          onClick={() => {
            // Track the click event
            logEvent(analytics, 'badge_cta_investment_opp_hero');
            dispatch(setShowSignInModal({ showSignInModal: true, redirectUrl: ('/properties') }));
          }}
          className="no-underline transition-all duration-300 ease-in-out group border-2 border-transparent hover:border-GableGreen/20 rounded-full">

          {/* Outer container with hover effects */}
          <div className="flex items-center bg-AthensGrey hover:bg-white text-GreenBlack font-body font-medium text-label-xs 
                          md:text-label-sm lg:text-label-md rounded-2xl py-0.5 pl-0.5 pr-2 gap-1.5 transition-all duration-300 ease-in-out 
                          group border-[1px] border-transparent hover:border-GableGreen/90">

            {/* Alert text with green background */}
            <span className="px-2 py-0.5 md:px-[10px] md:py-1 bg-GableGreen rounded-full text-white">
              TruEstate
            </span>

            {/* Description text and forward arrow icon */}
            <p className="flex items-center">
              Know More
              <img src={fwdArrow} alt="Dropdown Arrow"
                className="h-2 w-2 ml-2 mt-[1px] -translate-x-1 transition-transform duration-300 ease-in-out group-hover:-translate-x-0.5" />
            </p>

          </div>
        </a>


        {/* Main Heading */}
        <div className="flex flex-col gap-3 md:gap-4 lg:gap-5">
          <div>
            <h1 className="text-display-sm md:text-display-md lg:text-display-lg font-heading font-bold text-GreenBlack">
              Discover the best
              <br className="hidden md:block " /> Investment Opportunities
            </h1>
          </div>

          {/* Subheading */}
          <div>
            <p className="text-heading-medium-xxs md:text-heading-medium-sm lg:text-heading-medium-md  text-gray-800 font-subheading">
              Get expert insights <br className="md:hidden block " /> proprietary data and custom recommendations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:flex gap-3 flex-col md:flex-row justify-center items-center">
          {/* Call to Action Button - Browse Investment Properties */}
          <div>
            <LargeButton
              label="Browse Properties"
              onClick={() => dispatch(setShowSignInModal({ showSignInModal: true, redirectUrl: ('/properties') }))}
              classes="font-body text-label-sm md:text-label-md w-full"
              eventName="cta_click"                     // Tracking event name
              eventCategory="CTA"                       // Tracking category
              eventAction="click"                       // Tracking action
              eventLabel="browse_cta_investment_opp_hero" // Tracking label for Browse button
            />
          </div>

          {/* Call to Action Button - Talk to Us */}
          <div>
            <LargeButton
              href={`https://wa.me/${InvManager.phoneNumber}?text=${"Hi, I’d like to know more about your offerings and how TruEstate can help with my property needs. Could you provide more details? Thank you!"}`}
              label="Talk to us"
              classes="text-label-sm md:text-label-md bg-transparent !text-GableGreen hover:!bg-GableGreen hover:!text-white font-body w-full"
              eventName="cta_click"                     // Tracking event name
              eventCategory="CTA"                       // Tracking category
              eventAction="click"                       // Tracking action
              eventLabel="talk_2_us_cta_investment_opp_hero" // Tracking label for Talk to Us button
            />
          </div>
        </div>

      </div>

      <div className="relative w-full h-full">

        {/* Interface Image */}
        <div className="relative hidden z-20 md:flex justify-center items-center mt-10 md:mt-10 lg:mt-[4.5rem]">
          <img src={interfaceImg} alt="Interface" className="mx-auto w-full lg:w-[67rem]" />
        </div>

        {/* Background Squares */}
        {/* <div className="absolute md:top-[0%] lg:top-[0%] inset-0 hidden md:flex justify-center items-center w-full h-full">
          <img src={BackGrid} alt="Background Grid" className="h-fit w-fit object-cover opacity-50 lg:opacity-50" />
        </div> */}
      </div>
    </div>
  );
};

export default LandingPage;
