import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "./AddProjectModal.module.css";
import { saveFormData } from "../../slices/apis/vault";
import { useDispatch, useSelector } from "react-redux";
import { addVaultForm } from "../../slices/userAuthSlice";
import VaultDropdown from "./VaultDropdown";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase";
import projectPopupStyles from "../Project_popup/ProjectPopup.module.css";
import infoIcon from "/assets/icons/ui/info.svg";
import { toCapitalizedWords } from "../../utils/common";
import { useToast } from "../../hooks/useToast";

const UnitDetailsForm = forwardRef(
  ({ formData, setFormData, selectedProperty, setLoading }, ref) => {
    const dispatch = useDispatch();
    const { assetType } = selectedProperty;
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({}); // Track errors for each field
    const { userDocId, userPhoneNumber , name} = useSelector((state) => state.userAuth);
    const { addToast } = useToast();

    useImperativeHandle(ref, () => ({
      submitForm() {
        return handleSubmit();
      },
    }));

    const preventNegative = (e) => {
      if (e.key === "-" || e.key === "+" || e.key === "e") {
        e.preventDefault();
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;

      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    };

    const validateFields = () => {
      const newErrors = {};

      if (!formData.yearOfPurchase || formData.yearOfPurchase.trim() === "") {
        console.log(1)
        newErrors["yearOfPurchase"] = "Year of Purchase is required";
      }

      const date = new Date();
      if (
        formData.yearOfPurchase &&
        (parseInt(formData.yearOfPurchase) > date.getFullYear() ||
          parseInt(formData.yearOfPurchase) < 1900)
      ) {
        console.log(2)
        newErrors["yearOfPurchase"] = "Please enter a vaild year";
      }
      if (
        assetType !== "plot" &&
        (!formData.sbua || formData.sbua.trim() === "")
      ) {
        console.log(3)
        newErrors["sbua"] = "Super Built-Up Area is required";
      }

      if (
        assetType === "plot" &&
        (!formData.plotArea || formData.plotArea.trim() === "")
      ) {
        console.log(4)
        newErrors["plotArea"] = "Plot Area is required";
      }

      if (
        (assetType === "villa or rowhouse" || assetType === "villa") &&
        (!formData.landSize || formData.landSize.trim() === "")
      ) {
        console.log(5)
        newErrors["landSize"] = "Land Size is required";
      }

      if (
        !formData.directionOfEntrance ||
        formData.directionOfEntrance.trim() === ""
      ) {
        console.log(6)
        newErrors["directionOfEntrance"] = "Direction of Entrance is required";
      }

      if (!formData.purchaseAmount || formData.purchaseAmount.trim() === "") {
        console.log(7)
        newErrors["purchaseAmount"] = "Purchase Price is required";
      }

      if (!formData.cornerUnit || formData.cornerUnit.trim() === "") {
        console.log(8)
        newErrors["cornerUnit"] = "Corner Unit is required";
      }

      if (
        assetType !== "plot" &&
        (!formData.configuration || formData.configuration.trim() === "")
      ) {
        console.log(9)
        newErrors["configuration"] = "Configuration is required";
      }

      return newErrors;
    };

    console.log(selectedProperty)
    const handleSubmit = async (e) => {
      if (e) e.preventDefault();
      const validationErrors = validateFields();

      if(!assetType || assetType.trim() === "" || assetType === undefined) {
        addToast("Error", "error", "assetType is empty");
        return false;
      }


      if (Object.keys(validationErrors).length > 0) {
        console.log("Validation errors:", validationErrors);
        setErrors(validationErrors);
        return false;
      } else {
        setLoading(true);

        console.log('inside',selectedProperty)
        setFormData({
          projectName: selectedProperty?.projectName,
          assetType: selectedProperty?.assetType,
          ...formData,
        });

        const updatedFormData = {
          projectName: selectedProperty?.projectName,
          assetType: selectedProperty?.assetType,
          ...formData,
        };

        if (!userDocId || !userPhoneNumber) {
          addToast("Error", "error", "Form data is missing");
          console.error("User authentication data missing");
          return false;
        }

        

        console.log('formdata', formData)
        //console.log('name in auth', name)
        const formId = await saveFormData({
          ...updatedFormData,
          projectName: selectedProperty?.projectName,
          projectId: selectedProperty?.projectId,
          //totalPricePaid: (formData.totalPricePaid * 10000000).toString(),
          purchaseAmount: (formData.purchaseAmount * 10000000),
          assetType: selectedProperty?.assetType,
          //projectId: selectedProperty?.id,
          userId: userDocId,
          userPhoneNumber,
        });
        console.log('kula', formId)
        const reportUrl = `${window.location.origin}/vault/investment/${encodeURIComponent(selectedProperty.projectName)}`;
        console.log('................', { formId, projectName: selectedProperty?.projectName , reportUrl: reportUrl })

        try {
          const checking = await dispatch(
            addVaultForm({ formData: updatedFormData, formId, projectId: selectedProperty?.projectId, projectName: selectedProperty?.projectName, reportUrl: reportUrl })
          ).unwrap();
          console.log("only krishna", checking);
          setLoading(false);
          return true;
        } catch (error) {
          console.error("addVaultForm error:", error);
          // Handle error appropriately - maybe show a toast or set error state
          addToast("Error", "error", error.message || "Failed to add vault form");
            setLoading(false);
            return false;
        }
      }
    };

    // Error rendering for each field
    const renderError = (fieldName) => {
      if (errors[fieldName]) {
        return (
          <p className={`${styles.h6} text-red-500`}>{errors[fieldName]}</p>
        );
      }
      return null;
    };

    return (
      <div>
        <div>
          <h2 className={`${styles.h7} `}>
            Add unit details for{" "}
            {toCapitalizedWords(selectedProperty.projectName)}
          </h2>

          <p className="font-lato font-medium text-sm text-[#433F3E] mb-6">
            *Fields are compulsory
          </p>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2"
          >
            {/* Left Column */}
            <div className="lg:pr-16 lg:border-r-1 lg:w-[100%]">
              <div className="mb-6">
                <label className={` ${styles.h8} block mb-1 `}>
                  Year Of Purchase*
                </label>
                <input
                  type="number"
                  name="yearOfPurchase"
                  value={formData.yearOfPurchase}
                  onChange={handleInputChange}
                  onKeyDown={preventNegative}
                  placeholder="Please Enter"
                  autoComplete="off"
                  inputMode="numeric"   // Allows numeric keypad on mobile
                  pattern="[0-9]*"  
                  className={`w-full px-4 py-2.5 border bg-[#FAFAFA] border-gray-300 rounded-lg focus:outline-none placeholder:font-['Lato']`}
                  min="1"
                />
                {renderError("yearOfPurchase")}
              </div>

              <div className="mb-6">
                <label className={` ${styles.h8} block mb-1 `}>
                  Purchase Price (Excluding Reg. Charges)*
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="1"
                    name="purchaseAmount"
                    value={formData.purchaseAmount}
                    onChange={handleInputChange}
                    onKeyDown={preventNegative}
                    placeholder="Please Enter"
                    autoComplete="off"
                    className={`bg-[#FAFAFA] focus:outline-none border border-gray-300 border-r-0 rounded-l-lg px-4 py-2.5 w-[90%] placeholder:font-['Lato']`}
                  />
                  <input
                    type="text"
                    className={`bg-[#FAFAFA] focus:outline-none border border-gray-300 border-l-0 rounded-r-lg px-2.5 text-right py-2.5 w-[calc(3.25rem+2rem)] ${styles.h12}`}
                    value="Crs"
                    disabled
                  />
                </div>
                {renderError("purchaseAmount")}
              </div>


              {assetType === "plot" ? (
                <div className="mb-6">
                  <label className={` ${styles.h8} block mb-1 `}>
                    Area of Plot*
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      name="plotArea"
                      value={formData.plotArea}
                      onChange={handleInputChange}
                      onKeyDown={preventNegative}
                      placeholder="Please Enter"
                      autoComplete="off"
                      className={`bg-[#FAFAFA] focus:outline-none border border-gray-300 border-r-0 rounded-l-lg px-4 py-2.5 w-[90%] placeholder:font-['Lato']`}
                      min="0"
                    />
                    <input
                      type="text"
                      className={`bg-[#FAFAFA] focus:outline-none border border-gray-300 border-l-0 px-2.5 text-right rounded-r-lg pl-5 py-2.5 w-[calc(3.25rem+2rem)]  ${styles.h12}`}
                      value="Sq Ft"
                      disabled
                    />
                  </div>
                  {renderError("plotArea")}
                </div>
              ) : assetType === "villa" ||
                assetType === "villa or rowhouse" ||
                assetType === "apartment" ? (
                <>
                <div className="mb-6">
                  <label className={` ${styles.h8} block mb-1`}>
                    Super Built Up Area*
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      min="1"
                      name="sbua"
                      value={formData.sbua}
                      onChange={handleInputChange}
                      onKeyDown={preventNegative}
                      placeholder="Please Enter"
                      autoComplete="off"
                      className="bg-[#FAFAFA] focus:outline-none border border-gray-300 border-r-0 rounded-l-lg px-4 py-2.5 w-[90%] placeholder:font-['Lato']"
                    />
                    <input
                      type="text"
                      className={`bg-[#FAFAFA] focus:outline-none border border-gray-300 border-l-0 px-2.5 text-right rounded-r-lg pl-5 py-2.5 w-[calc(3.25rem+2rem)] ${styles.h12}`}
                      value="Sq Ft"
                      disabled
                    />
                  </div>
                  {renderError("sbua")}
                </div>
              
                </>
              ) : null}

              <div className="mb-6">
                {(assetType === "apartment" ||
                  assetType === "villa or rowhouse" ||
                  assetType === "villa") && (
                  <div className="mb-6 hidden lg:block">
                    <label className={` ${styles.h8} block mb-1 `}>
                      Configuration*
                    </label>
                    <VaultDropdown
                      options={[
                        { label: "1 BHK", value: "1BHK" },
                        //{ label: "1.5 BHK", value: "1.5BHK" },
                        { label: "2 BHK", value: "2BHK" },
                        //{ label: "2.5 BHK", value: "2.5BHK" },
                        { label: "3 BHK", value: "3BHK" },
                        //{ label: "3.5 BHK", value: "3.5BHK" },
                        { label: "4 BHK", value: "4BHK" },

                        //{ label: "4.5 BHK", value: "4.5BHK" },
                        { label: "5 BHK", value: "5BHK" },
                      ]}
                      value={formData.configuration}
                      onChange={(value) => {
                        setFormData((prevState) => ({
                          ...prevState,
                          configuration: value,
                        }));
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          configuration: "", 
                        }));
                      }
                      }
                      placeholder="Please Select"
                    />
                    {renderError("configuration")}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className=" lg:pl-16 lg:border-l-2 lg:w-[100%]">
              {(assetType === "apartment" ||
                assetType === "villa or rowhouse" ||
                assetType === "villa") && (
                <div className="mb-6 block lg:hidden">
                  <label className={` ${styles.h8} block mb-1 `}>
                    Configuration*
                  </label>
                  <VaultDropdown
                    options={[
                      { label: "1 BHK", value: "1BHK" },
                        //{ label: "1.5 BHK", value: "1.5BHK" },
                        { label: "2 BHK", value: "2BHK" },
                        //{ label: "2.5 BHK", value: "2.5BHK" },
                        { label: "3 BHK", value: "3BHK" },
                        //{ label: "3.5 BHK", value: "3.5BHK" },
                        { label: "4 BHK", value: "4BHK" },

                        //{ label: "4.5 BHK", value: "4.5BHK" },
                        { label: "5 BHK", value: "5BHK" },
                    ]}
                    value={formData.configuration}
                    onChange={(value) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        configuration: value,
                      }));
                      setErrors((prevErrors) => ({
                      ...prevErrors,
                      configuration: "", 
                    }));
                    }
                      
                    }
                    placeholder="Please Select"
                  />
                  {renderError("configuration")}
                </div>
              )}

              <div className="mb-6">
                <label className={` ${styles.h8} block mb-1 `}>
                  Direction Of Entrance*
                </label>
                <VaultDropdown
                  options={[
                    { label: "North", value: "North" },
                    { label: "East", value: "East" },
                    { label: "South", value: "South" },
                    { label: "West", value: "West" },
                    { label: "North-East", value: "North-East" },
                    { label: "North-West", value: "North-West" },
                    { label: "South-East", value: "South-East" },
                    { label: "South-West", value: "South-West" }, 
                    { label: "Other", value: "Other" },
                  ]}
                  value={formData.directionOfEntrance}
                  onChange={(value) =>{
                    setFormData((prevState) => ({
                      ...prevState,
                      directionOfEntrance: value,
                    }));
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      directionOfEntrance: "", 
                    }));
                  }
                  }
                  placeholder="Please Select"
                />
                {renderError("directionOfEntrance")}
              </div>

              <div className="mb-6">
                <label className={` ${styles.h8} block mb-1 `}>
                  Is This a Corner Unit?*
                </label>
                <VaultDropdown
                  options={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                  value={formData.cornerUnit}
                  onChange={(value) => {
                    setFormData((prevState) => ({
                      ...prevState,
                      cornerUnit: value,
                    }));
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      cornerUnit: "", 
                    }));
                  }
                  }
                  placeholder="Please Select"
                />

                {renderError("cornerUnit")}
              </div>

              {assetType === "apartment" ? (
                <>
                <div className="mb-6 ">
                  <label className={` ${styles.h8} block mb-1 `}>
                    Floor (Optional)
                  </label>
                  <input
                    type="tel"
                    name="totalFloors"
                    value={formData.totalFloors}
                    onChange={handleInputChange}
                    onKeyDown={preventNegative}
                    placeholder="Please Enter"
                    autoComplete="off"
                    className={`w-full px-4 py-2.5 border bg-[#FAFAFA] border-gray-300 rounded-lg focus:outline-none placeholder:font-['Lato']`}
                  />
                </div>
                </>
              ) : assetType === "villa or rowhouse" || assetType === "villa" ? (
                <div className="mb-6">
                  <label className={`${styles.h8} block mb-1`}>
                    Land Size*
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      min="1"
                      name="landSize"
                      value={formData.landSize}
                      onChange={handleInputChange}
                      onKeyDown={preventNegative}
                      placeholder="Please Enter"
                      autoComplete="off"
                      className="bg-[#FAFAFA] focus:outline-none border border-gray-300 border-r-0 rounded-l-lg px-4 py-2.5 w-[90%] placeholder:font-['Lato']"
                    />

                    <input
                      type="text"
                      className={`bg-[#FAFAFA] focus:outline-none border border-gray-300 border-l-0 px-2.5 text-right rounded-r-lg pl-5 py-2.5 w-[calc(3.25rem+2rem)] ${styles.h12}`}
                      value="Sq ft"
                      disabled
                    />
                  </div>
                  {renderError("landSize")}
                </div>
              ) : null}

              <div className="mb-6">
                <label className={` ${styles.h8} block mb-1 `}>
                  Unit No. (Optional)
                </label>
                <input
                  type="text"
                  name="unitNo"
                  value={formData.unitNo}
                  onChange={handleInputChange}
                  onKeyDown={preventNegative}
                  placeholder="Please Enter"
                  autoComplete="off"
                  className={`w-full px-4 py-2.5 border bg-[#FAFAFA] border-gray-300 rounded-lg focus:outline-none placeholder:font-['Lato']`}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

export default UnitDetailsForm;
