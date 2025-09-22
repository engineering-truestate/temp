/**
 * PropCard Component
 *
 * Description:
 * A reusable React component that displays property details in a card format.
 * It includes project status icons, project image, key details, and action buttons.
 * The component is styled using Tailwind CSS classes and includes custom CSS for responsive padding.
 *
 * Dependencies:
 * - React
 * - Material Tailwind (@material-tailwind/react)
 * - react-router-dom (for navigation)
 * - SmallButton component
 *
 * Props:
 * - projectName (string): Name of the project.
 * - logo (string): URL or import of the project's logo/image.
 * - location (string): Location of the project.
 * - status (string): Current status of the project (e.g., Available, Upcoming).
 * - configurations (string): Available configurations (e.g., "1/2/3 BHK").
 * - irr (string): Internal Rate of Return for the project.
 * - startingPrice (string): Starting price of the project.
 * - duration (string): Duration of the project investment (e.g., "5 years").
 * - minInvestment (number): Minimum investment amount required.
 *
 * Usage:
 * <PropCard
 *   projectName="Mahindra Lifespaces"
 *   logo={MahindraLogo}
 *   location="Aerocity"
 *   status="Under Construction"
 *   configurations="2/3/4 BHK"
 *   irr="25%"
 *   startingPrice="1.5 Cr"
 *   duration="5 Years"
 *   minInvestment={5000000}
 * />
 */

import { Card, CardHeader, CardBody } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import SmallButton from '../../button/SmallButton';

// Import icons
import truSelected from '../../../../assets/Icons/properties/truRecommended.svg';
import preLaunch from '../../../assets/homePage/newDevelopment/icons/PreLaunch.svg';
import rerasel from '../../../assets/homePage/newDevelopment/icons/rerasel.svg';
import compicon from '../../../assets/homePage/newDevelopment/icons/Compare.svg';
import selicon from '../../../assets/homePage/newDevelopment/icons/Favorite.svg';
import locicon from '../../../assets/homePage/newDevelopment/icons/location.svg';
import statusIcon from '../../../assets/homePage/newDevelopment/icons/Status.svg';
import configIcon from "/icons-1/AssetType.svg";
import HG from '../../../assets/homePage/newDevelopment/icons/HG.svg';
import UV from '../../../assets/homePage/newDevelopment/icons/UV.svg';


import '../../../pages/home/Home.css'
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../../../firebase';

import { formatCostSuffix, toCapitalizedWords } from "../../../../utils/common.js";
import { useDispatch } from 'react-redux';
import { setShowSignInModal } from '../../../../slices/modalSlice.js';

// Function to format cost with commas
const formatCost = (cost) => {
  return cost.toLocaleString(); // Format the cost with commas for better readability
};

const PropCard = ({
  projectName,
  logo,
  status,
  investmentOverview,
  pricePerSqft,
  micromarket,
  assetType,
  duration,
  minInvestment,
  showTruSelected,
  showPreLaunch,
  showRera,
}) => {

  const dispatch = useDispatch();
  // Function to handle card click and redirect to the specified URL
  const handleCardClick = () => {
    logEvent(analytics, 'property_card_click_home_new_development');
    dispatch(setShowSignInModal({ showSignInModal: true, redirectUrl: ('/properties') }));  // open signin modal
  };

  return (
    <>

      {/* Internal CSS for responsive padding */}
      <style>
        {`
          /* Base padding: 5% on both sides */
          .responsive-padding {
             padding-left: max(15%, 1rem);
             padding-right: max(15%, 1rem);
          }

          /* On medium screens and above */
          @media (min-width: 768px) {
            .responsive-padding {
              /* Ensure minimum padding of 1 */
              padding-left: max(5%, 1rem);
              padding-right: max(5%, 1rem);
            }

          /* On large screens and above */
          @media (min-width: 1024px) {
            .responsive-padding {
              /* Ensure minimum padding of 2rem  */
              padding-left: max(5%, 2rem);
              padding-right: max(5%, 2rem);
            }

          
          }
        `}
      </style>


      <Card
        className="flex max-w-[24rem] flex-col justify-between rounded-xl border border-[#FFFFFF] bg-white p-1 shadow-none hover:cursor-pointer hover:border-gray-400 duration-300 transition-all ease-in-out group "
        onClick={handleCardClick}
      >
        {/* Icons for project status */}
        <div className="flex justify-between relative mt-0 h-full gap-5 rounded-t-xl bg-transparent px-4 py-3 shadow-none">

          <div className="flex items-center gap-1.5 md:gap-0.5 lg:gap-1.5">
            {showTruSelected && <img src={truSelected} alt="Recommended" className="h-6 md:h-5 lg:h-6 w-auto" />}
            {showPreLaunch && <img src={preLaunch} alt="Limited Availability" className="h-6 md:h-5 lg:h-6 w-auto" />}
            {showRera && <img src={rerasel} alt="RERA Approved" className="h-6 md:h-5 lg:h-6 w-auto" />}
          </div>


          <div className="flex gap-1.5 md:gap-0.5 lg:gap-1.5">
            <img src={compicon} alt="Compare Icon" className="h-6 md:h-5 lg:h-6 w-auto" /> {/* Compare icon */}
            <img src={selicon} alt="Favorite Icon" className="h-6 md:h-5 lg:h-6 w-auto" /> {/* Favorite icon */}
          </div>
        </div>
        {/* Card Header */}
        <CardHeader
          floated={false}
          color="blue-gray"
          className="relative mt-0 flex h-full flex-col gap-5 rounded-t-xl bg-transparent px-4 py-3 shadow-none"
        >


          {/* Project Image */}
          <div className="flex h-[112px] items-center justify-center  ">
            <img
              src={logo}
              alt={projectName}
              className="object-fit "
            />
          </div>
        </CardHeader>

        {/* Card Body */}
        <CardBody className="flex flex-col gap-4 rounded-b-xl px-4 pt-3 pb-4">


          {/* Project Address and Status */}
          <div className="flex flex-wrap justify-items-start w-full gap-2">
            {/* Location */}
            <div className="flex gap-1 w-fit pr-2 border-r border-gray-300 items-center">
              <img src={locicon} alt="Location Icon" className="w-[14px] h-[14px]" />
              <p className="font-lato font-medium text-xs text-[#433F3E] leading-[150%]">
                {toCapitalizedWords(micromarket)}
              </p>
            </div>

            {/* Status */}
            <div className="flex gap-1 w-fit pr-2 border-r border-gray-300 items-center">
              <img src={statusIcon} alt="Status Icon" className="w-[14px] h-[14px]" />
              <p className="font-lato font-medium text-xs text-[#433F3E] leading-[150%]">
                {toCapitalizedWords(status)}
              </p>
            </div>

            {/* Configurations */}
            <div className="flex gap-1 w-fit items-center">
              <img src={configIcon} alt="Configurations Icon" className="w-[14px] h-[14px]" />
              <p className="font-lato font-medium text-xs text-[#433F3E] leading-[150%]">
                {assetType}
              </p>
            </div>
          </div>


          {/* Details Section */}
          <div className="flex flex-col gap-3">

            {/* Project Details */}
            <div className="flex">
              <div className="flex w-full flex-wrap justify-around">

                {/* IRR Details */}
                <div className="w-[50%] lg:w-[20%] py-1">
                  <p className="font-montserrat text-xs font-medium text-[#433F3E] leading-[150%]">XIRR</p>
                  <p className="font-lato text-sm font-bold text-[#2B2928] leading-[150%]">{investmentOverview.xirr} %</p>
                </div>

                {/* Starting Price Details */}
                <div className="w-[50%] lg:w-[27%] py-1">
                  <p className="font-montserrat text-xs font-medium text-[#433F3E] leading-[150%]">Price / Sqft</p>
                  <p className="font-lato text-sm font-bold text-[#2B2928] leading-[150%]">{pricePerSqft}</p>
                </div>

                {/* Duration Details */}
                <div className="w-[50%] lg:w-[27%] py-1">
                  <p className="font-montserrat text-xs font-medium text-[#433F3E] leading-[150%]">Duration</p>
                  <p className="font-lato text-sm font-bold text-[#2B2928] leading-[150%]">4 Years</p>
                </div>

                {/* Minimum Investment Details */}
                <div className="w-[50%] lg:w-[25%] py-1">
                  <p className="font-montserrat text-xs font-medium text-[#433F3E] leading-[150%]">Min Inv.</p>
                  <p className="font-lato text-sm font-bold text-[#2B2928] leading-[150%]">{formatCostSuffix(minInvestment)}</p>
                </div>

              </div>
            </div>

            {/* Separator Line */}
            <hr className="border-t border-gray-300" />

            {/* ---------------------------------------------------------------- */}
            {/* Growth Tags and Action Button */}
            <div className="flex w-full flex-wrap items-center justify-center sm:justify-between font-body gap-1 md:gap-1.5"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent:
                  window.innerWidth > 1440 ? 'space-between' :
                    window.innerWidth > 1024 ? 'center' :
                      window.innerWidth > 320 ? 'space-between' : 'center',
                gap: window.innerWidth >= 768 ? '0.25rem' : '0.25rem',
              }}>
              {/* Growth Potential and Value Estimation Icons */}
              <div className="flex w-fit items-center gap-1 md:gap-1.5 text-label-xs">
                <img src={HG} alt="Growth Potential Icon" className="h-6 height-5dot5 md:h-5 lg:h-6 w-auto" />
                <img src={UV} alt="Value Estimation Icon" className="h-6 height-5dot5 md:h-5 lg:h-6 w-auto" />
              </div>

              {/* Action Button */}
              <div className="flex w-fit justify-end">
                <SmallButton
                  href="#"
                  label="Know More"
                  // Updated classes prop to use 'responsive-padding' instead of 'px-5 lg:px-7'
                  classes="border-gray-200 child-class group-hover:border-gray-400 responsive-padding !py-1 bg-transparent font-body text-paragraph-bold-xxs md:text-paragraph-bold-xxs xl:text-paragraph-bold-xs  !text-GreenBlack know-more-fs whitespace-nowrap "
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

    </>
  );
};

export default PropCard;