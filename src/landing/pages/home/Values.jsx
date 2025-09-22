// Values.jsx
// ========================
// This component renders the "Trust, Transparency, and Results" value proposition section.
// It showcases three value propositions using alternating layouts, each highlighting key benefits of TruEstate.
// Each value proposition consists of an image, title, description, icon, and link.
// ========================

import React from 'react';
import ValueProposition from '../../components/valueProposition/ValueProposition'; // Component for standard value proposition layout
import ValuePropositionOdd from '../../components/valueProposition/ValuePropositionOdd'; // Component for alternating layout

// Import images and icons for the value propositions
import Image1 from '../../assets/valueProposition/VP1.webp';
import Image2 from '../../assets/valueProposition/VP2.webp';
import Image3 from '../../assets/valueProposition/VP3.webp';
import Icon1 from '../../assets/valueProposition/VP1.svg';
import Icon2 from '../../assets/valueProposition/VP2.svg';
import Icon3 from '../../assets/valueProposition/VP3.svg';

const Values = () => {
  return (
    <section >
      <div className="mx-auto px-4 md:px-20 lg:px-24 py-16 md:py-20 lg:py-24">
        <div className=" flex flex-col gap-8 md:gap-10 lg:gap-16">

          {/* Heading */}
          <div className="items-center flex justify-center">
            <h1 className="flex font-heading text-display-xs md:text-display-sm lg:text-display-md text-center">
              Trust, Transparency and Results
            </h1>
          </div>

          {/* Value Propositions */}
          <div className="flex flex-col gap-10 md:gap-20 lg:gap-14">
            
            {/* First Value Proposition */}
            <ValueProposition 
              subtitle="Proprietary Data"
              icon={Icon1} // Icon for this value proposition
              title="Decisions built on data. Not guesswork."
              description="TruEstate provides authentic data from official, verified sources. No misleading prices or deceptive project details."
              linkText="Browse Listings"
              linkHref="#" // Placeholder link for action
              imageSrc={Image1} // Image for this value proposition
            />

            {/* Second Value Proposition (alternating layout) */}
            <ValuePropositionOdd 
              subtitle="Expert Guidance"
              icon={Icon2} // Icon for this value proposition
              title="Data is good. Expert advice makes it better."
              description="Our in-house real estate advisors give you the nuances of a project that numbers won’t capture."
              linkText="Talk to an Expert"
              linkHref="#" // Placeholder link for action
              imageSrc={Image2} // Image for this value proposition
            />

            {/* Third Value Proposition */}
            <ValueProposition 
              subtitle="Management Tools"
              icon={Icon3} // Icon for this value proposition
              title="Manage your property with us for best returns."
              description="We regularly track real estate prices and trends for you, so that you can decide when to rent and when to sell."
              linkText="Try a tool"
              linkHref="#" // Placeholder link for action
              imageSrc={Image3} // Image for this value proposition
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values;
