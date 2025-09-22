import PropTypes from "prop-types";
const cross = '/assets/vault/icons/actions/close.svg';
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserDoc,
  selectUserDocId,
  setFinancialDetails,
} from "../../slices/userAuthSlice";
import { toCapitalizedWords } from "../../utils/common";

const DetailsModal = ({ property, onClose, initialActiveTab }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(initialActiveTab || "property");
  const [paymentMode, setPaymentMode] = useState(
    property.financialDetails?.paymentMode || ""
  );
  const [cash, setCash] = useState(property.financialDetails?.cash || "");
  const [loan, setLoan] = useState(property.financialDetails?.loan || "");
  const [loading, setLoading] = useState(false);

  const userDoc = useSelector(selectUserDoc);
  const userDocId = useSelector(selectUserDocId);

  const formatTitle = (key) => {
    if (key.toUpperCase() === "BHK") return "BHK";
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim(); // Format camelCase to Title Case
  };

  const addUnitsToValue = (key, value) => {
    const units = {
      landSize: "Sq.ft.",
      lengthOfPlot: "Ft.",
      widthOfPlot: "Ft.",
      superBuiltUpArea: "Sq.Ft.",
      purchasePrice: "Cr.",
      loan: "%",
    };

    return units[key] ? `${value} ${units[key]}` : value;
  };

  // This function filters out empty values and the 'details' object
  const filteredPropertyDetails = Object.entries(property)
    .filter(
      ([key, value]) =>
        value &&
        !["details", "Name", "Type", "financialDetails", "internalId"].includes(
          key
        )
    )
    .map(([key, value]) => ({ key: formatTitle(key), value }));

  if (property.financialDetails) {
    filteredPropertyDetails.push({
      key: "Payment Mode",
      value: property.financialDetails.paymentMode || "Not set",
    });
    filteredPropertyDetails.push({
      key: "Loan (%)",
      value: addUnitsToValue("loan", property.financialDetails.loan || "0"),
    });
  }

  // Split the filtered details into two columns
  const columnOne = filteredPropertyDetails
    .slice(0, 6)
    .map(({ key, value }) => ({
      key: formatTitle(
        key.includes("Size") || key.includes("Area")
          ? `${key} (Sq.ft.)`
          : key.includes("Length") || key.includes("Width")
            ? `${key} (Ft.)`
            : key.includes("Price")
              ? `${key} (Cr.)`
              : key
      ),
      value: addUnitsToValue(key, value),
    }));
  const columnTwo = filteredPropertyDetails
    .slice(6, 12)
    .map(({ key, value }) => ({
      key: formatTitle(
        key.includes("Size") || key.includes("Area")
          ? `${key} (Sq.ft.)`
          : key.includes("Length") || key.includes("Width")
            ? `${key} (Ft.)`
            : key.includes("Price")
              ? `${key} (Cr.)`
              : key
      ),
      value: addUnitsToValue(key, value),
    }));

  const toggleTab = (tabName) => {
    setActiveTab(tabName);
  };

  const handlePaymentModeChange = (event) => {
    setPaymentMode(event.target.value);
  };

  const handleCashChange = (event) => {
    const cashValue = Math.min(100, Math.max(0, parseInt(event.target.value)));
    setCash(cashValue.toString());
    setLoan((100 - cashValue).toString());
  };

  const handleLoanChange = (event) => {
    const loanValue = Math.min(100, Math.max(0, parseInt(event.target.value)));
    setLoan(loanValue.toString());
    setCash((100 - loanValue).toString());
  };

  /* const handleInput = (setter) => (event) => {
    const value = Math.min(
      100,
      Math.max(0, parseInt(event.target.value, 10) || 0)
    );
    setter(value.toString());
  }; */

  const isFormValid = () =>
    paymentMode && cash && loan && parseInt(cash) + parseInt(loan) === 100;

  const handleSave = async () => {
    setLoading(true);
    if (!isFormValid()) {
      return;
    }
    if (!userDoc || !userDocId) {
      return;
    }

    try {
      const properties = userDoc.propertiesAdded.map((p) => {
        if (
          (property.internalId && p.internalId === property.internalId) ||
          (!property.internalId && p.projectName === property.projectName)
        ) {
          dispatch(
            setFinancialDetails({
              updateProperty: {
                ...p,
                financialDetails: { paymentMode, cash, loan },
              },
            })
          );
          return { ...p, financialDetails: { paymentMode, cash, loan } };
        }
        return p;
      });

      await updateDoc(doc(db, "users", userDocId), {
        propertiesAdded: properties,
      });
      onClose(); // Optionally close the modal or clear form
    } catch (error) {
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#252626] bg-opacity-60 flex justify-center items-center">
      <div className="bg-[#FAFBFC] p-6 rounded-lg w-[750px] h-auto z-50 sm:w-[328px] sm:h-auto sm:mt-[60px]">
        <div className="flex justify-between items-center mb-[16px]">
          <h1 className="font-noticiaText font-bold text-[32px] text-[#252626] sm:text-[24px]">
            {toCapitalizedWords(property.projectName) || "Property Details"}
          </h1>
          <button onClick={onClose} type="button" className="close-button">
            <img src={cross} alt="Close" />
          </button>
        </div>
        <div className="flex-col mb-[20px]">
          <div className="flex space-x-4">
            <div
              onClick={() => toggleTab("property")}
              className="flex-col w-auto cursor-pointer"
            >
              <div
                className={`font-montserrat font-semibold text-[18px] ${activeTab === "property" ? "text-[#D67D00]" : "text-[#000000]"
                  } sm:text-[14px]`}
              >
                Property Details
              </div>
              {activeTab === "property" && (
                <div className="w-full rounded-t-full h-[4px] bg-[#D67D00] mt-[12px]"></div>
              )}
            </div>
            <div
              onClick={() => toggleTab("financial")}
              className="flex-col w-auto cursor-pointer"
            >
              <div
                className={`font-montserrat font-semibold text-[18px] ${activeTab === "financial"
                    ? "text-[#D67D00]"
                    : "text-[#000000]"
                  } sm:text-[14px]`}
              >
                Financial Details
              </div>
              {activeTab === "financial" && (
                <div className="w-full rounded-t-full h-[4px] bg-[#D67D00] mt-[12px]"></div>
              )}
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#D9D9D9]"></div>
        </div>
        {activeTab === "property" && (
          <div className="property-details-div flex space-x-12 sm:flex-col sm:space-x-0 sm:space-y-2">
            <div className="flex-col w-[50%] justify-between sm:w-full space-y-2">
              {columnOne.map(({ key, value }) => (
                <div key={key} className="flex justify-between">
                  <div className="font-montserrat font-semibold text-[13px] text-[#666667] w-2/3">
                    {key}:
                  </div>
                  <div className="font-montserrat font-bold text-[13px] text-[#000000] w-1/3">
                    {value}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-col w-[50%] justify-between sm:w-full space-y-2">
              {columnTwo.map(({ key, value }) => (
                <div key={key} className="flex justify-between">
                  <div className="font-montserrat font-semibold text-[13px] text-[#666667] w-2/3">
                    {key}:
                  </div>
                  <div className="font-montserrat font-bold text-[13px] text-[#000000] w-1/3">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "financial" && (
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label className="font-montserrat font-medium text-[14px] text-[#000000]">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={handlePaymentModeChange}
                className="border px-2 py-1 rounded-[6px] h-[48px] pr:w-[59%] ld:w-[59%]"
              >
                <option value="">Select Mode</option>
                <option value="Construction Linked Payment">
                  Construction Linked Payment
                </option>
                <option value="Time Linked Payment">Time Linked Payment</option>
                <option value="Outright Payment">Outright Payment</option>
              </select>
            </div>
            <div className="flex space-x-4 sm:w-full sm:space-x-0 sm:justify-between">
              <div className="flex flex-col sm:w-[45%]">
                <label className="font-montserrat font-medium text-[14px] text-[#000000]">
                  Cash(%)
                </label>
                <input
                  type="number"
                  placeholder="00"
                  value={cash}
                  onChange={handleCashChange}
                  className="border px-2 py-1 rounded-[6px] h-[48px]"
                />
              </div>
              <div className="flex flex-col sm:w-[45%]">
                <label className="font-montserrat font-medium text-[14px] text-[#000000]">
                  Loan(%)
                </label>
                <input
                  type="number"
                  placeholder="00"
                  value={loan}
                  onChange={handleLoanChange}
                  className="border px-2 py-1 rounded-[6px] h-[48px]"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={!isFormValid()}
              className="self-start px-4 py-2 mt-4 font-lato font-bold text-[14px] rounded-[8px] w-[160px] h-[45px] bg-[#153E3B] text-[#FAFBFC] flex justify-center items-center"
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
                "Save"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

DetailsModal.propTypes = {
  property: PropTypes.object,
  onClose: PropTypes.func,
  initialActiveTab: PropTypes.string,
};

export default DetailsModal;
