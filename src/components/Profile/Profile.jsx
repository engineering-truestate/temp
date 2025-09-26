import {
  PREVIOUS_INVESTMENT_OPTIONS,
  CREDIT_SCORE_OPTIONS,
} from "../../constants/profileConstants";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./profile.module.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  fetchUserProfile,
  setEditing,
  updateUserProfile,
  clearUpdateStatus,
} from "../../slices/userSlice";
import { selectUserPhoneNumber } from "../../slices/userAuthSlice";
import tickIcon from "/assets/icons/status/tick-white.svg";
import editIcon from "/assets/icons/actions/edit-white.svg";
import ArrowDown from "/assets/icons/navigation/arrow-down.svg";
import Logout from "/assets/icons/actions/logout.svg";
import { logout } from "../../slices/authSlice";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { useToast } from "../../hooks/useToast.jsx";
import { profilePic } from "../helper/profilePicHelper.js";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import { showLoader, hideLoader } from "../../slices/loaderSlice.js";
import Loader from "../Loader.jsx";

const Profile = () => {
  const { addToast, updateToast } = useToast();
  const dispatch = useDispatch();
  const { profile, status, error, isEditing, updateStatus } = useSelector(
    (state) => state.user
  );
  const userPhoneNumber = useSelector(selectUserPhoneNumber);

  const setEditTrue = () => {
    dispatch(setEditing(true));
  };

  const setEditFalse = () => {
    dispatch(setEditing(false));
  };

useEffect(() => {
  const fetchData = async () => {
    dispatch(showLoader());
    try {
      if (userPhoneNumber) {
        await dispatch(fetchUserProfile(userPhoneNumber));
      }
    } finally {
      dispatch(hideLoader());
    }
  };

  fetchData();
}, [dispatch, userPhoneNumber]);


  const toCapitalCase = (str) => {
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const [isSaving, setIsSaving] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [linkedinError, setLinkedinError] = useState("");

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [previousInvestments, setPreviousInvestments] = useState([]);
  const [creditScore, setCreditScore] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(userPhoneNumber);
  const [mail, setEmail] = useState("");
  const [linkedinProfile, setLinkedin] = useState("");

  const [originalState, setOriginalState] = useState({
    name: "",
    gender: "",
    previousInvestments: [],
    creditScore: "",
    phoneNumber: "",
    mail: "",
    linkedinProfile: "",
  });

  const setFormState = (data) => {
    setName(data.name || "");
    setGender(data.gender || "");
    setPreviousInvestments(data.previousInvestments || []);
    setCreditScore(data.creditScore || "");
    setPhoneNumber(data.phoneNumber || userPhoneNumber);
    setEmail(data.mail || "");
    setLinkedin(data.linkedinProfile || "");
  };

  useEffect(() => {
    if (profile) {
      const initialProfileState = {
        name: toCapitalCase(profile.name || ""),
        gender: profile.gender || "",
        previousInvestments: profile.previousInvestments || [],
        creditScore: profile.creditScore || "",
        phoneNumber: userPhoneNumber || "",
        mail: profile.mail || "",
        linkedinProfile: profile.linkedinProfile || "",
      };
      setOriginalState(initialProfileState);

      const savedData = localStorage.getItem("unsavedProfileData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormState(parsedData); // Load unsaved data if available
        setEditTrue();
      } else {
        setFormState(initialProfileState);
      }
    }
  }, [profile, userPhoneNumber]);

  // Watch and save form changes to localStorage for persistence
  useEffect(() => {
    const formData = {
      name,
      gender,
      previousInvestments,
      creditScore,
      phoneNumber,
      mail,
      linkedinProfile,
    };
    if (isEditing) {
      localStorage.setItem("unsavedProfileData", JSON.stringify(formData));
    }
  }, [
    name,
    gender,
    previousInvestments,
    creditScore,
    phoneNumber,
    mail,
    linkedinProfile,
  ]);

  const handlePhoneChange = (value) => {
    setEditTrue();
    const formattedPhone = "+" + value.replace(/[^0-9]/g, "");
    setPhoneNumber(formattedPhone);
  };

  const handleTogglePreviousInvestments = (value) => {
    setEditTrue();
    setPreviousInvestments(
      (prevState) =>
        prevState.includes(value)
          ? prevState.filter((investment) => investment !== value) // Remove if already selected
          : [...prevState, value] // Add to the array
    );
  };

  const handleToggleCreditScore = (value) => {
    setEditTrue();
    setCreditScore((prevValue) => (prevValue === value ? "" : value)); // Deselect if the value is the same, otherwise set the new value
  };

  const renderToggleButtons = (name, options, currentValue, handleToggle) => {
    return options.map((option) => (
      <button
        key={option.value}
        type="button"
        className={`${styles.button} ${
          currentValue.includes(option.value) ? styles.selected : ""
        }`}
        onClick={() => {
          handleToggle(option.value);
          logEvent(analytics, `input_user_profile_${name}`, {
            Name: `profile_${name}`,
          });
        }}
        // disabled={!isEditing}
      >
        {option.label}
      </button>
    ));
  };

  const validateEmail = (mail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(mail);
  };

  const validateLinkedInURL = (url) => {
    const linkedInRegex = /^https:\/\/(www\.)?linkedin\.com\/.*$/i;
    return linkedInRegex.test(url);
  };

  const sanitizeDetails = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined && v != null)
    );

  const handleUpdateProfile = async () => {
  let isValid = true;
  setEmailError("");
  setLinkedinError("");

  if (mail.length > 0 && !validateEmail(mail)) {
    setEmailError("Please enter a valid email address.");
    isValid = false;
  }
  if (linkedinProfile.length > 0 && !validateLinkedInURL(linkedinProfile)) {
    setLinkedinError("Please enter a valid LinkedIn profile URL.");
    isValid = false;
  }

  if (isValid) {
    // Show loading toast immediately
    const loadingToastId = addToast(
      "Profile",
      "loading",
      "Updating Profile",
      "Please wait while we update your profile..."
    );

    const userData = {
      name: name.toLowerCase(),
      gender: gender,
      previousInvestments: previousInvestments,
      creditScore: creditScore,
      phoneNumber: phoneNumber,
      mail: mail,
      linkedinProfile: linkedinProfile,
    };

    try {
      const result = await dispatch(
        updateUserProfile({
          userData,
          currentPhoneNumber: userPhoneNumber,
        })
      ).unwrap();

      // Success handling
      localStorage.removeItem("unsavedProfileData");
      
      // Update loading toast to success
      updateToast(loadingToastId, {
        type: "success",
        heading: "Profile Updated",
        description: "Your profile has been updated successfully."
      });

      // Optionally refetch the profile to ensure data consistency
      if (userPhoneNumber) {
        dispatch(fetchUserProfile(userPhoneNumber));
      }
    } catch (error) {
      // Update loading toast to error
      if (error.includes("phone number already exists")) {
        updateToast(loadingToastId, {
          type: "error",
          heading: "Duplicate Number Found",
          description: "A user with this phone number already exists."
        });
      } else {
        updateToast(loadingToastId, {
          type: "error",
          heading: "Update Failed",
          description: error || "Failed to update profile."
        });
      }
    }
  }
};

  const handleCancel = () => {
    setEmailError("");
    setLinkedinError("");

    setFormState(originalState);
    setEditFalse(); // Reset change tracker
    localStorage.removeItem("unsavedProfileData");
  };



  if (status === "failed") {
    console.error(error)
  }

  return (
    <>
      <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 px-4 py-4 md:px-8">
        {/* Left Column */}
        <div className="flex flex-col">
          {/* Top Cell */}
          <div className="h-fit lg:border-r-2 lg:pr-12 xl:pr-24 lg:mb-0">
            <h2 className={`${styles.heading} mb-4 lg:mb-6`}>Basic Details</h2>
            <div className="flex items-center mb-4 lg:mb-6">
              <img
                // src={`https://ui-avatars.com/api/?name=${name}&background=random`}
                src={profilePic(name)}
                alt="Profile"
                className="rounded-full h-18 w-18 object-cover mr-4"
              />
              {/* <button className={`${styles.button2} px-4 py-2.5`}><span className={styles.button2_txt}>Upload New Photo</span></button> */}
            </div>
            <h3 className={`${styles.subheading} mb-1`}>Name</h3>
            <input
              type="text"
              className="w-full px-4 py-2.5 mb-4 lg:mb-6 bg-[#FAFAFA] focus:outline-none border border-[#B5B3B3] rounded-md"
              value={name}
              onChange={(e) => {
                setEditTrue();
                {
                  e.target.value = e.target.value
                    .replace(/[^A-Za-z ]/g, "")
                    .slice(0, 20);
                  setName(e.target.value);
                }
              }}
              onClick={() => {
                logEvent(analytics, "input_user_profile_name", {
                  Name: "profile_name",
                });
              }}
              // disabled={!isEditing}
            />
            <div className="flex flex-wrap mb-4 lg:mb-6">
              <div className="w-full mb-4">
                <h3 className={`${styles.subheading} mb-1`}>Gender</h3>
                <div className="relative">
                  <select
                    className="appearance-none w-full px-4 py-2.5 rounded-md bg-[#FAFAFA] focus:outline-none border border-[#B5B3B3]"
                    value={gender}
                    onChange={(e) => {
                      setEditTrue();
                      setGender(e.target.value);
                    }}
                    onClick={() => {
                      logEvent(analytics, "input_user_profile_gender", {
                        Name: "profile_gender",
                      });
                    }}
                    // disabled={!isEditing}
                  >
                    <option value="">Please Select</option>
                    <option
                      value="Male"
                      onClick={() => {
                        logEvent(analytics, "input_user_profile_male", {
                          Name: "profile_male",
                        });
                      }}
                    >
                      Male
                    </option>
                    <option
                      value="Female"
                      onClick={() => {
                        logEvent(analytics, "input_user_profile_female", {
                          Name: "profile_female",
                        });
                      }}
                    >
                      Female
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <img
                      src={ArrowDown}
                      alt="Arrow Down"
                      className="w-4 h-4 fill-current"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Cell */}
          <div className="h-fit lg:pr-12 xl:pr-24 lg:border-r-2 mb-4">
            <h2 className={`${styles.heading} mb-4 lg:mb-6`}>Other</h2>
            <h3 className={`${styles.subheading} mb-2`}>
              Previous Investments (*select all that apply)
            </h3>
            <div className="flex flex-wrap gap-[0.5rem] mb-4 lg:mb-6">
              {renderToggleButtons(
                "previous_investment",
                PREVIOUS_INVESTMENT_OPTIONS,
                previousInvestments,
                handleTogglePreviousInvestments
              )}
            </div>
            <h3 className={`${styles.subheading} mb-2`}>Credit Score</h3>
            <div className="flex flex-wrap gap-[0.5rem] mb-4 lg:mb-6">
              {renderToggleButtons(
                "credit_score",
                CREDIT_SCORE_OPTIONS,
                [creditScore], // Wrap the single value in an array for consistency
                handleToggleCreditScore
              )}
            </div>
            {/* <button
              className={` mt-8 flex items-center px-20 py-2 border border-red-600 text-red-600 rounded-md ${styles.wrt}`}
              onClick={() => dispatch(logout())}
            >
              <div className={`${styles.logoutbtnctn} flex`}>
                <img src={Logout} className='mr-2' />
                Logout
              </div>
            </button> */}
          </div>
        </div>

        {/* Right Column */}
        <div className="h-fit lg:pl-12 xl:pl-24">
          <h2 className={`${styles.heading} mb-4 lg:mb-6`}>Contact Details</h2>
          <h3 className={`${styles.subheading} mb-1`}>Phone Number*</h3>
          <div className="flex items-center mb-4 lg:mb-6">
            <PhoneInput
              country={"in"}
              value={phoneNumber}
              onChange={handlePhoneChange}
              onClick={() => {
                logEvent(analytics, "input_user_profile_phone", {
                  Name: "profile_phone",
                });
              }}
              countryCodeEditable={false}
              inputClass="w-full px-4 py-2.5 rounded-md bg-[#E3E3E3] focus:outline-none border border-[#B5B3B3]"
              containerClass="flex items-center border border-[#B5B3B3] rounded-md bg-[#E3E3E3]"
              buttonClass="px-3 py-2.5 bg-[#E3E3E3] focus:outline-none border border-[#B5B3B3] rounded-md"
              inputStyle={{
                width: "100%",
                border: "1px #B5B3B3",
                background: "#E3E3E3",
                borderTopRightRadius: "0.375rem",
                borderBottomRightRadius: "0.375rem",
                paddingTop: "1.40625rem",
                paddingBottom: "1.40625rem",
              }}
              buttonStyle={{
                border: "1px #B5B3B3",
                background: "#E3E3E3",
                borderTopLeftRadius: "0.375rem",
                borderBottomLeftRadius: "0.375rem",
                borderRight: "1px solid #B5B3B3",
              }}
              // disabled={!isEditing}
              disabled={true}
            />
          </div>
          <h3 className={`${styles.subheading} mb-1`}>Email</h3>
          <input
            type="email"
            className="w-full px-4 py-2.5 bg-[#FAFAFA] focus:outline-none border border-[#B5B3B3] rounded-md"
            placeholder="Please Enter"
            value={mail}
            onChange={(e) => {
              setEditTrue();
              setEmail(e.target.value);
            }}
            onClick={() => {
              logEvent(analytics, "input_user_profile_email", {
                Name: "profile_email",
              });
            }}
            // disabled={!isEditing}
          />
          <div className="mt-[4px] mb-4 lg:mb-6">
            {emailError && (
              <p className="text-red-500 font-lato text-[12px] leading-[24px] text-sm ">
                *{emailError}
              </p>
            )}
          </div>
          <h3 className={`${styles.subheading} mb-1`}>LinkedIn Profile</h3>
          <input
            type="url"
            className="w-full px-4 py-2.5 bg-[#FAFAFA] focus:outline-none border border-[#B5B3B3] rounded-md"
            placeholder="LinkedIn URL"
            value={linkedinProfile}
            onChange={(e) => {
              setEditTrue();
              setLinkedin(e.target.value);
            }}
            onClick={() => {
              logEvent(analytics, "input_user_profile_linked_in", {
                Name: "profile_linked_in_url",
              });
            }}
            // disabled={!isEditing}
          />
          <div className="mt-[4px] mb-4">
            {linkedinError && (
              <p className="text-red-500 font-lato text-[12px] leading-[24px] text-sm ">
                *{linkedinError}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="h-fit lg:pr-12 xl:pr-24 lg:border-r-2 mb-10">
            <button
              className={` mt-8 lg:mt-0 flex items-center px-20 py-2 border border-red-600 text-red-600 rounded-md ${styles.wrt}`}
              onClick={() => {
                dispatch(logout());
                console.log("logged out");
                logEvent(analytics, "click_user_profile_log_out_button", {
                  Name: "profile_log_out_button",
                });
              }}
            >
              <div className={`${styles.logoutbtnctn} flex`}>
                <img src={Logout} className="mr-2" />
                Logout
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.bottomPanel}>
        {isEditing ? (
          <div className="flex">
            <button
              className={`${styles.saveButton}`}
              onClick={() => {
                handleUpdateProfile();
                logEvent(analytics, "click_user_profile_save_button", {
                  Name: "profile_save_button",
                });
              }}
              disabled={updateStatus === "loading"}
            >
              {updateStatus === "loading" ? (
                <span className="font-lato text-[16px] leading-[24px] text-center text-[#FAFBFC] font-medium">
                  Saving...
                </span>
              ) : (
                <>
                  <img src={tickIcon} alt="Tick Icon" className="w-5 h-5" />
                  <span className="font-lato text-[16px] leading-[24px] text-center text-[#FAFBFC] font-medium">
                    Save
                  </span>
                </>
              )}
            </button>
            <button
              className={`${styles.deleteButton}`}
              onClick={() => {
                handleCancel();
                logEvent(analytics, "click_user_profile_cancel_button", {
                  Name: "profile_cancel_button",
                });
              }}
            >
              <span className="font-lato text-[14px] leading-[21px] text-center text-[#2B2928] font-semibold ">
                Cancel
              </span>
            </button>
          </div>
        ) : (
          // <button
          //   className={`${styles.saveButton}`}
          //   onClick={setEditTrue}
          // >
          //   <img src={editIcon} alt="Tick Icon" className="w-4 h-4" />
          //   <span className="font-lato text-[16px] leading-[24px] text-center text-[#FAFBFC] font-medium ">Edit</span>
          // </button>
          <></>
        )}
      </div>
    </>
  );
};

export default Profile;
