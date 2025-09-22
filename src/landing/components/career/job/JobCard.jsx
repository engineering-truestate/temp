import SmallButton from '../../button/SmallButton';

const JobCard = ({ title, location, applyLink }) => {
  return (
    <div className="flex justify-between items-center py-8 md:py-6 lg:py-8 border-b border-GreenBlack/40">
      <div className='flex-col flex items-start'>
        <h3 className="text-heading-semibold-xs lg:text-heading-semibold-sm text-GreenBlack font-subheading ">{title}</h3>
        <p className="text-paragraph-xs lg:text-paragraph-md text-ShadedGrey font-body">{location}</p>
      </div>
      {/* Replace the link with the SmallButton component */}
      <SmallButton 
        href={`mailto:${"contact@truestate.in"}`}
        label="Apply"    // Button text
        classes="text-label-sm md:text-label-md lg:text-label-lg bg-white hover:bg-[#F4F4F4] border-none !text-black" // Adjust button text size as needed
      />
    </div>
  );
};

// onClick={() => window.open(`mailto:${agentDetails.email}`, "_blank")}

export default JobCard;
