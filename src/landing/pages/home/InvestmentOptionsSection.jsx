/**
 * InvestmentOptionsSection Component
 *
 * Description:
 * A React functional component that showcases investment options by displaying a heading,
 * a series of statistical cards, and a descriptive paragraph at the bottom.
 * It leverages the `StatCard` component to display individual statistics.
 * The component is styled using Tailwind CSS classes for responsiveness and design consistency.
 *
 * Dependencies:
 * - React
 * - StatCard component (imported from "../components/homePage/investmentOptionsSection/StatCard")
 *
 * Usage:
 * Import and include <InvestmentOptionsSection /> in your page or component where you want this section to appear.
 *
 * Example:
 * <InvestmentOptionsSection />
 */

import React from "react";
import StatCard from "../../components/homePage/investmentOptionsSection/StatCard";
import JoinUsButton from "./JoinUsButton";
import { useSelector } from "react-redux";

const InvestmentOptionsSection = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <section className=" px-4 py-16 md:px-20 md:py-10 md:pb-20 lg:px-24 lg:py-14 lg:pb-24 ">
      {/* Outer container with background and rounded corners */}
      <div
        className="flex w-full flex-col gap-8 rounded-2xl bg-white px-2 py-10 md:p-10 md:gap-10 lg:p-14 lg:gap-14"
        style={{ boxShadow: "0 0 4px 0 rgba(0,0,0,0.08)" }}
      >
        {/* Inner container for heading and cards */}
        <div className="flex flex-col gap-8 md:gap-10 lg:gap-16">
          {/* Heading */}
          <h2 className="font-heading text-display-xs text-center md:text-display-sm lg:text-display-md">
            Invest in Real Estate Confidently with TruEstate
          </h2>

          <p className="font-subheading text-heading-medium-xxs text-center text-gray-800 md:text-heading-medium-sm lg:text-heading-medium-md">
           When you invest with us - you invest with trust and transparency. Filter the signal from the noise in Bengaluru's real estate market.
          </p>

          {/* Cards section */}
          <div className="flex flex-col justify-between gap-10 md:flex-row md:gap-6 items-stretch self-center">
            {/* StatCard components displaying statistical information */}
            <StatCard
              title="DEMAND"
              value="250+"
              description="HNI Investors on our Platform"
            />
            <StatCard
              title="GROWTH"
              value="10%"
              description="Average CAGR for Projects we've Recommended"
            />
            <StatCard
              title="PROFIT"
              value="22%"
              description="Average IRR for Projects we've Recommended"
            />
          </div>
        </div>

        {/* Bottom description */}

        {!isAuthenticated && (
          <>
            

              <div className="flex items-center justify-center ">
                <JoinUsButton />
              </div>
           
          </>
        )}
      </div>
    </section>
  );
};

export default InvestmentOptionsSection;
