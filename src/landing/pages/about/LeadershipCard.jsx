import TeamMemberCard from './TeamMemberCard';

const LeadershipCard = ({ image, name, position, message, isLeadership, reverse }) => {
  return (
    <div
      className={`bg-white p-2 md:p-10 xl:p-14 flex flex-col 
                justify-between items-center gap-4 md:gap-10 rounded-3xl w-full mx-auto !border !border-black/10 h-full`}
      
                // style={{ boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.08)" }}
    >
      {/* Left Side: Leader's Image and Info */}
      <TeamMemberCard 
        image={image} 
        name={name} 
        position={position} 
        isLeadership={isLeadership}  
      />
      
      {/* Right Side: Message or Note */}
      <div className=" md:flex flex-col hidden w-full items-center justify-center lg:max-w-[85%]">
        
        <div className="w-full flex flex-col text-center mx-auto gap-4">
          <h3 className="text-heading-semibold-xxs md:text-heading-semibold-sm lg:text-heading-semibold-md font-subheading text-GreenBlack">
            {message.title}
          </h3>
          <p className="text-paragraph-xxs md:text-paragraph-xs lg:text-paragraph-lg text-ShadedGrey font-body">
            {message.content}  
          </p>
        </div>

      </div>
    </div>
  );
};

export default LeadershipCard;

