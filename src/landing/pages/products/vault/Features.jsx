// Features.jsx
// This component displays a section showcasing various features of the Vault service.
// It consists of multiple feature cards, each detailing a specific aspect of property management.
// The layout is responsive, adapting to different screen sizes using Tailwind CSS.

import FeatureCard from "./FeatureCard.jsx"; // Import the FeatureCard component
import dmCardImage from "../../../assets/vault/DM.webp"; // Import Document Management card image
import vrCardImage from "../../../assets/vault/VR.webp"; // Import Valuation Report card image
import tpCardImage from "../../../assets/vault/TDS.webp"; // Import TDS Payment card image
import lmCardImage from "../../../assets/vault/LM.webp"; // Import Loan Management card image
import rmCardImage from "../../../assets/vault/RM.webp"; // Import Rental Management card image
import lcCardImage from "../../../assets/vault/LC.webp"; // Import Local Compliance card image
import sypCardImage from "../../../assets/vault/SP.webp"; // Import Sell Your Property card image

function Features() {
  return (
    <div className="container px-4 md:px-20 lg:px-24 gap-10 md:gap-12 lg:gap-16 py-10 lg:py-14 flex flex-col items-center justify-between">
      
      {/* Title Section */}
      <h2 className="font-heading text-center text-display-xs md:text-display-sm lg:text-display-md">
        Features
      </h2>

      {/* Feature Cards Section */}
      <div className="w-full flex flex-col items-center justify-between space-y-8 md:space-y-8">
        
        {/* Row 1: Valuation Report & Local Compliance */}
        <div className="w-full flex flex-col md:flex-row items-stretch justify-between space-y-8 md:space-y-0 md:space-x-8">
          {/* Valuation Report Card */}
          <FeatureCard
            title="Valuation Report"
            description="Track valuation and return on your investment every quarter"
            imgSrc={vrCardImage}
            className="xl:max-w-[50%]"
          />
          
          {/* Local Compliance Card */}
          <FeatureCard
            title="Local Compliance"
            description="Property tax payments, Khata transfer, electricity bill transfer"
            imgSrc={lcCardImage}
          />
        </div>

        {/* Row 2: Loan Management & (TDS Payment + Sell Your Property) */}
        <div className="w-full flex flex-col md:flex-row items-stretch justify-between space-y-8 md:space-y-0 md:space-x-8">
          
          {/* Loan Management Card */}
          <FeatureCard
            title="Loan Management"
            description="Track home loans, EMIs, get best rate offers, transfer with ease"
            imgSrc={lmCardImage}
            className="xl:max-w-[50%]"
          />
          
          {/* Column with two stacked cards (TDS Payment + Sell Your Property) */}
          <div className="flex flex-col gap-8">
            <FeatureCard
              title="TDS Payment"
              description="Calculate, pay and track TDS payments on every installment"
              imgSrc={tpCardImage}
              className="flex-grow w-full md:w-auto"
            />
            <FeatureCard
              title="Sell Your Property"
              description="Exit your investments hassle free with best returns."
              imgSrc={sypCardImage}
              className="flex-grow w-full md:w-auto"
            />
          </div>
        </div>

        {/* Row 3: Document Management & Rental Management */}
        <div className="w-full flex flex-col md:flex-row items-stretch justify-between gap-8 md:gap-6 lg:gap-8"> 
          {/* Document Management Card */}
          <FeatureCard
            title="Document Management"
            description="Centralize all your real estate documents in one secure location. Easily access deeds, contracts, and more whenever you need them."
            imgSrc={dmCardImage}
            className="flex-grow w-full md:w-auto"
          />

          {/* Rental Management Card */}
          <FeatureCard
            title="Rental Management"
            description="Manage all your rental documents in one secure place. Access leases, agreements, and invoices easily whenever you need them."
            imgSrc={rmCardImage}
            className="flex-grow w-full md:w-auto"
          />
        </div>
      </div>
    </div>
  );
}

export default Features; // Export the Features component
