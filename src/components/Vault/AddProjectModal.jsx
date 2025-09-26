import React, { useEffect } from "react";
import image from "../../../public/images/Vault_image.png";
import styles from "./AddProjectModal.module.css";
import add from "/assets/icons/actions/add-vault.svg";
import whatsapp from "/assets/icons/social/whatsapp-vault.svg";
import Documentmanagement from "/assets/icons/features/document-management.svg";
import Loanmanagement from "/assets/icons/features/loan-management.svg";
import LocalCompliance from "/assets/icons/features/local-compliance.svg";
import RentalInvestment from "/assets/icons/features/rental-investment.svg";
import sellyourproperty from "/assets/icons/features/sell-property.svg";
import TDSpayment from "/assets/icons/features/tds-payment.svg";
import ValuationReport from "/assets/icons/features/valuation-report.svg";
import sellproperty1 from "/assets/icons/features/sell-property-1.svg";
import localcompliance1 from "/assets/icons/features/local-compliance-1.svg";

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import InvManager from "../../utils/InvManager";
import { hideLoader, showLoader } from "../../slices/loaderSlice";

// Card data for rendering
const cardData = [
  {
    title: "Valuation Report",
    description: "Track valuation and return on your investment every quarter.",
    icon: ValuationReport,
  },
  {
    title: "Local Compliance",
    description:
      "Property tax payments, Khata transfer, electricity bill transfer.",
    icon: localcompliance1,
  },
  {
    title: "Sell your property",
    description: "Exit your investments hassle free with best returns.",
    icon: sellproperty1,
  },
  {
    title: "TDS Payment",
    description: "Calculate, pay and track TDS payments on every installment.",
    icon: Loanmanagement,
  },
  {
    title: "Document Management",
    description: "Keep all real estate related documents in one place.",
    icon: TDSpayment,
  },
  {
    title: "Loan Management",
    description:
      "Track home loans, EMIs, get best rate offers, transfer with ease.",
    icon: sellyourproperty,
  },
  {
    title: "Rental Management",
    description:
      "We will help you to find best suitable tenant for your property.",
    icon: LocalCompliance,
  },
];

const VaultEmptyPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userDoc } = useSelector((state) => state.userAuth);

  useEffect(() => {
    if (userDoc?.vaultForms && userDoc?.vaultForms?.length > 0)
      return navigate("/vault/investment");
    dispatch(hideLoader());
  }, [userDoc]);

  const handleclick = () => {
    dispatch(showLoader());
    navigate("/vault/findproject");
  };

  const openWhatsapp = () => {
    const phoneNumber = InvManager.phoneNumber;
    const message = encodeURIComponent(
      "Hi, I would like to know more about Investment Management with Vault."
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="h-[100%] px-4 md:px-8 flex flex-col justify-center items-center pt-16 ">
      <div className="w-full max-w-[608px] h-fit ">
        <div className="w-fit mx-auto">
          <div className="mb-3">
            <h2
              className={`flex justify-center items-center ${styles.h9} text-center md:text-3xl`}
            >
              Managing Property Made Real Easy
            </h2>
          </div>
          <div className="mb-6 px-[55px]">
            <p className={`${styles.h2} text-center`}>
              Track and manage all your real estate investments in one place for
              free, with quarterly price updates.
            </p>
          </div>

          <div className="flex flex-col justify-center items-center sm:flex-row gap-4">
            <div
              className={`w-full ${styles.knowMoreBtn} bg-[#153E3B]  rounded-[4px] gap-2`}
              onClick={handleclick}
            >
              <img src={add} />
              <button className={`${styles.h3}`}>Add Property</button>
            </div>

            <div
              className={`hidden md:flex w-full ${styles.knowMoreBtn}  rounded-[4px] bg-[#FAFAFA] gap-2`}
              onClick={openWhatsapp}
            >
              <img src={whatsapp} alt="Icon" />
              <button className={`${styles.h4}`}>
                Know More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card Section */}
      <div className="mt-16  md:mt-32  flex flex-col  justify-center items-center  ">
        <h3 className={` ${styles.h10} mb-6`}>Features</h3>

        <div className="flex flex-wrap items-center justify-center  gap-6">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="border border-[#CCCBCB] rounded-lg py-4  px-5 flex flex-col   w-full md:w-[275px]  items-start  "
            >
              <img
                src={card.icon}
                alt={card.title}
                className="mb-2 w-14 h-14"
              />
              <div className="flex justify-between w-full mb-1">
                <h4 className={`${styles.h11}`}>{card.title}</h4>
              </div>

              <p className={`${styles.h6}`}>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VaultEmptyPage;
