import React, { useState, useEffect } from 'react';
import truestimateandgrowth from '../../../assets/investment-opp/goodinvestment/truestimateandgrowth.webp';
import financialmetrics from '../../../assets/investment-opp/goodinvestment/financialmetrics.webp';
import investmentbreakdown from '../../../assets/investment-opp/goodinvestment/investmentbreakdown.webp';
import marketinsights from '../../../assets/investment-opp/goodinvestment/marketinsights.webp';
import marketinsightscropped from '../../../assets/investment-opp/goodinvestment/marketinsightscropped.webp';
import compareproperties from '../../../assets/investment-opp/goodinvestment/compareproperties.webp';

const WhatMakesGoodInvestment = () => {
  const [imageSrc, setImageSrc] = useState(window.innerWidth < 768 ? marketinsightscropped : marketinsights);

  useEffect(() => {
    const handleResize = () => {
      setImageSrc(window.innerWidth < 768 ? marketinsightscropped : marketinsights);
    };

    // Listen to the resize event
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="container flex good-investment-section pb-16 md:pb-10 lg:pb-14 px-4 md:px-20 lg:px-24 bg-background">
      <div className="flex lg:py-7 py-5 lg:px-7 px-5 flex-col gap-10 lg:gap-16 mx-auto border border-[#e3e3e3] rounded-2xl "
          style={{
            paddingLeft: window.innerWidth <= 330 ? '0.75rem' : '1.25rem', // px-3 is 0.75rem, px-5 is 1.25rem
            paddingRight: window.innerWidth <= 330 ? '0.75rem' : '1.25rem',
          }}
      >
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center md:items-start lg:items-center gap-3 md:justify-between">
          <h2 className="text-display-xs md:text-display-sm lg:text-display-md font-heading md:text-left text-center">
            <span className="text-ShadedGrey">Evaluate Investments</span>
            <br className="block md:hidden xl:block"/>
            End-to-End
          </h2>
          <p className="text-heading-medium-xxs md:text-heading-medium-sm lg:text-heading-medium-md text-gray-800 text-center md:text-left lg:max-w-lg font-subheading">
            Use our tools and trackers to understand <span className='font-semibold'>market trends,</span> valuation, and more
          </p>
        </div>

        {/* Investment Points - Grid Section */} 
        <div className="flex flex-col lg:gap-6 gap-4 w-full h-fit ">
          
          <div className="flex flex-col md:flex-row lg:gap-6 gap-4">
            <div className='flex flex-col lg:gap-6 gap-4'>

              {/* TruEstimate and Growth */}
              <div className='flex flex-col md:flex-row lg:gap-6  gap-4'>
                <div className="bg-white border border-gray-300 rounded-lg p-6 md:p-5 lg:p-8 flex flex-col lg:gap-6 md:gap-4 gap-6 w-full">
                  <img 
                    src={truestimateandgrowth} 
                    alt="TruEstimate and Growth" 
                    className="w-full md:w-[14.25rem] lg:w-[20.5rem] h-auto object-cover rounded-xl"
                  />
                  <div className="flex flex-col gap-5 md:gap-3 lg:gap-5">
                    <h3 className="font-subheading uppercase lg:text-heading-medium-xxxs md:text-heading-medium-xxxxs text-heading-medium-xxxs bg-GableGreen text-white w-fit px-4 md:px-3 lg:px-4 py-1 rounded-lg">
                      TruEstimate
                    </h3>
                    <p className='text-gray-800 font-body text-paragraph-xs md:text-paragraph-xxs lg:text-paragraph-lg'>
                      TruEstimate tells you if a property is overvalued or undervalued, along with projected future values.
                    </p>
                  </div>
                </div>

                {/* Financial Metrics */}
                <div className="bg-white border border-gray-300 rounded-lg p-6 md:p-5 lg:p-8 flex flex-col lg:gap-6 md:gap-4 gap-6 w-full">
                  <img 
                    src={financialmetrics} 
                    alt="Financial Metrics" 
                    className="w-full md:w-[14.25rem] lg:w-[20.5rem] h-auto object-cover rounded-xl"
                  />
                  <div className="flex flex-col gap-5 md:gap-3 lg:gap-5">
                    <h3 className="font-subheading uppercase lg:text-heading-medium-xxxs md:text-heading-medium-xxxxs text-heading-medium-xxxs bg-GableGreen text-white w-fit px-4 md:px-3 lg:px-4 py-1 rounded-lg">
                      TruReport
                    </h3>
                    <p className='text-gray-800 font-body text-paragraph-xs md:text-paragraph-xxs lg:text-paragraph-lg'>
                      TruReport provides financial metrics like IRR, Equity Multiple, etc to help you compare investments.
                    </p>
                  </div>
                </div>
              </div>

              {/* Investment Breakdown */}
              <div className="bg-white border border-gray-300 rounded-lg p-6 md:p-5 lg:p-8 flex flex-col md:flex-row-reverse lg:gap-10 md:gap-4 gap-6 w-full items-center h-full">
                <img 
                    src={investmentbreakdown} 
                    alt="Investment Breakdown" 
                    className="w-full md:max-w-[8.25rem] xl:max-w-[18.75rem]  h-auto object-cover rounded-xl" />
                <div className="flex flex-col gap-5 md:gap-3 lg:gap-5 w-full">
                  <h3 className="font-subheading uppercase lg:text-heading-medium-xxxs md:text-heading-medium-xxxxs text-heading-medium-xxxs bg-GableGreen text-white w-fit px-4 md:px-3 lg:px-4 py-1 rounded-lg">
                    Investment Breakdown
                  </h3>
                  <p className='text-gray-800 font-body text-paragraph-xs md:text-paragraph-xxs lg:text-paragraph-lg'>
                    Get a detailed breakdown of your investment - booking amount, taxes, duties, etc.
                  </p>
                </div>
              </div>
            </div>

            {/* Market Insights */}
            <div className="bg-white border border-gray-300 rounded-lg p-6 md:p-5 lg:p-8 flex flex-col lg:gap-6 md:gap-4 gap-6 w-fit md:min-w-[30%] ">
              <img 
                  src={imageSrc} 
                  alt="Market Insights" 
                  className="w-full md:w-[13.375rem] lg:w-[18.75rem] object-left-top h-auto object-cover rounded-xl" 
              />
              <div className="flex flex-col gap-5 md:gap-3 lg:gap-5">
                <h3 className="font-subheading uppercase lg:text-heading-medium-xxxs md:text-heading-medium-xxxxs text-heading-medium-xxxs bg-GableGreen text-white w-fit px-4 md:px-3 lg:px-4 py-1 rounded-lg">
                  Market Insights
                </h3>
                <p className='text-gray-800 font-body text-paragraph-xs md:text-paragraph-xxs lg:text-paragraph-lg'>
                  Get real-time data on property values in an area, along with micro-market trends.
                </p>
              </div>
            </div>
          </div>

          {/* Compare Properties */}
          <div className="bg-white border border-gray-300 rounded-lg p-6 md:p-5 lg:p-8 flex flex-col md:flex-row-reverse lg:gap-10 md:gap-4 gap-6 w-full items-center">
            <img 
                src={compareproperties} 
                alt="Compare Properties" 
                className="w-full md:w-[20rem] lg:w-[28.125rem] h-auto object-cover rounded-xl" />
            <div className="flex flex-col gap-5 md:gap-3 lg:gap-5">
              <h3 className="font-subheading uppercase lg:text-heading-medium-xxxs md:text-heading-medium-xxxxs text-heading-medium-xxxs bg-GableGreen text-white w-fit px-4 md:px-3 lg:px-4 py-1 rounded-lg">
                Property Comparison
              </h3>
              <p className='text-gray-800 font-body text-paragraph-xs md:text-paragraph-xxs lg:text-paragraph-lg md:max-w-full lg:max-w-full xl:max-w-[70%]'>
                Evaluate multiple investment opportunities on key parameters like IRR, CAGR, etc.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhatMakesGoodInvestment;
