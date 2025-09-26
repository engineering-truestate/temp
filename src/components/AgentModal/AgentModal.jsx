import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails, fetchAgentDetails } from "../../slices/agentSlice";
import { selectUserPhoneNumber } from "../../slices/userAuthSlice";
import styles from "./AgentModal.module.css";
import CloseIcon from "/assets/icons/navigation/btn-close-alt.svg";
import Linkedin from "/assets/icons/social/linkedin.svg";
import MailIcon from "/assets/icons/ui/mail.svg";
import CallIcon from "/assets/icons/ui/phone.svg";
import WhatIcon2 from "/assets/icons/social/whatsapp-alt.svg";
import trueStateIcon from "../../../public/assets/icons/ui/truestateIcon.svg"; // Add your logo path here
import InvManager from "../../utils/InvManager";
import { scheduledMeetingsService } from "../../services/scheduledMeetingsService";
import { formatUnixDateTime } from "../helper/dateTimeHelpers";
import { getTaskTypeLabel } from "../../utils/taskTypeUtils";

const AgentModal = ({ closeAgentModal }) => {
  const dispatch = useDispatch();

  const userPhoneNumber = useSelector(selectUserPhoneNumber);
  const { userDetails, agentDetails, status } = useSelector(
    (state) => state.agent
  );

  // Local loading states
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [meetingsLoading, setMeetingsLoading] = useState(false);
  const [myMeetings, setMyMeetings] = useState([]);
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (userPhoneNumber) {
      console.log("Phone number is", userPhoneNumber);
      setIsLoading(true);
      dispatch(fetchUserDetails(userPhoneNumber));
    }
  }, [dispatch, userPhoneNumber]);

  useEffect(() => {
    if (userDetails?.agentName) {
      dispatch(fetchAgentDetails(userDetails.agentId)).finally(() => {
        setIsLoading(false);
      });
    }
  }, [dispatch, userDetails?.agentName]);

  // Reset image error when agentDetails change
  useEffect(() => {
    setImageError(false);
  }, [agentDetails]);

  useEffect(() => {
    const fetchMeetings = async () => {
      if (userPhoneNumber) {
        setMeetingsLoading(true);
        try {
          const meetings =
            await scheduledMeetingsService.getTotalScheduledMeetings(
              userPhoneNumber
            );
          setMyMeetings(meetings);
        } catch (error) {
          console.error("Error fetching meetings:", error);
          setMyMeetings([]);
        } finally {
          setMeetingsLoading(false);
        }
      }
    };

    fetchMeetings();
  }, [userPhoneNumber]);

  const toggleScheduleMeeting = () => {
    setIsScheduleMeetingOpen(!isScheduleMeetingOpen);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeAgentModal();
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Function to get the first letter of the name
  const getFirstLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  // Function to capitalize the first letter of the name
  const capitalizeFirstLetter = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openWhatsapp = () => {
    const phoneNumber = InvManager.phoneNumber;
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  const handlePhoneNumberClick = (phoneNumber) => {
    // Check if the device is mobile
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Open the phone dialer on mobile
      window.location.href = `tel:${phoneNumber}`;
    } else {
      // Try to open FaceTime (Mac/iOS devices) or Skype (cross-platform)
      if (
        navigator.userAgent.includes("Mac") ||
        navigator.userAgent.includes("iPhone") ||
        navigator.userAgent.includes("iPad")
      ) {
        window.location.href = `facetime:${phoneNumber}`;
      } else {
        window.location.href = `skype:${phoneNumber}?call`;
      }
    }
  };

  console.log("Agent details are", agentDetails);

  // Custom loader component
  const CustomLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray">
      <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
        <div className="text-center">
          <div className="relative mx-auto mb-4 h-16 w-16">
            <div className="animate-spin rounded-full h-full w-full border-4 border-green-900 border-t-transparent border-l-transparent"></div>
            <img
              src={trueStateIcon}
              alt="Logo"
              className="absolute inset-0 m-auto h-8 w-8"
            />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (isLoading || status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bottom-0 z-[10000]">
        <div
          ref={modalRef}
          className={`bg-[#FAFAFA] z-[10000] px-5 py-6 lg:w-1/3 md:w-2/3 left-auto right-2 md:right-[1rem] rounded-lg fixed top-[4.75rem] ${styles.modalContent} ${styles.bxs} min-w-[310px] max-w-[360px] border-2 border-[#E5E5E5]`}
        >
          <button
            className={`absolute top-4 right-4 bg-none border-none cursor-pointer ${styles.closeButton}`}
            onClick={closeAgentModal}
          >
            <img src={CloseIcon} alt="Close" />
          </button>

          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="relative mx-auto mb-4 h-16 w-16">
                <div className="animate-spin rounded-full h-full w-full border-4 border-green-900 border-t-transparent border-l-transparent"></div>
                <img
                  src={trueStateIcon}
                  alt="Logo"
                  className="absolute inset-0 m-auto h-8 w-8"
                />
              </div>
              <p className="text-gray-600">Loading agent details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (status === "failed") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bottom-0 z-[10000]">
        <div
          ref={modalRef}
          className={`bg-[#FAFAFA] z-[10000] px-5 py-6 lg:w-1/3 md:w-2/3 left-auto right-2 md:right-[1rem] rounded-lg fixed top-[4.75rem] ${styles.modalContent} ${styles.bxs} min-w-[310px] max-w-[360px] border-2 border-[#E5E5E5]`}
        >
          <button
            className={`absolute top-4 right-4 bg-none border-none cursor-pointer ${styles.closeButton}`}
            onClick={closeAgentModal}
          >
            <img src={CloseIcon} alt="Close" />
          </button>

          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-lg font-semibold mb-2">
                Failed to load details
              </div>
              <button
                onClick={() => {
                  if (userPhoneNumber) {
                    dispatch(fetchUserDetails(userPhoneNumber));
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isScheduleMeetingOpen && agentDetails && userDetails && (
        <div
          className={`fixed inset-0 flex items-center justify-center bottom-0 z-[10000]`}
        >
          <div
            ref={modalRef}
            className={`bg-[#FAFAFA] z-[10000] px-5 py-6 lg:w-1/3 md:w-2/3 left-auto right-2 md:right-[1rem] rounded-lg fixed top-[4.75rem] ${styles.modalContent} ${styles.bxs} min-w-[310px] max-w-[360px] border-2 border-[#E5E5E5] `}
          >
            <button
              className={`absolute top-4 right-4 bg-none border-none cursor-pointer ${styles.closeButton}`}
              onClick={closeAgentModal}
            >
              <img src={CloseIcon} alt="Close" />
            </button>
            <div className="flex items-center justify-start">
              {/* Profile picture with fallback */}
              <div
                className={`w-12 h-12 rounded-full mr-4 ${styles.agentImage} flex items-center justify-center`}
              >
                {!imageError && agentDetails.profilePic ? (
                  <img
                    src={agentDetails.profilePic}
                    alt="Agent"
                    className="w-full h-full rounded-full object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                    {getFirstLetter(agentDetails.name)}
                  </div>
                )}
              </div>

              <a href={agentDetails.linkedInUrl} target="blank">
                <div>
                  <div className="flex gap-[8px] items-center">
                    <h2 className={styles.agentName}>
                      {capitalizeFirstLetter(agentDetails.name)}
                    </h2>
                    <img src={Linkedin} alt="Linkedin" />
                  </div>
                  <p className={styles.agentDesignation}>
                    {agentDetails.designation || "Investment Manager"}
                  </p>
                </div>
              </a>
            </div>
            <div className="my-8">
              <div
                className="flex items-center mb-2 cursor-pointer"
                onClick={() =>
                  window.open(`mailto:${agentDetails.email}`, "_blank")
                }
              >
                <img
                  src={MailIcon}
                  className={`text-xl mr-2 ${styles.icon}`}
                  alt="Mail"
                />
                <div>
                  <p className={styles.contactText}>Mail</p>
                  <p className={styles.contactDetail}>{agentDetails.email}</p>
                </div>
              </div>
              <div
                className="flex items-center cursor-pointer"
                onClick={() =>
                  handlePhoneNumberClick(`+${InvManager.phoneNumber}`)
                }
              >
                <img
                  src={CallIcon}
                  className={`text-xl mr-2 ${styles.icon}`}
                  alt="Call"
                />
                <div>
                  <p className={styles.contactText}>Call</p>
                  <p className={styles.contactDetail}>
                    +{InvManager.phoneNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* My Meetings Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                My Meetings
              </h3>

              {meetingsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="relative h-6 w-6">
                    <div className="animate-spin rounded-full h-full w-full border-2 border-green-900 border-t-transparent border-l-transparent"></div>
                    <img
                      src={trueStateIcon}
                      alt="Logo"
                      className="absolute inset-0 m-auto h-3 w-3"
                    />
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    Loading meetings...
                  </span>
                </div>
              ) : myMeetings.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {myMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">
                            {getTaskTypeLabel(meeting.taskName)}
                          </p>
                          {meeting.schedule && (
                            <p className="text-sm text-gray-600">
                              {formatUnixDateTime(meeting.schedule)}
                            </p>
                          )}
                          {meeting.propertyName && (
                            <p className="text-sm text-gray-500">
                              {meeting.propertyName}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            meeting.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : meeting.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {meeting.status || "scheduled"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No meetings scheduled</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center ">
              <button
                className={`border w-full py-2 px-4 rounded-md flex items-center justify-center ${styles.actionButton2}`}
                onClick={() => openWhatsapp()}
              >
                <img
                  src={WhatIcon2}
                  className={`h-5 w-5 text-xl mr-2`}
                  alt="WhatsApp"
                />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentModal;

