import WhatsappIcon from "/assets/icons/social/whatsapp-green.svg";
import Animation from "/assets/animations/loading.png";
import { useEffect, useState } from "react";
import Select from "react-select";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import { COLLECTIONS } from "../constants/collections";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../slices/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { subscribeToUserDoc, selectUserDoc } from "../slices/userAuthSlice";
import { useToast } from "../hooks/useToast.jsx";
import { getUnixDateTime } from "../components/helper/getUnixDateTime";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";

import CloseIcon from "/assets/icons/navigation/btn-close-alt.svg";
import styles from "../components/Sidebar/sidebar.module.css";
import { setShowSignInModal } from "../slices/modalSlice.js";

// Feature icons for modal
import Logo2 from "/assets/icons/features/deals.svg";
import Logo3 from "/assets/icons/features/document-management.svg";
import Logo4 from "/assets/icons/features/properties.svg";
import Logo6 from "/assets/icons/features/vault.svg";
import Logo7 from "/assets/icons/brands/investment-manager.svg";

import {
  getUserDetails,
  checkUserExists,
  addUserToFirestore,
} from "../services/authService";
import { fetchCountryCodes } from "../utils/countryCodes.js";
import { countryCodeDropdownStyle } from "../utils/countryCodeDropdownStyle.js";
import { TRUESTATE_JOINING_REASONS } from "../constants/profileConstants.js";


const SignIn = () => {
  const [reasonForJoining, setReasonForJoining] = useState("");
  const [showGifModal, setShowGifModal] = useState(false);
  const [userDataToAdd, setUserDataToAdd] = useState();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState({
    value: "+91",
    label: "+91",
  });
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [name, setName] = useState("");
  const [contactOnWhatsApp, setContactOnWhatsApp] = useState(false);
  const [currentForm, setCurrentForm] = useState("A");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDoc = useSelector(selectUserDoc);
  const { currentPage } = useSelector((state) => state.pageTracker);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { redirectUrl } = useSelector((state) => state.modal);


  const apiKeys =  {
    VITE_SIGN3_API_URL: import.meta.env.VITE_SIGN3_API_URL,
    VITE_SIGN3_CLIENT_ID: import.meta.env.VITE_SIGN3_CLIENT_ID,
    VITE_SIGN3_CLIENT_SECRET: import.meta.env.VITE_SIGN3_CLIENT_SECRET,
  }

  useEffect(() => {
    // if (isOpen) {
    // Add a class to disable scrolling
    document.body.classList.add(`${styles.noScroll}`);
    // } else {
    // Remove the class when modal is closed
    //   document.body.classList.remove(`${styles.noScroll}`);
    // }

    // Cleanup on component unmount
    return () => {
      document.body.classList.remove(`${styles.noScroll}`);
    };
  }, []);


  const getSign3Data = async () => {
    try {
      const profile = await getUserDetails(phoneNumber, apiKeys);

      if (!profile) {
        return; // Stop further execution if profile is null
      }

      const updateFields = { fetched: true };
      const fieldsToUpdate = [
        "fullname",
        "email",
        "age",
        "employer",
        "designation",
        "location",
        "whatsapp",
        "circle",
      ];

      fieldsToUpdate.forEach((field) => {
        if (profile[field] !== null && profile[field] !== undefined) {
          updateFields[field] = profile[field];
        }
      });

      // Assuming setSign3Data is a function that updates the state
      return updateFields;
    } catch (error) {
      return null;
    }
  };

  const getPageRoute = (currentPageRoute) => {
    switch (currentPageRoute) {
      case "/products/vault":
        return "/vault";
      default:
        return currentPageRoute;
    }
  };

  /* 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(signIn(user));
      }
    });

    return () => {
      unsubscribe();
      dispatch(clearUserDocSubscription());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); */

  const Spinner = () => (
    <svg
      aria-hidden="true"
      className="w-6 h-6 mr-2 text-white animate-spin flex justify-center items-center"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

useEffect(() => {
  (async () => {
    try {
      const codes = await fetchCountryCodes();
      setCountryCodes(codes || []);
    } catch {
      setCountryCodes([{ value: "+91", label: "+91" }]);
    }
  })();
}, [currentForm]);

  const handleSuccessfulAuthentication = async (user) => {
  try {
    // Extract only the serializable parts of the user object
    const userData = {
      phoneNumber: user.phoneNumber,
    };

    // Check if user exists (for consistency)
    const userExists = await checkUserExists({
      phoneNumber: user.phoneNumber,
    });

    // Dispatch to Redux store
    dispatch(signIn(userData));

    // Subscribe to user's document
    await subscribeToUserDoc({
      phoneNumber: userData.phoneNumber,
    })(dispatch);

    // Navigate to the intended page
    const targetUrl = redirectUrl || "/properties";
    navigate(targetUrl);
    
    // Close the sign-in modal
    dispatch(setShowSignInModal({ 
      showSignInModal: false, 
      redirectUrl: null 
    }));

  } catch (error) {
    console.error("Error in handleSuccessfulAuthentication:", error);
    setErrorMessage("Authentication failed. Please try again.");
  }
};

  // useEffect(() => {
  //   // Navigate based on the user document's properties
  //   if (userDoc && userDoc.propertiesAdded) {
  //     if (userDoc.propertiesAdded.length > 0) {
  //       navigate("/properties");
  //     }
  //   }

  //   // if (isAuthenticated) {
  //   //   navigate("/properties");
  //   // }
  // }, [userDoc, navigate]);

  useEffect(() => {
    setErrorMessage("");
  }, [currentForm]);

  const handlePhoneInputChange = (event) => {
    const value = event.target.value;
    const regex = /^[0-9\b]+$/;

    if (value === "" || regex.test(value)) {
      setPhoneNumber(value);
      if (selectedCountryCode && value.length > 0) {
        const fullPhoneNumber = selectedCountryCode.value + value;
        const phoneNumber = parsePhoneNumberFromString(fullPhoneNumber);

        if (phoneNumber && phoneNumber.isValid()) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } else {
        setIsValid(false);
      }
    }
  };

  useEffect(() => {
    if (phoneNumber.length > 0) {
      const fullPhoneNumber = selectedCountryCode.value + phoneNumber;
      const phoneNumber = parsePhoneNumberFromString(fullPhoneNumber);
      if (phoneNumber && phoneNumber.isValid()) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    } else {
      setIsValid(false);
    }
    // eslint-disable-next-line
  }, [selectedCountryCode]);



  const handleSendOtp = async () => {
    if (isValid) {
      setIsSendingOTP(true);

      let recaptchaContainer = document.getElementById("recaptcha-container");
      if (recaptchaContainer) {
        recaptchaContainer.remove(); // Remove the existing container
      }

      try {
        // Step 1: Clear existing RecaptchaVerifier instance if it exists

        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } else {
        }

        // Step 2: Check if the reCAPTCHA container exists, remove it if necessary
        let recaptchaContainer = document.getElementById("recaptcha-container");
        if (recaptchaContainer) {
          recaptchaContainer.remove(); // Remove the existing container
        }

        // Step 3: Recreate the DOM element and append it to the target location
        recaptchaContainer = document.createElement("div");
        recaptchaContainer.id = "recaptcha-container";
        document.body.appendChild(recaptchaContainer);

        // Step 4: Initialize a new RecaptchaVerifier instance with the updated container
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {},
          }
        );

        // Step 5: Render the reCAPTCHA widget
        await window.recaptchaVerifier.render();

        // Step 6: Construct the full phone number in E.164 format
        const phonenumberFull = `${selectedCountryCode.value}${phoneNumber}`;
        console.log("Sending OTP to:", phonenumberFull); // Debug log

        // Step 7: Send OTP using signInWithPhoneNumber
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phonenumberFull,
          window.recaptchaVerifier
        );

        window.confirmationResult = confirmationResult;
        setCurrentForm("B");
        // setIsValid(false);
      } catch (error) {
        console.log(error);

        setErrorMessage("Failed to send OTP. Please try again.");
      }

      startResendTimer();
      setIsSendingOTP(false);
    } else {
      setErrorMessage("Please enter a valid number and country code.");
    }
  };

  const startResendTimer = () => {
    setResendDisabled(true); // Disable the resend button
    setTimer(30); // Set the timer to 30 seconds

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval); // Clear interval when countdown is over
          setResendDisabled(false); // Enable the resend button
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    // Step 2: Check if the reCAPTCHA container exists, remove it if necessary
    let recaptchaContainer = document.getElementById("recaptcha-container");
    if (recaptchaContainer) {
      recaptchaContainer.remove(); // Remove the existing container
    }

    // Ensure phone number is in a valid format before resending
    if (phoneNumber && selectedCountryCode) {
      setIsValid(true); // Explicitly set to true for resend attempt

      // Reset error message
      setErrorMessage("");

      if (!resendDisabled) {
        handleSendOtp(); // Call the send OTP function
      } else {
      }
    } else {
      setErrorMessage(
        "Please enter a valid number and country code before resending."
      );
    }
  };

const handleVerifyOtp = async () => {
  if (otp.some((element) => element === "")) {
    return;
  }
  setIsVerifyingOTP(true);
  const otpInput = otp.join("");
  try {
    // Step 1: Verify OTP
    const confirmationResult = await window.confirmationResult.confirm(otpInput);
    if (confirmationResult) {
      const fullPhoneNumber = `${selectedCountryCode.value}${phoneNumber}`;
      
      // Step 2: Check if user exists
      const userExists = await checkUserExists({
        phoneNumber: fullPhoneNumber,
      });
      if (!userExists) {
        // New user - go to form C to collect additional info
        setCurrentForm("C");
      } else {
        // Existing user - update their document with complete userData
        try {
          console.log("Updating existing user with complete userData...");

          // Get enriched data from Sign3 API
          const sign3Data = await getUserDetails(fullPhoneNumber, apiKeys);
          console.log("Sign3 data fetched:", sign3Data);

          // Get UTM parameters
          const storedUtmParams = JSON.parse(localStorage.getItem("utm_params")) || {};
          
          // Get existing user data first
          const usersRef = collection(db, COLLECTIONS.USERS);
          const q = query(usersRef, where("phoneNumber", "==", fullPhoneNumber));
          const qs = await getDocs(q);
          
          if (!qs.empty) {
            const existingDoc = qs.docs[0];
            const existingData = existingDoc.data();
            const existingRef = doc(db, COLLECTIONS.USERS, existingDoc.id);
            
            // Helper function to safely update fields
            const safeUpdate = (newValue, existingValue) => {
              // If new value exists and is not empty, use it; otherwise preserve existing
              if (newValue !== undefined && newValue !== null && newValue !== "") {
                return newValue;
              }
              return existingValue;
            };
            
            // Build update object with preservation logic for all fields
            const completeUserData = {
              // Only update if we have meaningful values, otherwise preserve existing
              ...(name && name.trim() !== "" && { name: name.toLowerCase() }),
              ...(reasonForJoining && reasonForJoining.trim() !== "" && { reasonForJoining }),
              
              // Always update these core fields (they should always have these values)
              truEstateSignUp: "true",
              phoneNumber: fullPhoneNumber,
              agentId: "TRUES03",
              agentName: "Amit",
              lastModified: getUnixDateTime(),
              lastLogin: getUnixDateTime(),
              tag: "Fresh", // Default value
              // Conditionally update these fields only if they have values
              source:"Website",
              subSource:"TruEstate",
              
              // Preserve existing arrays and objects
              Activity: existingData.Activity || [],
              
              // Only update UTM details if we have new ones
              ...(Object.keys(storedUtmParams).length > 0 && { utmDetails: storedUtmParams }),
              
              // Only update WhatsApp preference if it's defined
              ...(contactOnWhatsApp !== undefined && { isCheckedForWhatsapp: contactOnWhatsApp }),
              
              // Preserve existing userId
              userId: existingDoc.id,
            };
            
            // Merge sign3Data with preservation logic
            if (sign3Data) {
              Object.keys(sign3Data).forEach(key => {
                const newValue = sign3Data[key];
                if (newValue !== undefined && newValue !== null && newValue !== "") {
                  completeUserData[key] = newValue;
                }
                // If sign3Data[key] is empty, we don't add it to completeUserData
                // so existing value is preserved
              });
            }
            
            console.log("Updating existing user with:", completeUserData);
            await updateDoc(existingRef, completeUserData);
            console.log("Existing user document updated:", existingDoc.id);
            
            // Clear UTM params after update
            localStorage.removeItem("utm_params");
          }
          
          // Authenticate the user
          const userData = {
            phoneNumber: fullPhoneNumber,
          };
          handleSuccessfulAuthentication(userData);
          
        } catch (error) {
          console.error("Error updating existing user:", error);
          // Still authenticate even if update fails
          const userData = {
            phoneNumber: fullPhoneNumber,
          };
          handleSuccessfulAuthentication(userData);
        }
      }
    }
  } catch (error) {
    setErrorMessage("Please enter the correct OTP");
  }
  setIsVerifyingOTP(false);
};
const handleContinue = async () => {
  console.log("handleContinue called");
  setIsContinuing(true);

  if (
    name.trim() !== "" &&
    phoneNumber &&
    reasonForJoining !== "" &&
    !isSubmitting
  ) {
    setIsSubmitting(true);
    try {
      const sign3Data = await getSign3Data();
      const storedUtmParams =
        JSON.parse(localStorage.getItem("utm_params")) || {};

      const userData = {
        name: name.toLowerCase(),
        reasonForJoining,
        truEstateSignUp: "true",
        phoneNumber: `${selectedCountryCode.value}${phoneNumber}` || "",
        agentId: "TRUES03",
        agentName: "Amit",
        tag: "Fresh",
        added: getUnixDateTime(),
        lastModified: getUnixDateTime(),
        source: "Website",
        subSource: "TruEstate",
        Activity: [],
        ...(sign3Data || {}),
        utmDetails: storedUtmParams,
        isCheckedForWhatsapp: contactOnWhatsApp,
      };
      
      console.log("About to save userData:", userData);
      
      // Save to Firestore and get the result with the generated ID
      const saveResult = await addUserToFirestore(userData);
      console.log("User data saved successfully", saveResult);
      
      // Now add the userId to userData for authentication
      const userDataWithId = {
        ...userData,
        userId: saveResult.id, // Use the returned ID from Firestore
      };
      
      // Clear UTM params after successful save
      localStorage.removeItem("utm_params");
      
      // Set user data for potential modal display
      setUserDataToAdd(userDataWithId);

      // Authenticate the user with the complete data including userId
      await handleSuccessfulAuthentication(userDataWithId);
      
    } catch (error) {
      console.error("Error in handleContinue:", error);
      // Show error message to user
      setErrorMessage("Failed to save user data. Please try again.");
    }
    setIsSubmitting(false);
  } else {
    console.log("Validation failed - missing required fields");
    setErrorMessage("Please fill in all required fields");
  }
  setIsContinuing(false);
};

  useEffect(() => {
    if (currentForm === "C") {
      setIsValid(name.trim() !== "" && reasonForJoining !== "");
    }
  }, [name, currentForm, reasonForJoining]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }

    const isOtpComplete = newOtp.every((num) => num.trim() !== "");
    setIsValid(isOtpComplete);
  };

  const handleKeyDown = (e, index) => {
    // Detect backspace
    if (e.key === "Backspace" && !otp[index]) {
      if (e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").slice(0, otp.length); // Restrict to otp length
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (index + i < otp.length) {
        newOtp[index + i] = pastedData[i];
      }
    }
    setOtp(newOtp);

    const isOtpComplete = newOtp.every((num) => num.trim() !== "");
    setIsValid(isOtpComplete);
  };


  const Modal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-100 p-4">
        {/* Modal Container */}
        <div className="bg-white max-w-[720px] w-full px-6 py-6 md:px-8 md:py-8 rounded-lg relative">
          {/* Close Button */}

          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <img
              // src="https://s3-alpha-sig.figma.com/img/6f8a/9449/1878cb3ecb9bd84d6a874d75fd1a42f2?Expires=1729468800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=O-PFwnceeQ8OsHfqOenU9Oid35yfSkTvlBstsOQklsz9GTrvYQJO8lZCeE6kIVVRCwM-Th0~jfvxCTEE6hgrqY5r04QVs0kkxIEnzWmAXOoF2Im2D43c-yQyNBVoz7rB2mNyVr~X2jRXoVx6I6fGBxkoCPVGu9ACPlFb50O4BuK-pvj2Pvriuhq~GvSK5SStPOM4FxOCQ~pPvC2Kz7EwsGa5554TKGjZzIX~rY9hinIzuMS1~GkzGdUIsLb17Gtk7VNQhDXYj2njMZuzilY4YS25UnlrcfGzR-IoZjDS0VgXff6Gn~6hasK5mvSChuGyHXScuWD6kDeZ-I72DhbxKA__"
              src={Animation}
              alt="Congratulatory GIF"
              className="py-[32px]"
              style={{
                clipPath: "inset(0% 0% 0% 0%)", // Adjust these percentages to fine-tune the cropping
              }}
            />
          </div>

          {/* Title */}
          <h2 className="text-[28px] md:text-[32px] font-lora font-bold mt-4 text-center md:text-left">
            Welcome to TruEstate
          </h2>

          {/* Subtitle */}
          <p className="text-[16px] md:text-[18px] font-lato font-medium text-gray-700 mt-2 text-center md:text-left">
            Invest with us and get help in each step of your investment
          </p>

          {/* Features Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 ">
            <div className="flex items-center gap-3">
              <img
                src={Logo4}
                alt="Exclusive Prices"
                className="w-8 h-8 md:w-11 md:h-11"
              />
              <span className="text-[16px] font-montserrat font-semibold leading-[24px]">
                Exclusive Prices
              </span>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={Logo2}
                alt="Pre-Launch"
                className="w-8 h-8 md:w-11 md:h-11"
              />
              <span className="text-[16px] font-montserrat font-semibold leading-[24px]">
                Pre-Launch Opportunity
              </span>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={Logo3}
                alt="Property Management"
                className="w-8 h-8 md:w-11 md:h-11"
              />
              <span className="text-[16px] font-montserrat font-semibold leading-[24px]">
                Property Management
              </span>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={Logo7}
                alt="Investment Manager"
                className="w-8 h-8 md:w-11 md:h-11"
              />
              <span className="text-[16px] font-montserrat font-semibold leading-[24px]">
                Investment Manager
              </span>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={Logo6}
                alt="Exit Support"
                className="w-8 h-8 md:w-11 md:h-11"
              />
              <span className="text-[16px] font-montserrat font-semibold leading-[24px]">
                Exit Support
              </span>
            </div>
          </div>

          {/* whatsapp group icon  */}
          <Link
            to={"https://chat.whatsapp.com/G0ukJV5Qlz9A6Ckt9hYsou?mode=ac_t"}
            target="_blank"
            className={`${styles.whatsappContainer} justify-center border bg-[#FAFAFA] mt-2 mx-auto`}
          >
            <img className="" src={WhatsappIcon} />
            <span
              className={`font-lato font-[600] text-[14px] ${styles.whatsappText} `}
            >
              Join our group
            </span>
          </Link>

          {/* home button */}

          <button
            onClick={() => {
              setTimeout(() => {
                handleSuccessfulAuthentication(userDataToAdd);
                setShowGifModal(false);
              }, 100);
            }}
            className="w-full rounded-[8px] px-[20px] py-[14px] bg-[#153E3B] mt-[8px] font-lato text-[16px] leading-[24px] text-[#FAFBFC] text-center"
          >
            Go To Home
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 my-auto px-5">
      <div
        className={`flex max-w-[32rem] py-10 px-5 sm:px-10 rounded-xl bg-[#FAFBFC] relative`}
      >
        {/* <div className="h-screen sm:hidden pr:hidden">
        <img
          src={loginImg}
          alt="loginImg"
          className=" h-screen sm:hidden pr:hidden"
        />
      </div> */}

        <img
          src={CloseIcon}
          onClick={() =>
            dispatch(
              setShowSignInModal({ showSignInModal: false, redirectUrl: null })
            )
          }
          className="w-[24px] h-[16px] p-[2px] mb-3 cursor-pointer absolute right-3 top-5"
          alt="warner"
        />

        {showGifModal && <Modal />}
        <div className="flex justify-center items-center mx-auto">
          <div className="flex-col w-auto mx-[16px]">
            <div
              // onClick={() => navigate("/properties")}
              className="flex justify-center items-center"
            >
              <img src="/assets/images/auth/login-logo.png" alt="loginLogo" className="w-[64px]" />
            </div>
            <div>
              {currentForm === "A" && (
                <form className="Form-A flex flex-col">
                  <div className="flex-col">
                    <h1 className=" sm:text-[34px] text-[27px] text-[#252626] font-noticiaText mt-[20px] font-bold leading-[46.8px]">
                      Log in or Sign up
                    </h1>
                    <h6 className="font-montserrat sm:text-[16px] text-[14px] text-[#726C6C] font-medium mt-[12px] leading-[24px]">
                      To access TruEstate at no cost, please sign in or log in
                      using your phone number.
                    </h6>
                  </div>
                  <div className="font-montserrat text-[14px] leading-[24px] text-[#252626] font-medium mt-[40px]">
                    Phone Number (WhatsApp number preferred)*
                  </div>
                  <div className="flex mt-[4px]">
                    <Select
                      styles={countryCodeDropdownStyle}
                      options={countryCodes}
                      value={selectedCountryCode}
                      onChange={setSelectedCountryCode}
                      className="w-24 mr-2"
                    />
                    <input
                      type="tel"
                      id="phone-number"
                      name="phone-number"
                      className="border-[1px] border-[#9498A6] rounded-[6px] px-4 py-[6.75px] flex-grow max-w-[266px] sm:w-auto w-[130px] "
                      placeholder="0000000000"
                      pattern="[0-9]{10}"
                      maxLength="16"
                      value={phoneNumber}
                      onChange={handlePhoneInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mt-[4px] min-h-[24px]">
                    {errorMessage && (
                      <p className="text-red-500 font-lato text-[12px] leading-[24px] text-sm ">
                        *{errorMessage}
                      </p>
                    )}
                  </div>

                  {/* <div className="flex gap-[6px] items-center mt-[8px]">
                  <img src={whatsappIcon} alt="WhatsApp" className="w-5 h-5 " />
                  <span className="font-lato text-[16px] leading-[24px] text-[#726C6C] text-sm">WhatsApp number preferred</span>
                </div> */}
                  <div id="recaptcha-container" className=" mt-[20px]"></div>
                  <button
                    onClick={() => {
                      handleSendOtp();
                      logEvent(analytics, "click_send_otp");
                    }}
                    type="button"
                    className={`rounded-[8px] px-5 py-[14px] font-bold font-lato text-[16px] leading-[24px] text-[#FAFBFC] flex justify-center items-center ${
                      isValid ? "bg-[#153E3B]" : "bg-[#CFCECE]"
                    }`}
                    // disabled={!isValid}
                  >
                    {isSendingOTP ? <Spinner /> : "Send OTP"}
                  </button>
                  {
                    <p className="text-center font-lato mt-2">
                      By proceeding. I agree to{" "}
                      <Link
                        to="/privacy"
                        target="_blank"
                        className="cursor-pointer underline text-[#153E3B]"
                      >
                        Privacy Policy
                      </Link>
                      ,{" "}
                      <Link
                        to="/tnc"
                        target="_blank"
                        className="cursor-pointer underline text-[#153E3B]"
                      >
                        Terms and Conditions
                      </Link>{" "}
                    </p>
                  }
                  {/* <div className="flex items-center mt-[20px] mb-[20px]">
                  <div className="flex-grow h-[1px] bg-[#CFCECE]"></div>
                  <span className="mx-4">Or</span>
                  <div className="flex-grow h-[1px] bg-[#CFCECE]"></div>
                </div>
                <button
                  type="button"
                  className="rounded-md px-2 py-3 font-bold text-[#153E3B] border border-[#153E3B] flex items-center justify-center"
                  onClick={handleGoogleSignIn}
                >
                  <img src={googleIcon} alt="Google" className="mr-2" />
                  Continue With Google
                </button> */}
                </form>
              )}
              {currentForm === "B" && (
                <form className="Form-B flex flex-col">
                  <div className="flex-col">
                    <h1 className="sm:text-[34px] text-[18px] text-[#252626] font-noticiaText mt-[20px] font-bold leading-[46.8px]">
                      Welcome to TruEstate
                    </h1>
                    <h6 className="font-montserrat sm:text-[16px] text-[14px] leading-[24px] text-[#666667] font-medium mt-[8px]">
                      OTP sent to{" "}
                      <span className="text-[#153E3B] font-bold underline decoration-1">
                        {selectedCountryCode
                          ? `${selectedCountryCode.label}`
                          : ""}{" "}
                        {phoneNumber}
                      </span>
                    </h6>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleResendOtp();
                      logEvent(analytics, "click_resend_otp");
                    }}
                    disabled={resendDisabled}
                    className={`rounded-[6px] p-2 font-semibold text-[12px] font-lato leading-[18px] border-[1px] ${
                      timer > 0
                        ? "text-[#153E3B]/50 border-[#153E3B]/20 bg-[#F0FFFF]/20"
                        : "border-[#153E3B] bg-[#F0FFFF]"
                    } w-fit mt-[11px]`}
                  >
                    Resend Code {resendDisabled && `(${timer})`}
                  </button>
                  <div className="mt-[40px]">
                    <div className="mb-[4px] font-montserrat font-medium text-[14px] leading-[24px] text-[#252626]">
                      Enter OTP
                    </div>
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        className="border-b rounded-[4px] border-[#A3A4A5] mr-1 sm:mr-2 text-center sm:w-[48px] sm:h-[48px] w-[30px] h-[38px] border-[1px]"
                        type="tel"
                        maxLength="1"
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={(e) => handlePaste(e, index)}
                        required
                      />
                    ))}
                  </div>
                  <div className="mt-[4px] min-h-[24px]">
                    {errorMessage && (
                      <p className="text-red-500 font-lato text-[12px] leading-[24px] text-sm ">
                        *{errorMessage}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      handleVerifyOtp();
                      logEvent(analytics, "click_verify_otp");
                    }}
                    type="button"
                    className={`rounded-[8px] px-[20px] py-[14px] font-lato text-[16px] leading-[24px] font-bold flex justify-center items-center ${
                      isValid
                        ? "bg-[#153E3B] text-white"
                        : "bg-[#CFCECE] text-[#7A7B7C]"
                    } mt-[40px]`}
                    disabled={!isValid}
                  >
                    {isVerifyingOTP ? <Spinner /> : "Verify"}
                  </button>
                  {/* <div className="mt-[4px] min-h-[24px]">
                  {errorMessage && <p className="text-red-500 font-lato text-[12px] leading-[24px] text-sm ">*{errorMessage}</p>}
                </div> */}
                  <button
                    onClick={() => setCurrentForm("A")}
                    type="button"
                    className="flex justify-center items-center mt-[10px] font-lato text-[16px] leading-[24px] font-bold text-[#153E3B]"
                  >
                    <img
                      src="/assets/icons/navigation/arrow-left.svg"
                      alt="Back"
                      className="cursor-pointer mr-3"
                    />
                    Back
                  </button>
                </form>
              )}
              {currentForm === "C" && (
                <form className="Form C flex flex-col w-full max-w-[350px] px-4 sm:px-0">
                  <div className="flex-col">
                    <h1 className="text-[18px] sm:text-[32px] leading-[30px] sm:leading-[42px] text-[#252626] font-noticiaText mt-[10px] sm:mt-[20px] font-bold">
                      Just one more step!
                    </h1>
                  </div>

                  <div className="text-[#252626] font-montserrat text-[14px] leading-[24px] font-medium mt-[10px] sm:mt-[32px]">
                    Full Name*
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    placeholder="Enter Your Name"
                    onChange={(e) => {
                      e.target.value = e.target.value
                        .replace(/[^A-Za-z ]/g, "")
                        .slice(0, 20);
                      setName(e.target.value);
                    }}
                    required
                    className="w-full bg-transparent border-[1px] border-[#9498A6] rounded-[6px] mb-3 sm:mb-4 py-2 sm:py-3 px-3 sm:px-4 mt-[4px] font-lato text-[15px] sm:text-[16px] leading-[24px] text-[#252626]"
                  />

                  <div>
                    <p className="text-[#252626] font-montserrat text-[14px] leading-[21px] font-[600] mt-2">
                      Why do you want to join TruEstate? *
                    </p>
                    <div className="mt-2 sm:mt-3 flex flex-wrap gap-2 sm:gap-3">
                      {
                        TRUESTATE_JOINING_REASONS.map((reason) => (
                          <span
                            onClick={() => setReasonForJoining(reason)}
                            className={`px-3 sm:px-4 py-[8px] sm:py-[10px] font-lato font-[600] text-[13px] sm:text-sm text-[#2B2928] rounded-xl border border-[#B5B3B3] cursor-pointer ${
                              reasonForJoining === reason &&
                              "bg-[#DFF4F3] border-[#153E3B]"
                            }`}
                          >
                            {reason}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="flex items-start mt-5 sm:mt-6">
                    <div className="custom-checkbox">
                      <input
                        type="checkbox"
                        id="contactWhatsApp"
                        checked={contactOnWhatsApp}
                        onChange={(e) => setContactOnWhatsApp(e.target.checked)}
                        className="opacity-0 absolute cursor-pointer"
                      />
                      <span className="checkmark block w-[16px] sm:w-[18px] mt-[4px] h-[16px] sm:h-[18px] border-[1px] border-[#A3A4A5] bg-[#F0F1F2] rounded-[4px]"></span>
                    </div>
                    <label
                      htmlFor="contactWhatsApp"
                      className="ml-[10px] font-normal font-lato text-[14px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#252626]"
                    >
                      Send me updates on WhatsApp (PS: No Spam)
                    </label>
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        logEvent(analytics, "click_new_user_continue");
                        // Small delay to ensure event is sent
                        await new Promise((resolve) => setTimeout(resolve, 50));
                        gtag_report_conversion();
                      } catch (error) {
                        console.error("Analytics logging failed:", error);
                      }
                      handleContinue();
                    }}
                    type="button"
                    className={`mt-[24px] sm:mt-[32px] rounded-[8px] px-4 sm:px-5 py-[10px] sm:py-[14px] font-lato text-[15px] sm:text-[16px] leading-[24px] font-bold flex justify-center items-center ${
                      isValid
                        ? "bg-[#153E3B] text-[#FAFBFC]"
                        : "bg-[#CFCECE] text-[#7A7B7C]"
                    }`}
                    disabled={!isValid}
                  >
                    {isContinuing ? <Spinner /> : "Continue"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
