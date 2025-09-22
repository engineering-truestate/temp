import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// Arrow left icon moved to public folder
// import arrowLeft from "../../assets/Icons/arrow-left.svg";
// Bidding hands icon moved to public folder
// import biddingHands from "../../assets/Icons/bidding-hands.svg";
import truestateLogo from "../../../public/images/TruEstate Logo.svg";
// Auction wheel icon moved to public folder
// import wheelIcon from "../../assets/Icons/auction-wheel.svg";
import { useLocation } from "react-router-dom";

const sections = [
  { id: "what-is-auction", label: "What is an Auction?" },
  { id: "benefits", label: "Benefits of Auction" },
  { id: "difference", label: "How is it Different?" },
  { id: "checklist", label: "Due Diligence Checklist" },
  { id: "why-truestate", label: "Why TruEstate" },
];

const AuctionGuideHeader = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("#what-is-auction");
  const tabRefs = useRef({});

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab]);

  // Observe sections and update activeTab
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (visibleSection?.target.id) {
          setActiveTab(visibleSection.target.id);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.3, // adjust for how much of the section must be visible
      }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    const phoneNumber = InvManager.phoneNumber;
    const message = encodeURIComponent(
      `Hi - I would like to know more about Auction Properties at TruEstate`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 xl:px-20 pt-4 md:pt-3 flex justify-between items-center overflow-x-auto">
        <div className="flex gap-4 md:gap-0 lg:gap-8  md:justify-evenly w-auto md:w-full lg:w-auto whitespace-nowrap text-xs md:text-xs xl:text-base font-medium text-gray-900 pt-2 md:pt-4">
          {sections.map((item) => (
            <button
              key={item.id}
              ref={(el) => (tabRefs.current[item.id] = el)}
              onClick={() => {
                setActiveTab(item.id);
                const section = document.getElementById(item.id);
                if (section) {
                  section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className={`relative pb-4 transition-all duration-300 ease-in-out
          ${
            activeTab === item.id
              ? "text-[#19544C] font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#19544C] after:rounded-full after:origin-center after:scale-x-100 after:transition-transform after:duration-300"
              : "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#19544C] after:rounded-full after:origin-center after:scale-x-0 after:transition-transform after:duration-300"
          }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop WhatsApp Button */}
        <a
          onClick={handleClick}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 hidden lg:flex shrink-0 bg-[#043933] text-white text-xs xl:text-base font-medium px-4 py-2 rounded-lg items-center gap-2 mb-2 cursor-pointer"
        >
          <img
            src="/icons-1/whatsapp3.svg"
            alt="WhatsApp"
            className="w-5 h-5"
          />
          Talk to us
        </a>
      </div>

      {/* Mobile Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-base font-bold text-black md:mb-0">Interested?</p>

          <div className="flex w-full md:w-auto md:space-x-20">
            {/* Left Side */}
            <div className="w-1/2 flex justify-center items-center pr-2">
              <button
                onClick={() => navigate("/auction")}
                className="flex items-center text-xs font-medium text-[#043933] gap-1 whitespace-nowrap"
              >
                <img src="/assets/ui/icons/arrow-left.svg" alt="arrow left" className="w-4 h-4" />
                Back to Auction
              </button>
            </div>

            {/* Right Side */}
            <div className="w-1/2 md:w-auto lg:w-1/2 pl-2">
              <a
                onClick={handleClick}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#153E3B] w-full md:w-auto lg:w-full text-white text-xs font-medium py-2.5 rounded-md flex items-center justify-center gap-2 whitespace-nowrap md:px-10 lg:px-0"
              >
                <img
                  src="/icons-1/whatsapp3.svg"
                  alt="WhatsApp"
                  className="w-5 h-5"
                />
                Talk to Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
// Example section component

const Banner = () => (
  <section className="relative bg-gradient-to-b from-[#FEF4DC] to-[#FFF1BB] px-4  lg:px-20 md:pt-16 rounded-3xl mx-4 my-6 mx-4 lg:mx-20 overflow-hidden">
    {/* Left SVG */}
    <svg
      width="518"
      height="451"
      viewBox="0 0 518 451"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden lg:block absolute -bottom-14 -left-12 z-0"
    >
      <path
        d="M-51 28H191.277C234.492 28 274.368 51.2357 295.676 88.832L493 437"
        stroke="white"
        strokeOpacity="0.4"
        strokeWidth="56"
      />
    </svg>

    {/* Right Mirrored SVG */}
    <svg
      width="518"
      height="451"
      viewBox="0 0 518 451"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden lg:block absolute -bottom-14 -right-12 z-0 -scale-x-100"
    >
      <path
        d="M-51 28H191.277C234.492 28 274.368 51.2357 295.676 88.832L493 437"
        stroke="white"
        strokeOpacity="0.4"
        strokeWidth="56"
      />
    </svg>

    {/* Foreground Content */}
    <div className="relative z-10 max-w-4xl mx-auto text-center">
      {/* Logo */}
      <div className="flex justify-center items-center gap-2">
        <img
          src={truestateLogo}
          alt="TruEstate Logo"
          className="w-6 h-6 hidden md:block mb-4"
        />
        <p className="text-black font-bold hidden md:block text-xl">
          TruEstate
        </p>
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-black mb-2 font-heading pt-6 leading-[1.3] md:leading-[1.3]">
        <span className="hidden md:inline">The </span>
        Winning Bid <br className="hidden md:block" />
        <span className="inline md:inline-block">Starts Here</span>
      </h1>

      {/* Subheading */}
      <p className="text-gray-800 font-lato md:font-montserrat md:font-medium text-base md:text-[24px] md:leading-[1.5]">
        A clear, step-by-step guide to your
        <br className="inline md:hidden" /> successful
        <br className="hidden sm:inline" /> property auction
      </p>

      {/* Hero Image */}
      <img
        src="/assets/auction/icons/bidding-hands.svg" // Replace with actual import
        alt="Bidding hands"
        className="mx-auto mt-12 md:w-[682px]"
      />
    </div>
  </section>
);

const auctionSteps = [
  {
    step: "01",
    title: "Property Auction",
    description:
      "These properties typically come from distress situations, such as banks recovering unpaid loans (under the SARFAESI Act) or    government.",
  },
  {
    step: "02",
    title: "Highest Bidder Wins",
    description:
      "To participate, bidders must submit a refundable Earnest Money Deposit (EMD), which is usually 10% of the reserve price. The auction proceeds with bids being placed until the auction ends.",
  },
  {
    step: "03",
    title: "Winning and Payment",
    description:
      "The highest bidder wins the property by paying the full amount, covering all associated registration and stamp duty costs, and ultimately taking possession of the property.",
  },
];

const WhatIsAuction = () => (
  <section
    id="what-is-auction"
    className="scroll-mt-24 py-12 md:py-20 px-4 md:px-4 lg:px-20 bg-white"
  >
    <div className="mx-auto md:text-center text-start">
      {/* Heading */}
      <h2 className="text-4xl md:text-5xl md:leading-[1.3] font-bold text-black mb-2 font-heading">
        A Quick Summary of How Auctions Work
      </h2>
      <p className="text-gray-800 font-medium text-lg md:text-xl mb-6 md:mb-10 font-montserrat tracking-normal">
        A real estate auction is a public sale where properties are sold to the
        highest bidder.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        {auctionSteps.map((step, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-xl p-4 shadow-sm text-left bg-white pb-6"
          >
            <div className="flex justify-between items-start mb-6 md:mb-8 ">
              <div className="bg-[#19544C] rounded-2xl p-3">
                <img
                  src="/assets/auction/icons/auction-wheel.svg"
                  alt="Step icon"
                  className="w-[30px] h-[30px] "
                />
              </div>
              <span className="text-[40px] font-bold text-[#CCCBCB] font-heading">
                {step.step}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-black mb-2 ">
              {step.title}
            </h3>
            <p className="text-gray-800 font-medium font-lato text-base md:text-lg leading-[1.5] md:leading-relaxed ">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Map plane icon moved to public folder
// import mapPlane from "../../assets/Images/map-plane.svg";
// Shield icon moved to public folder
// import shield from "../../assets/Images/shield.svg";
// Keys hand icon moved to public folder
// import keysHand from "../../assets/Images/keys-hand.svg";
// Keys hand mobile icon moved to public folder
// import keysHandmobile from "../../assets/Images/keys-hand-mobile.svg";
import InvManager from "../../utils/InvManager";

const benefits = [
  {
    step: "01",
    title: "Below-Market Prices",
    description:
      "Win bids that are 30-40% lower than market prices - get high-potential short-term opportunities.",
    bg: "bg-[#B6F7D4]",
    image: "/assets/shared/images/map-plane.svg",
    mobileImage: "/assets/shared/images/map-plane.svg",
  },
  {
    step: "02",
    title: "Prime Property Availability",
    description:
      "Bid for auction properties in prime locations with supply constraints.",
    bg: "bg-[#FCD5DC]",
    image: "/assets/shared/images/shield.svg",
    mobileImage: "/assets/shared/images/shield.svg",
  },
  {
    step: "03",
    title: "Secure Title Deed",
    description:
      "As properties are mostly sourced from banks – they are usually free from ownership disputes.",
    bg: "bg-[#FFC6F7]",
    image: "/assets/shared/images/keys-hand.svg",
    mobileImage: "/assets/shared/images/keys-hand-mobile.svg", // Add the mobile-specific image here
  },
];

const BenefitsOfAuction = () => {
  return (
    <section
      id="benefits"
      className="scroll-mt-10 py-5 md:py-14 px-4 md:px-4 lg:px-20 bg-white"
    >
      <div className="mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold font-heading text-black mb-8 md:mb-12 text-start md:text-center">
          Upside of Auctions as an investment class
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`${benefit.bg} rounded-lg pl-6 md:pl-0 pt-6 flex flex-col justify-between h-[420px] md:h-[460px] text-start overflow-hidden`}
            >
              <div>
                <span className="inline-flex items-center justify-center w-12 h-12 text-base font-semibold border-4 border-white text-black rounded-full mb-4 font-montserrat md:mx-6">
                  {benefit.step}
                </span>

                <h3 className="text-xl text-gray-900 font-bold text-black mb-2 font-montserrat md:px-6">
                  {benefit.title}
                </h3>
                <p className="text-gray-800 text-base font-medium pr-6 font-montserrat leading-[1.5] md:px-6">
                  {benefit.description}
                </p>
              </div>

              {/* Image */}
              <div className="mt-auto flex items-end justify-end">
                {/* Show the desktop image */}
                <img
                  src={benefit.image}
                  alt={benefit.title}
                  className={`h-full max-h-[100%] object-contain ${
                    benefit.mobileImage ? "hidden md:block" : "block"
                  } ${benefit.step === "03" ? "h-[200px] w-auto" : ""}`}
                />
                {/* Show the mobile image */}
                {benefit.mobileImage && (
                  <img
                    src={benefit.mobileImage}
                    alt={`${benefit.title} mobile`}
                    // className="h-[85%] object-contain md:hidden"
                    className={`h-[80%] object-contain ${
                      benefit.mobileImage ? "block md:hidden" : "block"
                    } ${benefit.step === "03" ? "h-auto w-auto  mr-3" : ""}`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Traditional icon moved to public folder
// import TraditionalIcon from "../../assets/Icons/traditional.svg";
// Auction icon moved to public folder
// import AuctionIcon from "../../assets/Icons/auction-icon.svg";

const HowIsItDifferent = () => {
  const tableData = [
    {
      category: "Source of asset",
      traditional: "Direct from owners or developers",
      auction: "Bank-seized properties or other distress situations",
    },
    {
      category: "Condition Of property",
      traditional: "Usually ready to move in",
      auction: "May require inspection and potential renovation",
    },
    {
      category: "Pace and Risk",
      traditional: "Slower process, lower risk, standard returns",
      auction: "Fast-paced, higher risk, higher potential returns",
    },
    {
      category: "Payment Terms",
      traditional:
        "Flexible payment plans available - usually construction-linked",
      auction: "25% of payment after winning, balance within 15-30 days",
    },
    {
      category: "Loans",
      traditional:
        "Loans are easily available for projects by reputed developers",
      auction: "Banks usually don't sanction loans due to compressed timelines",
    },
  ];

  return (
    <section
      id="difference"
      className="scroll-mt-10 py-5 md:py-14  md:px-4 lg:px-20 text-center"
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-10 font-heading text-start md:text-center px-4 md:px-0 ">
        Auctions differ from other RE investments
      </h2>
      <div className="overflow-x-auto md:overflow-hidden px-4">
        <table className="table-auto w-full gap-x-4 ">
          <thead className="">
            <tr>
              <th className="p-3 text-left"></th>
              <th className="p-3 text-center whitespace-nowrap md:whitespace-normal">
                <div className="flex flex-col items-center space-y-3 text-lg">
                  <img
                    src="/assets/auction/icons/traditional.svg"
                    alt="Traditional Icon"
                    className="h-8 w-8"
                  />
                  <span>Traditional Real Estate Investment</span>
                </div>
              </th>
              <th className="p-3 text-center whitespace-nowrap md:whitespace-normal">
                <div className="flex flex-col items-center space-y-3 text-lg">
                  <img
                    src="/assets/auction/icons/auction-icon.svg"
                    alt="Auction Icon"
                    className="h-8 w-8"
                  />
                  <span>Auction Investment</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr
                key={index}
                className={index % 2 !== 0 ? "bg-white" : "bg-[#FEF4DC]"}
              >
                <td className="font-bold text-start text-[16px] md:whitespace-normal pl-8 py-5">
                  {row.category}
                </td>
                <td className="p-3 text-base whitespace-nowrap md:whitespace-normal font-lato">
                  {row.traditional}
                </td>
                <td className="p-3 text-base whitespace-nowrap md:whitespace-normal font-lato">
                  {row.auction}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

// Pad image moved to public folder
// import padImage from "../../assets/Icons/pad.svg";
// Auction lines icon moved to public folder
// import auctionLines from "../../assets/Icons/auction-lines.svg";
import arrowDown from "/assets/icons/navigation/arrow-down.svg";

const DueDiligenceChecklist = () => {
  const checklistItems = useMemo(
    () => [
      {
        title: "Outstanding Dues",
        content:
          "Investigate pending liabilities tied to the property, such as unpaid property taxes, maintenance charges, or utility bills, and clarify who is responsible for paying them.",
      },
      {
        title: "Legal & Title Clarity",
        content:
          "Check the Title Deed for clear ownership and obtain an Encumbrance Certificate to confirm there are no legal claims against the property.",
      },
      {
        title: "Physical Inspection",
        content:
          "Inspect the property's physical condition and surroundings, and confirm its occupancy status, as evicting tenants can be a long and expensive legal process.",
      },
      {
        title: "Auction Terms",
        content:
          "Carefully read all auction documents to understand the reserve price, EMD (Earnest Money Deposit) amount, payment deadlines, and penalties for non-payment.",
      },
    ],
    []
  );

  const [openStates, setOpenStates] = useState(checklistItems.map(() => false));
  const [activeBarIndex, setActiveBarIndex] = useState(null);
  const [interrupted, setInterrupted] = useState(false);

  const sectionRef = useRef(null);
  const timeoutsRef = useRef([]); // stores timeout IDs

  useEffect(() => {
    if (interrupted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          checklistItems.forEach((_, i) => {
            const openTimeout = setTimeout(() => {
              if (interrupted) return;

              setOpenStates((prev) =>
                prev.map((val, idx) => (idx === i ? true : false))
              );
              setActiveBarIndex(i);

              const closeTimeout = setTimeout(() => {
                if (interrupted) return;

                setOpenStates((prev) =>
                  prev.map((val, idx) => (idx === i ? false : val))
                );
                setActiveBarIndex(null);
              }, 6000);

              timeoutsRef.current.push(closeTimeout);
            }, i * 6200);

            timeoutsRef.current.push(openTimeout);
          });

          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [checklistItems, interrupted]);

  const toggleDropdown = (index) => {
    setInterrupted(true);

    // Cancel all pending animation timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // Toggle clicked item only
    setOpenStates((prevStates) =>
      prevStates.map((_, i) => (i === index ? !prevStates[index] : false))
    );
    setActiveBarIndex(null);
  };

  return (
    <>
      <section
        id="checklist"
        ref={sectionRef}
        className="scroll-mt-16 py-10 lg:py-20 px-4 sm:px-20 md:px-4 lg:px-20 bg-[#DFF4F3] mt-8 relative z-0 overflow-x-hidden"
      >
        {/* Decorative Line */}
        <img
          src="/assets/auction/icons/auction-lines.svg"
          alt="decoline"
          className="hidden lg:inline absolute top-0 left-10 z-10 pointer-events-none"
        />

        <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:space-x-28 relative z-20">
          {/* Left Column */}
          <div className="lg:w-1/2 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading pb-4">
              Due Diligence Checklist for Auctions
            </h2>
            <div className="space-y-4">
              {checklistItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#FFFFFF66] rounded-lg relative overflow-hidden"
                >
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="w-full flex items-center justify-between p-4 text-left text-lg font-bold"
                  >
                    {item.title}
                    <span
                      className={`transform transition-transform duration-200 ${
                        openStates[index] ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <img src={arrowDown} alt="arrow down" />
                    </span>
                  </button>

                  <div
                    className={`px-4 overflow-hidden transition-all duration-500 ease-in-out text-base font-normal font-lato ${
                      openStates[index]
                        ? "max-h-40 opacity-100 pb-4"
                        : "max-h-0 opacity-0 pb-0"
                    }`}
                  >
                    {item.content}
                  </div>

                  {/* Animated Golden Line */}
                  <div
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#EAC73C] transition-all duration-300 ${
                      activeBarIndex === index && !interrupted
                        ? "animate-[growBar_6s_ease-out]"
                        : "w-0"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:w-1/2 lg:flex lg:justify-center mb-8 lg:mb-0 lg:my-auto relative z-20">
            <img
              src="/assets/auction/icons/pad.svg"
              alt="pad image"
              className="max-w-sm lg:w-[60%] lg:max-w-lg"
            />
          </div>
        </div>
      </section>

      {/* Keyframe for Golden Bar */}
      <style>{`
        @keyframes growBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </>
  );
};

// Process icon 01 moved to public folder
// import icon01 from "../../assets/Icons/icon01.svg";
// Process icon 02 moved to public folder
// import icon02 from "../../assets/Icons/icon02.svg";
// Process icon 03 moved to public folder
// import icon03 from "../../assets/Icons/icon03.svg";
// Process icon 04 moved to public folder
// import icon04 from "../../assets/Icons/icon04.svg";

const WhyTruEstate = () => {
  const cards = [
    {
      id: 1,
      number: "01",
      icon: "/assets/auction/icons/process-01.svg",
      title: "End-to-End Due Diligence",
      description:
        "We handle legal verification, physical inspection, risk assessment, and highlighting hidden issues like society disputes, which an individual investor might miss.",
      bgColor: "bg-[#C5D8FF]",
    },
    {
      id: 2,
      number: "02",
      icon: "/assets/auction/icons/process-02.svg",
      title: "Risk Mitigation & Transparency",
      description:
        "Protect yourself from overbidding, unexpected costs, and property encroachments. Get accurate details (photos, videos), value assessment, etc.",
      bgColor: "bg-[#DCD0FF]",
    },
    {
      id: 3,
      number: "03",
      icon: "/assets/auction/icons/process-03.svg",
      title: "Property Management",
      description:
        "We help you with refurbishment of the property, along with rental services and exit strategies.",
      bgColor: "bg-[#F1D3FF]",
    },
    {
      id: 4,
      number: "04",
      icon: "/assets/auction/icons/process-04.svg",
      title: "Joint Investment Model",
      description:
        "Buy a high-value auction property jointly with other buyers - get secure and democratized access to lucrative deals.",
      bgColor: "bg-[#FCD5DC]",
    },
  ];

  return (
    <section
      id="why-truestate"
      className="scroll-mt-10 mb-20 md:mb-10 lg:mb-0 py-10 px-4 md:px-4 lg:px-20 md:mt-20"
    >
      <h2 className="text-4xl md:text-5xl font-bold font-[Lora] mb-6 md:mb-12 text-start md:text-center">
        The TruEstate Advantage in Auctions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`p-6 rounded-lg  relative ${card.bgColor} flex flex-col `}
          >
            {/* Number Indicator */}
            <div className="absolute top-4 left-4 flex items-center justify-center h-12 w-12 border-4 border-white rounded-full">
              <span className="text-lg font-bold text-gray-900">
                {card.number}
              </span>
            </div>

            {/* Icon */}
            <div className="h-16 w-16 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center mt-16">
              <img
                src={card.icon}
                alt={`Icon ${card.id}`}
                className="h-10 w-10"
              />
            </div>

            {/* Title */}
            <h3 className="mt-6 text-2xl font-bold font-[Lora] text-start text-gray-900">
              {card.title}
            </h3>

            {/* Description */}
            <p className="mt-4 text-start text-lg text-gray-800 font-lato">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Main component
const AuctionGuide = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectionId = params.get("section");

    if (sectionId) {
      // scroll after a short delay to ensure DOM is ready
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100); // tweak delay if needed
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-white font-montserrat">
      <AuctionGuideHeader />

      <div className="font-montserrat">
        <Banner />
        <WhatIsAuction />
        <BenefitsOfAuction />
        <HowIsItDifferent />
        <DueDiligenceChecklist />
        <WhyTruEstate />
      </div>
    </div>
  );
};

export default AuctionGuide;
