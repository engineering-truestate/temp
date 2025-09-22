import PerkCard from '../../components/career/perks/PerkCard';

// Importing the icons for each perk
import growthIcon from '../../assets/career/perks/grow.svg'; 
import flexibleWorkIcon from '../../assets/career/perks/calendar.svg';
import compensationIcon from '../../assets/career/perks/money.svg';
import healthIcon from '../../assets/career/perks/heart.svg';
import cultureIcon from '../../assets/career/perks/bulb.svg';
import impactIcon from '../../assets/career/perks/globe.svg';

// Array of perks, each with an icon and a label
const perks = [
  { 
    icon: growthIcon, 
    title: 'All-Round Growth', 
    description:'Get a chance to work across functions and projects, and learn things end-to-end' 
  },
  { 
    icon: flexibleWorkIcon, 
    title: 'Flexible Work Environment', 
    description:'Get the freedom to work on what really interests and excites you' 
  },
  { 
    icon: compensationIcon, 
    title: 'Competitive Compensation', 
    description:'We offer generous incentives and ESOPs for all our employees to benefit from our growth' 
  },
  { 
    icon: healthIcon, 
    title: 'Healthcare Benefits', 
    description:'Balance work and health with our comprehensive employee health plans' 
  },
  { 
    icon: cultureIcon, 
    title: 'High Impact Roles', 
    description:'Get high-ownership work that enables you to directly see the difference you make' 
  },
  { 
    icon: impactIcon, 
    title: 'Fast-Learning Roles', 
    description:'Get the experience of working in an exciting, fast-growing startup' 
  },
];

const PerksAndBenefits = () => {
  return (
    // Section container with padding for spacing
    <section className=" container py-16 md:py-10 lg:py-14 px-4 md:px-20 lg:px-24" id="PerksAndBenefits">

      <div>
      
          { /* Container for the section content with vertical spacing */}
      <div className="mx-auto flex flex-col text-center gap-8 md:gap-12 lg:gap-16">
        
        {/* Section Title and Description */}
        <div className="flex flex-col gap-3 md:gap-4 lg:gap-5">
          {/* Section Title */}
          <h2 className="text-display-xs md:text-display-sm lg:text-display-md font-heading text-GreenBlack">
            Benefits and Perks
          </h2>
        
          {/* Section Description */}
          <p className="text-heading-medium-xxs md:text-heading-medium-sm lg:text-heading-medium-md text-ShadedGrey mx-auto font-subheading">
            {/* At TruEstate, we support a diverse team. */}
          </p>
        </div>
        
         {/* Perk Cards Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center justify-center">
          {perks.map((perk, index) => (
            <PerkCard 
              key={index} 
              icon={perk.icon} 
              title={perk.title} 
              description={perk.description} 
            />
          ))}
        </div>

      </div>
      </div>
    </section>
  );
};

export default PerksAndBenefits;
