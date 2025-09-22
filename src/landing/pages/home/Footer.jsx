/**
 * Footer Component
 *
 * Description:
 * A React functional component that represents the footer section of a web page.
 * It includes the company logo and tagline, navigation links, contact information,
 * and a disclaimer section. The component is styled using Tailwind CSS classes
 * for responsive design and consistent styling.
 *
 * Dependencies:
 * - React
 * - LogoTagline component
 * - LinksSection component
 * - ContactSection component
 * - DisclaimerSection component
 *
 * Usage:
 * Import and include the <Footer /> component at the bottom of your main layout or pages.
 *
 **/

import { useState } from "react";
import FooterLogo from "../../assets/footer/FooterLogo.png";
import DiscoverIcon from "../../assets/mainFeatures/discover.svg";
import InvestIcon from "../../assets/mainFeatures/invest.svg";
import ManageIcon from "../../assets/mainFeatures/manage.svg";
import LinksSection from "../../components/footer/LinksSection";
import DisclaimerSection from "../../components/footer/Disclaimer";
import LargeButton from "../../components/button/LargeButton";
import CalendlyBadge from "./CalendlyBadge";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../../firebase";
import QRCode from "../../components/talkToUsQRFixed";
import InvManager from "../../../utils/InvManager";
import { setShowSignInModal } from "../../../slices/modalSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

// Array of feature data
const featureData = [
  {
    icon: DiscoverIcon,
    title: "Discover",
  },
  {
    icon: InvestIcon,
    title: "Invest",
  },
  {
    icon: ManageIcon,
    title: "Manage",
  },
];

// Location data structure
const locations = [
  { slug: "koramangala", title: "Koramangala" },
  { slug: "choodasandra", title: "Choodasandra" },
  { slug: "sarjapur", title: "Sarjapur" },
  { slug: "kadugodi", title: "Kadugodi" },
  { slug: "varthur", title: "Varthur" },
  { slug: "whitefield", title: "Whitefield" },
  { slug: "uttarahalli", title: "Uttarahalli" },
  { slug: "hoskote", title: "Hoskote" },
  { slug: "gunjur", title: "Gunjur" },
  { slug: "gattahalli", title: "Gattahalli" },
  { slug: "kannamangala", title: "Kannamangala" },
  { slug: "dommasandra", title: "Dommasandra" },
  { slug: "bellandur", title: "Bellandur" },
  { slug: "kaggalipura", title: "Kaggalipura" },
  { slug: "carmelaram", title: "Carmelaram" },
  { slug: "rajanukunte", title: "Rajanukunte" },
  { slug: "sathanur", title: "Sathanur" },
  { slug: "devanahalli", title: "Devanahalli" },
  { slug: "yelahanka", title: "Yelahanka" },
  { slug: "doddaballapura", title: "Doddaballapura" },
  { slug: "yeshwanthpur", title: "Yeshwanthpur" },
  { slug: "nagasandra", title: "Nagasandra" },
];

const Footer = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [currentIndex ] = useState(
    isAuthenticated ? "truEstatePreLaunch" : "truEstate_preLaunch_outside"
  );
  const baseUrl = window.location.origin;
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState("micro");

  const queryTypes = {
    micro: {
      label: "Micro Market",
      getQuery: (location) =>
        `${baseUrl}/properties?${currentIndex}%5Bquery%5D=${location.slug}`,
    },
    undervalued: {
      label: "Undervalued Properties",
      getQuery: (location) =>
        `${baseUrl}/properties?${currentIndex}%5Bquery%5D=${location.slug}&${currentIndex}%5BrefinementList%5D%5BtruValue%5D%5B0%5D=undervalued`,
    },
    newLaunched: {
      label: "New Launched Project",
      getQuery: (location) =>
        `${baseUrl}/properties?${currentIndex}%5Bquery%5D=${location.slug}&${currentIndex}%5BrefinementList%5D%5Bstatus%5D%5B0%5D=new%20launch`,
    },
    preLaunched: {
      label: "Pre-Launched Project",
      getQuery: (location) =>
        `${baseUrl}/properties?${currentIndex}%5Bquery%5D=${location.slug}&${currentIndex}%5BrefinementList%5D%5Bstatus%5D%5B0%5D=pre%20launch`,
    },
    underConstruction: {
      label: "Under Construction Project",
      getQuery: (location) =>
        `${baseUrl}/properties?${currentIndex}%5Bquery%5D=${location.slug}&${currentIndex}%5BrefinementList%5D%5Bstatus%5D%5B0%5D=under%20construction`,
    },
  };

  const tabs = Object.entries(queryTypes).map(([id, { label }]) => ({
    id,
    label,
  }));

  const getActiveQueries = () => {
    const queryType = queryTypes[activeTab];
    return locations.map((location) => ({
      query: queryType.getQuery(location),
      title: location.title,
    }));
  };

  // Get displayed queries based on mobile view and showAll state
  const getDisplayedQueries = () => {
    const queries = getActiveQueries();
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return showAll ? queries : queries.slice(0, 6);
    }
    return queries;
  };

  return (
    <div className="h-full bg-linear5">
      <div className="flex flex-col pt-16 px-6 gap-10 md:pt-20 md:px-20 md:gap-20 lg:pt-28 lg:px-24 lg:gap-28">
        <div className="flex flex-col md:flex-row justify-between items-start p-0 gap-10">
          {/* Logo + headline + text */}
          <div className="flex flex-col items-center md:items-start p-0 lg:gap-6 md:gap-4 gap-3">
            {/* Logo */}
            <div>
              <img
                src={FooterLogo}
                alt="TruEstate Logo"
                className="mx-auto lg:mx-0 h-6 lg:h-10"
              />
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-DefaultWhite leading-[120%] text-display-xxxs md:text-display-xs lg:text-display-sm font-heading text-center md:text-start">
                Begin your real estate <br className="hidden md:block" />{" "}
                journey with <br className="hidden md:block" />
                TruEstate - <span className="italic">completely free.</span>.
              </h2>
            </div>
          </div>

          {/* Reinforcing what we do */}
          <div className="flex flex-col lg:gap-6 md:gap-4 gap-3 mx-auto md:mx-0">
            {/* Feature Cards */}
            <div className="flex flex-col w-full min-w-[14rem] lg:min-w-[20rem] lg:gap-6 md:gap-4 gap-3 text-label-xs">
              {featureData.map((feature, index) => (
                <div
                  key={index}
                  className="flex justify-center items-center gap-2 lg:gap-2 py-2.5 md:py-3 lg:py-3 px-9 md:px-10 lg:px-14 bg-[#0A3432] rounded-lg"
                >
                  <img
                    src={feature.icon}
                    alt={`${feature.title} Icon`}
                    className="h-[14px] md:h-4 lg:h-[22px]"
                  />
                  <h3 className="text-left text-heading-semibold-xxxs md:text-heading-semibold-xxxs lg:text-heading-semibold-xxs text-white font-subheading">
                    {feature.title}
                  </h3>
                </div>
              ))}
            </div>

            {/* Call to Action Button */}
            <div>
              <CalendlyBadge />
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="flex flex-col md:flex-row justify-between items-center border border-gray-800 bg-[#0A3432] rounded-lg lg:py-8 md:py-6 py-4 lg:px-14 md:px-10 px-6 w-full gap-6 md:gap-5 lg:gap-6">
            {/* heading and tagline */}
            <div className="flex flex-col text-white lg:gap-2.5 md:gap-2 gap-3">
              <h2 className="lg:text-heading-semibold-lg md:text-heading-semibold-sm text-heading-semibold-xs font-subheading md:text-left text-center">
                Invest smarter with TruEstate!
              </h2>
              <p className="lg:text-paragraph-lg md:text-paragraph-xxs text-paragraph-xs text-ShadedWhite md:text-left text-center font-body">
                Real estate investing made easy and transparent.
              </p>
            </div>

            {/* ctas */}
            <div className="flex gap-3 w-fit">
              {/* Call to Action Button - Sign In */}

              <div>
                <LargeButton
                  label="Sign up/Log in"
                  onClick={() =>
                    dispatch(
                      setShowSignInModal({
                        showSignInModal: true,
                        redirectUrl: "/properties",
                      })
                    )
                  }
                  classes="font-body text-label-sm md:text-label-md border-white bg-white !text-GableGreen hover:bg-transparent hover:!text-white whitespace-nowrap"
                  eventName="click_footer_signup" // Tracking event name
                  eventCategory="CTA" // Tracking category
                  eventAction="click" // Tracking action
                  eventLabel="sign_up_cta_footer" // Tracking label for Sign In button
                />
              </div>

              {/* Call to Action Button - Talk to Us */}
              <div>
                <LargeButton
                  href={`https://wa.me/${
                    InvManager.phoneNumber
                  }?text=${"Hi, I'd like to know more about your offerings and how TruEstate can help with my property needs. Could you provide more details? Thank you!"}`}
                  label="Talk to us"
                  classes="text-label-sm md:text-label-md bg-transparent hover:bg-white font-body border-white whitespace-nowrap"
                  eventName="click_footer_talk_to_us" // Tracking event name
                  eventCategory="CTA" // Tracking category
                  eventAction="click" // Tracking action
                  eventLabel="talk_2_us_footer" // Tracking label for Talk to Us button
                />
              </div>
            </div>
          </div>
        )}

        <div className="">
          <div className="flex w-full h-full flex-col items-center gap-6 md:gap-9 md:items-center lg:items-stretch">
            {/* Separator Line */}
            <hr className="w-full border-[1px] border-[#F0F1F2] opacity-20" />

            <div className="w-full h-fit py-6 mx-auto">
              <div className="flex flex-col max-w-7xl w-full gap-6 mx-auto">
                <h1 className="text-2xl font-semibold font-['Lora'] text-white">
                  Investment Options in Bangalore
                </h1>
                <div className="flex flex-row w-full overflow-x-auto scrollbar-hide">
                  {/* Tab Buttons */}
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`font-montserrat font-bold text-base leading-[150%] tracking-[0.25px] align-middle py-3 px-3 md:py-4 md:px-4 justify-between whitespace-nowrap border-b-2 text-left flex-1 ${
                        activeTab === tab.id
                          ? "border-white text-white"
                          : "border-[#325351] text-gray-400 hover:text-gray-300"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {getDisplayedQueries().map(({ query, title }, index) => (
                    <div key={index}>
                      <a
                        href={query}
                        className="text-white hover:text-gray-200 transition-colors duration-200 font-lato text-base font-normal"
                        onClick={() => {
                          const eventName = `click_footer_investment_option_in_${title.toLowerCase()}`;
                          logEvent(analytics, eventName, {
                            Name: "Investment Option Link",
                          });
                        }}
                      >
                        Investment option in {title}
                      </a>
                    </div>
                  ))}
                </div>
                {getActiveQueries().length > 6 && (
                  <div className="md:hidden mt-4">
                    <button
                      onClick={() => {
                        setShowAll(!showAll);
                        logEvent(analytics, "click_footer_see_more", {
                          Name: "footer_see_more",
                        });
                      }}
                      className="text-blue-500 underline focus:outline-none"
                    >
                      {showAll ? "See Less" : "See More..."}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <hr className="w-full border-[1px] border-[#F0F1F2] opacity-20 mb-8" />

            {/* Links and Contact Sections */}
            <div className="w-full flex flex-col justify-start gap-8 md:flex-col md:justify-center md:gap-14 lg:flex-row lg:justify-between lg:gap-10">
              {/* Navigation Links */}
              <LinksSection />
            </div>

            {/* Disclaimer Section */}
            <DisclaimerSection />
          </div>
        </div>
      </div>
      {/* QR Code Fixed at Bottom Right */}
      <QRCode />
    </div>
  );
};

export default Footer;
