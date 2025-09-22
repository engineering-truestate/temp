// TeamMemberCard.js

import './AboutUs.css'

const TeamMemberCard = ({ image, name, position, isLeadership }) => {
  return (
    <div
      className={`bg-white flex flex-col items-center justify-center gap-2.5 md:gap-3 rounded-2xl p-[20px_16px] md:p-[30px_30px] lg:p-[40px_30px] team-member-card
        
        ${isLeadership 
              ? "w-full md:w-[330px] h-auto !border !border-black/10 !shadow-none" 
              : "w-40 md:w-[330px] h-auto !border !border-black/10 !shadow-none"
        }`}

      style={{ boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.08)" }}
    >
      {/* Team Member Image */}
      <div className={`rounded-full overflow-hidden ${isLeadership ? "w-44 h-44 " : "w-20 h-20 md:w-44 md:h-44 "}`}>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Team Member Name and Position */}
      <div className="text-center flex flex-col gap-0.5 md:gap-1">
        <h3 className="text-heading-bold-xxxs md:text-heading-bold-sm lg:text-heading-bold-md2 font-subheading text-GreenBlack">
          {name}
        </h3>
        <p className="text-label-xxs md:text-label-xs lg:text-label-sm text-ShadedGrey font-body">
          {position}
        </p>
      </div>
    </div>
  );
};

export default TeamMemberCard;
