import React from "react";
import StepSection from "../home/StepSection";
import { useDispatch, useSelector } from "react-redux";

import { setShowSignInModal } from "../../../slices/modalSlice";
// User icons now loaded from public assets
const user1 = '/assets/ui/icons/user1.svg';
const user2 = '/assets/ui/icons/user2.svg';
const user3 = '/assets/ui/icons/user3.svg';
const user4 = '/assets/ui/icons/user4.svg';

function Working() {
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // const dispatch = useDispatch();
  // const handleSignInClick = () => {
  //   dispatch(setShowSignInModal({ showSignInModal: true, redirectUrl: ('/properties') }));
  // };
  // return (
  //   <section className="bg-GableGreen">
  //     <div className="container  px-4 md:px-20 lg:px-24 py-10 md:py-10 lg:py-28 flex flex-col gap-10 md:gap-16 lg:gap-16">
  //       {/* Constant Text Section */}
  //       <header className="flex flex-col gap-4 text-center items-center">
  //         {/* Heading (H1) */}
  //         <h1 className="text-display-xs md:text-display-sm lg:text-display-md font-heading w-full text-DefaultWhite">
  //           Find a property that's right for{" "}
  //           <span className="text-You shadow-insetWhite">You</span>
  //         </h1>

  //         {/* Subheading/Description (Body Text) */}
  //         <p className="text-heading-medium-xxs md:text-heading-medium-sm lg:text-heading-medium-md text-gray-200 font-subheading lg:w-9/12 ">
  //           From complex processes to seamless solutions, we simplify every
  //           step. Experience ease in managing real estate with our intuitive
  //           tools.
  //         </p>
  //       </header>

  //       {/* Interactive Section */}
  //       <StepSection />
  //       {!isAuthenticated && (
  //         <>
  //           <div className="flex flex-col items-center gap-1 p-2">
  //             <div className="flex  relative">
  //               {/* User avatars overlapping effect */}
  //               <div className="w-7 h-7 rounded-full overflow-hidden  relative z-10 ">
  //                 <img src={user4} alt="Member" className="w-full h-full object-cover" />
  //               </div>

  //               <div className="w-7 h-7 rounded-full overflow-hidden  relative z-20 -ml-3">
  //                 <img src={user3} alt="Member" className="w-full h-full object-cover" />
  //               </div>
  //               <div className="w-7 h-7 rounded-full overflow-hidden  relative z-30 -ml-3">
  //                 <img src={user2} alt="Member" className="w-full h-full object-cover" />
  //               </div>

  //               <div className="w-7 h-7 rounded-full overflow-hidden  relative z-40 -ml-3">
  //                 <img src={user1} alt="Member" className="w-full h-full object-cover" />
  //               </div>

  //               {/* Member count text */}
  //               <div className=" flex items-center">
  //                 <p className="font-lato text-base text-white font-black">
  //                   1000+ Members
  //                 </p>
  //               </div>
  //             </div>

  //             {/* Join button */}
  //             <button
  //               className="bg-white text-[#153E3B] font-black font-lato text-base px-5 py-4 rounded  gap-2 transition duration-300"
  //               onClick={handleSignInClick}
  //             >
  //               Join TruEstate Club
  //             </button>
  //           </div>
  //         </>
  //       )}
  //     </div>
  //   </section>
  // );
}

export default Working;
