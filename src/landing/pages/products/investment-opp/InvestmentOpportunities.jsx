import HeroSection from './HeroInvestment';
import WhatMakesGoodInvestment from './GoodInvestment';
import Filters from './Filters';
import PropertyBrowseOptions from './BrowseOptions';
// import ActionOnProperties from './ActionOnProperties';

const InvestmentOpportunities = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* What Makes a Good Investment Section */}
      <WhatMakesGoodInvestment />

      {/* What Makes a Good Investment Section */}
      <Filters />

      {/* Property Browse Options */}
      <PropertyBrowseOptions />

      {/* Take Action on Properties */}
      {/* <ActionOnProperties /> */}
    </div>
  );
};

export default InvestmentOpportunities;
