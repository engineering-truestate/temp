import React, { useState } from "react";
import WhatIcon2 from "/assets/icons/social/whatsapp.svg";
import InvManagerIcon from "/assets/icons/features/home.svg";
import styles from "./ProjectDetails.module.css";
import InvManager from "../../utils/InvManager";
import { useDispatch, useSelector } from "react-redux";
import { selectUserPhoneNumber } from "../../slices/userAuthSlice";
import {
  getUnixDateTime,
  getUnixDateTimeOneDayLater,
} from "../helper/dateTimeHelpers";
import { addTask, addProperty } from "../../slices/userSlice";
import { useToast } from "../../hooks/useToast";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";

// Custom check mark SVG component
const CustomCheck = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 5L4 7L8 3"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ContactInvestmentManager = ({
  projectName,
  propertyId,
  type = "all",
}) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userPhoneNumber = useSelector(selectUserPhoneNumber);

  const toCapitalCase = (str) => {
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleSubmitEOI = async () => {
    const phoneNumber = InvManager.phoneNumber;
    const message = encodeURIComponent(
      type != "auction"
        ? `Hi - I am interested in submitting an EOI (Expression of Interest) for ${
            projectName ? toCapitalCase(projectName) : "a project"
          }".`
        : `Hi - I am interested in the auction of ${propertyId} ${
            projectName ? toCapitalCase(projectName) : "a project"
          }".`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    if (isAuthenticated) {
      const taskDetails = {
        actionType: "message",
        agentId: "",
        agentName: "",
        completedTimestamp: 0,
        userPhoneNumber: userPhoneNumber,
        projectId: propertyId,
        schedule: getUnixDateTimeOneDayLater(),
        status: "pending",
        taskName: "collect-eoi",
        taskType: null,
        propertyType: "preLaunch",
        notes: [],
        document: [],
        loanId: null,
        projectName: projectName,
      };
      console.log(taskDetails);
      try {
        await dispatch(
          addTask({ phoneNumber: userPhoneNumber, taskDetails })
        ).unwrap();
        await dispatch(
          addProperty({
            phoneNumber: userPhoneNumber,
            projectId: propertyId,
            projectName: projectName,
            propertyType:"preLaunch"
          })
        ).unwrap();

        addToast(
          "Expression of Interest submitted successfully",
          "success",
          "EOI Submitted",
          `Your Expression of Interest for ${projectName} has been submitted successfully.`
        );
      } catch (error) {
        addToast(
          "Unable to submit Expression of Interest",
          "error",
          "EOI Submission Failed",
          `We encountered an error while submitting your EOI for ${projectName}. Please try again.`
        );
      }
    }
  };
  const handleContactUs = async () => {
    const phoneNumber = InvManager.phoneNumber;
    const message = encodeURIComponent(
      type != "auction"
        ? `Hi - I am interested in submitting an EOI (Expression of Interest) for ${
            projectName ? toCapitalCase(projectName) : "a project"
          }".`
        : `Hi - I am interested in the auction of ${propertyId} ${
            projectName ? toCapitalCase(projectName) : "a project"
          }".`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    if (isAuthenticated) {
      const taskDetails = {
        actionType: "message",
        agentId: "",
        agentName: "",
        completedTimestamp: 0,
        userPhoneNumber: userPhoneNumber,
        projectId: propertyId,
        schedule: getUnixDateTimeOneDayLater(),
        status: "pending",
        taskName: "other-discussion",
        taskType: null,
        propertyType: type == "all" ? "preLaunch" : "auction",
        notes: [],
        document: [],
        loanId: null,
        projectName: projectName,
      };
      try {
        await dispatch(
          addTask({ phoneNumber: userPhoneNumber, taskDetails })
        ).unwrap();
        await dispatch(
          addProperty({
            phoneNumber: userPhoneNumber,
            projectId: propertyId,
            projectName: projectName,
            propertyType:"auction"
          })
        ).unwrap();

        addToast(
          "Enquiry Initiated Successfull",
          "success",
          "Enquiry Initiated",
          `Your Inquiry is Initiated  for ${projectName} successfully.`
        );
      } catch (error) {
        addToast(
          "Unable to Initiate Inquiry",
          "error",
          "Enquiry Initiation Failed",
          `We encountered an error while Initiating your Inquiry for ${projectName}. Please try again.`
        );
      }
    }
  };

  const handleTalkToManager = async () => {
    const phoneNumber = InvManager.phoneNumber;
    const message = encodeURIComponent(
      `Hi, I would like to know more about "${
        projectName ? toCapitalCase(projectName) : "a project"
      }".`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    if (isAuthenticated) {
      const taskDetails = {
        actionType: "message",
        agentId: "",
        agentName: "",
        completedTimestamp: 0,
        userPhoneNumber: userPhoneNumber,
        projectId: propertyId,
        schedule: getUnixDateTimeOneDayLater(),
        status: "pending",
        taskName: "other-discussion",
        taskType: null,
        propertyType: type == "all" ? "preLaunch" : "auction",
        notes: [],
        document: [],
        loanId: null,
        projectName: projectName,
      };
      try {
        await dispatch(
          addTask({ phoneNumber: userPhoneNumber, taskDetails })
        ).unwrap();
         await dispatch(
          addProperty({
            phoneNumber: userPhoneNumber,
            projectId: propertyId,
            projectName: projectName,
             propertyType: type == "all" ? "preLaunch" : "auction",
          })
        ).unwrap();
      } catch (error) {}
    }
  };

  return (
    <div
      className={`py-3 mb-0 lg:mb-7 lg:border lg:border-[#E3E3E3] rounded-md shadow-sm flex justify-between lg:flex-col ${styles.Havemeet} flex-col mt-0 sm:flex-row sm:px-4 sm:max-h-[76px] lg:px-5 lg:pb-4 lg:pt-4 lg:max-h-fit gap-2 sm:gap-4`}
    >
      <div className="gap-3">
        <h2
          className={`${styles.heading22} mb-2 lg:mb-1 text-[18px] sm:text-[22px] font-lato`}
        >
          Interested in this project?
        </h2>
        <p className={`${styles.heading33} mb-4 hidden sm:block font-lato`}>
          Invest with us for:
        </p>

        <div className="flex flex-row md:flex-col mb-2 justify-between">
          <div className="flex items-center gap-[6px] p-0">
            <div className="bg-[#151413] rounded-full h-[16px] w-[16px] flex items-center justify-center">
              <CustomCheck />
            </div>
            <span className="text-[#151413] items-center text-sm md:text-base font-lato">
              Exclusive Prices
            </span>
          </div>
          <div className="flex items-center gap-[6px]">
            <div className="bg-[#151413] rounded-full h-[16px] w-[16px] flex items-center justify-center">
              <CustomCheck />
            </div>
            <span className="text-[#151413] items-center text-sm md:text-base font-lato">
              Priority Units
            </span>
          </div>
          <div className="flex items-center gap-[6px]">
            <div className="bg-[#151413] rounded-full h-[16px] w-[16px] flex items-center justify-center">
              <CustomCheck />
            </div>
            <span className="text-[#151413] items-center text-sm md:text-base font-lato">
              Easy Refunds
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-row  lg:flex-col gap-3">
        <button
          onClick={() => {
            if (type == "all") {
              handleSubmitEOI();
            } else {
              handleContactUs();
            }
            logEvent(analytics, "click_submit_EOI_property", {
              Name: "submit_EOI_property",
            });
          }}
          className="flex-1 gap-1 py-2 px-2 sm:px-8 sm:py-3 bg-[#153E3B] text-[#FAFBFC] text-[14px] font-lato font-bold sm:text-[16px] rounded-md flex items-center justify-center"
        >
          <img
            src={WhatIcon2}
            className={`md:w-5 md:h-5 w-4 h-4`}
            alt="WhatsApp"
          />
          {type == "auction" ? "Contact Us" : "Submit EOI"}


        </button>

        <button
          onClick={() => {
            handleTalkToManager();
            logEvent(analytics, "click_inv_manager_property", {
              Name: "inv_manager_property",
            });
          }}
          className="flex-1 gap-1 py-2 px-2 sm:px-8 sm:py-3 bg-white text-[#153E3B] outline-1 sm:outline-[1.5px] outline-[#153E3B] outline-double text-[14px] font-lato font-bold sm:text-[16px] rounded-md flex items-center justify-center"
        >
          <img
            src={InvManagerIcon}
            className={`md:w-5 md:h-5 w-5 h-5`}
            alt="InvManager"
          />
          <span className="font-lato">Talk to Inv. Manager</span>
        </button>
      </div>
    </div>
  );
};

export default ContactInvestmentManager;
