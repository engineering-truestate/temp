const arrow = '/assets/vault/icons/navigation/arrow-left.svg';
import PropTypes from "prop-types";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import {
  arrayUnion,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setProperties } from "../../slices/userAuthSlice";
import { useState } from "react";

const SummaryContainer = ({ onBack, onNext, completeData }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // Helper function to convert camelCase to Title Case
  const toTitleCase = (str) => {
    return str
      .replace(/([A-Z])/g, " $1") // insert a space before all caps
      .replace(/^./, function (str) {
        return str.toUpperCase();
      }) // capitalize the first letter
      .trim();
  };

  const [user] = useAuthState(auth);

  const handleFinalSubmit = async () => {
    setLoading(true);
    if (user) {
      const usersRef = collection(db, "users");
      let userDocRef = null;

      // First, try to find the user document by email
      if (user.email) {
        const emailQuery = query(usersRef, where("email", "==", user.email));
        const emailQuerySnapshot = await getDocs(emailQuery);
        if (!emailQuerySnapshot.empty) {
          userDocRef = emailQuerySnapshot.docs[0].ref;
        }
      }

      // If not found by email and phone is available, try by phone number
      if (!userDocRef && user.phoneNumber) {
        const phoneQuery = query(
          usersRef,
          where("number", "==", user.phoneNumber)
        );
        const phoneQuerySnapshot = await getDocs(phoneQuery);
        if (!phoneQuerySnapshot.empty) {
          userDocRef = phoneQuerySnapshot.docs[0].ref;
        }
      }

      // If a document reference is found, update it
      if (userDocRef) {
        try {
          await setDoc(
            userDocRef,
            {
              propertiesAdded: arrayUnion({
                ...completeData,
                internalId: completeData.internalId, // Ensure internalId is included
              }),
            },
            { merge: true }
          );
          dispatch(
            setProperties({
              newProperty: completeData,
            })
          );

          onNext();
        } catch (error) {}
      } else {
      }
    } else {
    }
    setLoading(false);
  };

  const isValueNotEmpty = (key, value) => {
    return (
      key !== "details" &&
      value !== "" &&
      value !== null &&
      value !== undefined &&
      key !== "financialDetails" &&
      key !== "internalId"
    );
  };

  return (
    <div className="flex flex-col main-content py-10 px-32 bg-[#FAFBFC] w-[75%] sm:w-full sm:px-6 pr:w-full pr:px-28">
      <div onClick={onBack} className="flex space-x-[12px] cursor-pointer">
        <img src={arrow} alt="arrow" />
        <div className="font-montserrat font-semibold text-[14px] text-[#7A7B7C]">
          Back
        </div>
      </div>
      <div className="mt-5 font-noticiaText font-bold text-[40px] text-[#252626]">
        Summary
      </div>
      <div className="mini-containers mt-5 flex flex-wrap">
        {Object.entries(completeData)
          .filter(([key, value]) => isValueNotEmpty(key, value))
          .map(([key, value]) => (
            <div
              key={key}
              className="w-auto h-14 rounded-[8px] border-[1px] border-[#CFCECE] bg-[#FAFBFC] px-3 py-2 mt-3 mr-3 flex items-center justify-between"
            >
              <span className="font-montserrat font-medium text-[14px] text-[#252626]">
                {`${toTitleCase(key)}:`}
              </span>
              <span className="font-montserrat font-bold text-[14px] text-[#252626] ml-2">
                {typeof value === "object" ? JSON.stringify(value) : value}
              </span>
            </div>
          ))}
      </div>
      <div className="flex justify-start">
        <button
          onClick={() => {
            handleFinalSubmit();
          }}
          type="submit"
          className="w-[300px] h-[48px] border-[1px] border-[#A3A4A5] rounded-[6px] p-2 sm:mt-2 sm:mb-10 sm:w-full pr:w-[48.5%] pr:mt-2 ld:w-[48.5%] bg-[#153E3B] text-[#FAFBFC] mt-12 flex justify-center items-center"
        >
          {loading ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 flex justify-center items-center"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            "Next"
          )}
        </button>
      </div>
    </div>
  );
};

SummaryContainer.propTypes = {
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  completeData: PropTypes.object.isRequired,
};

export default SummaryContainer;
