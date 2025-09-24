import React from "react";
import { MessageCircle } from "lucide-react";
import JoinUsButton from "./JoinUsButton";
import PhoneIcon from "../../assets/home/phoneIcon.png";
import whatsappIcon from "../../assets/home/whatsappIcon.svg";
// User icons now loaded from public assets
import user1 from '../../../../public/assets/images/illustrations/user1.svg';
import user2 from '../../../../public/assets/images/illustrations/user2.svg';
import user3 from '../../../../public/assets/images/illustrations/user3.svg';
import user4 from '../../../../public/assets/images/illustrations/user4.svg';

const JoinOurWhatsappCommunity = () => {
  return (
    <div className="overflow-hidden py-6 px-4 md:px-12 lg:px-24">
      <div
        className="bg-yellow-100 w-full relative overflow-hidden"
        style={{
          borderRadius: "16px",
          background: "linear-gradient(275deg, #FAF1CE 8.09%, #F5E39D 86.23%)",
          minHeight: "200px",
        }}
      >
        {/* Main content container with proper padding */}
        <div
          className="z-10 w-full h-full flex flex-col items-center lg:justify-between lg:items-end gap-[70px] md:gap-[0px] lg:flex-row"
        >
          {/* Text content section - takes full width on mobile, partial on desktop */}
          <div className="px-[28px] pt-[32px] md:px-[40px] md:pt-[36px] lg:px-[56px] lg:pt-[67px] lg:pb-[67px] w-full h-full space-y-[28px] z-10">
            <div className="space-y-[10px]">
              <h1
                className="text-[28px] lg:text-[36px] font-bold text-[#1E2521] text-center md:text-left font-heading"
              >
                Join our WhatsApp Community
              </h1>

              <div className="w-full flex justify-center md:justify-start">
                <p
                  className="text-[#433F3E] text-center md:text-left max-w-[500px] font-lato text-[16px] lg:text-[18px]"
                >
                  Get access to exclusive insights, discussions and updates about
                  real estate in Bengaluru. Only for verified investors.
                </p>
              </div>
            </div>

            <div className="space-y-[10px] flex flex-col items-center md:items-start">
              <a
                href="https://chat.whatsapp.com/G0ukJV5Qlz9A6Ckt9hYsou?mode=ac_t"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#153E3B] px-[32px] py-[12px] rounded-[4px] inline-flex items-center gap-[8px]"
              >
                <img src={whatsappIcon} alt="WhatsApp" className="w-[24px] h-[24px]" />
                <p className="text-[#FAFBFC] font-lato font-semibold text-[14px] leading-[1.5]">Apply to Join</p>
              </a>

              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  <div className="w-7 h-7 rounded-full overflow-hidden relative z-40 border-2 border-white">
                    <img
                      src={user1}
                      alt="Member"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-7 h-7 rounded-full overflow-hidden relative z-30 border-2 border-white">
                    <img
                      src={user2}
                      alt="Member"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-7 h-7 rounded-full overflow-hidden relative z-20 border-2 border-white">
                    <img
                      src={user3}
                      alt="Member"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-7 h-7 rounded-full overflow-hidden relative z-10 border-2 border-white">
                    <img
                      src={user4}
                      alt="Member"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <p className="font-lato text-[14px] leading-[150%] font-semibold text-[#433F3E]">
                  1000+ Members
                </p>
              </div>
            </div>
          </div>

          {/* Phone image container with proper positioning */}
          <div className="flex items-center justify-center md:justify-end w-full h-full z-40">
            <img
              src={PhoneIcon}
              alt="Phone mockup"
              className="w-[358px] max-w-[522px] md:w-[422px] lg:w-[524px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinOurWhatsappCommunity;
