import React from "react";
// Project placeholder moved to public folder
// import cardpic from "../../../assets/Images/project-placeholder.webp";
import { toCapitalizedWords } from "../../../utils/common";
import { useNavigate } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../../firebase";
const CardComponent = ({ project }) => {
  const {
    truRecommended,
    data,
    projectOverview,
    launchYear,
    projectName,
    investmentOverview,
    promoterBrandName,
    area,
  } = project;
  console.log(project);
  const navigate = useNavigate();

  const handleViewMore = () => {
    // setting the current scroll position of the properties page while navigating to the project detail page
    //  so that when user return from there page can start from that position
    // if(currentPage==='/properties')
    // dispatch(setProjectsScrollPosition(mainContentRef?.current?.scrollTop));

    const projectName = project.projectName.replace(/\s+/g, "-"); // Encodes special characters
    navigate(`/properties/${project.projectName}`, {
      state: { name: project.projectName },
    });
  };

  //const investmentAmount = projectOverview.pricePerSqft ? (projectOverview?.pricePerSqft/ 1e7).toFixed(2) : 'N/A';
  const investmentAmount = ((project.investmentOverview.minInvestment)/1e7).toFixed(2) || 'N/A';
  console.log("value is",investmentAmount);
  console.log("Investment Amount:", investmentAmount);
  const cagrPercentage = investmentOverview.cagr?.toFixed(2);
  const imageUrl = project?.images?.length > 0 ? project.images[0] : null;
  // console.log(imageUrl);

  return (
    <div
      className="h-fit  md:h-auto w-full px-4 pt-4 pb-5 gap-4 shadow-md bg-white flex flex-col rounded-2xl border-[2px] border-[#E3E3E3] "
      onClick={() => {
        handleViewMore();
        logEvent(analytics, "click_outside_prop_card", {
          Name: "Property Card",
        });
      }}
    >
      <div>
        <img
          src={imageUrl || "/assets/properties/images/placeholder.webp"}
          alt={projectName}
          className="w-full h-[165px] md:h-[160px] lg:h-[180px] rounded-[4px] object-cover border-[2px]"
        />
      </div>
      <div className="flex flex-col">
        <h3
          className="font-montserrat text-[18px] font-semibold leading-[27px] text-left text-[#2B2928] truncate"
          style={{
            minWidth: "200px", // Adjust max width
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {toCapitalizedWords(projectName)}
        </h3>
        <div className="flex items-center gap-1">
          <p className="font-lato text-[16px] font-bold leading-[24px] text-left text-[#12A858]">
            ₹{investmentAmount} Cr
          </p>
          <p className="font-lato text-[16px] font-bold leading-[24px] text-left text-[#5A5555]">
            Inv Amt.
          </p>
          <p className="font-lato text-[16px] font-bold leading-[24px] text-left text-[#CECECE] mr-1 ml-1">
            |
          </p>
          <p className="font-lato text-[16px] font-bold leading-[24px] text-left text-[#12A858]">
            {cagrPercentage}%
          </p>
          <p className="font-lato text-[16px] font-bold leading-[24px] text-left text-[#5A5555]">
            CAGR
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
