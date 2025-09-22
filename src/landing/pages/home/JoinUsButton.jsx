import React from "react";
import { setShowSignInModal } from "../../../slices/modalSlice";
import { useDispatch } from "react-redux";
// Note: Import paths should match your project structure
// User icons now loaded from public assets
const user1 = '/assets/ui/icons/user1.svg';
const user2 = '/assets/ui/icons/user2.svg';
const user3 = '/assets/ui/icons/user3.svg';
const user4 = '/assets/ui/icons/user4.svg';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../../firebase';

const JoinUsButton = () => {
  const dispatch = useDispatch();
  const handleSignInClick = () => {
    dispatch(setShowSignInModal({ showSignInModal: true, redirectUrl: ('/properties') }));
  };

  return (
    <div className="flex flex-col items-start gap-1 p-2">


      <button
        className="bg-[#153E3B] text-white font-bold font-lato text-base px-5 py-4 rounded hover:bg-[#0d2a28] gap-2 transition duration-300"
        onClick={() => {
          handleSignInClick()
          logEvent(analytics,"Join_TruEstate_Club_button")
        }}
      >
        Join TruEstate Club
      </button>
      <div className="flex  relative">

        <div className="w-7 h-7 rounded-full overflow-hidden  relative z-10 ">
          <img src={user4} alt="Member" className="w-full h-full object-cover" />
        </div>

        <div className="w-7 h-7 rounded-full overflow-hidden  relative z-20 -ml-3">
          <img src={user3} alt="Member" className="w-full h-full object-cover" />
        </div>
        <div className="w-7 h-7 rounded-full overflow-hidden  relative z-30 -ml-3">
          <img src={user2} alt="Member" className="w-full h-full object-cover" />
        </div>

        <div className="w-7 h-7 rounded-full overflow-hidden  relative z-40 -ml-3">
          <img src={user1} alt="Member" className="w-full h-full object-cover" />
        </div>


        <div className=" flex items-center">
          <p className="font-lato text-base text-[#433F3E] font-black">
            1000+ Members
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinUsButton;