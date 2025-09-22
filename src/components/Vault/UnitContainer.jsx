import { useEffect, useState } from "react";
const arrow = '/assets/vault/icons/navigation/arrow-left.svg';
import PropTypes from "prop-types";

const UnitContainer = ({
  onBack,
  onNext,
  propertyType,
  projectName,
  projectType,
  id,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    Name: projectName || initialData.projectName || "",
    Type: projectType || initialData.propertyType || "",
    pinCode: initialData.pinCode || "",
    yearOfPurchase: initialData.yearOfPurchase || "",
    purchasePrice: initialData.purchasePrice || "",
    unitNo: initialData.unitNo || "",
    cornerUnit: initialData.cornerUnit || "",
    bhk: initialData.bhk || "",
    superBuiltUpArea: initialData.superBuiltUpArea || "",
    floor: initialData.floor || "",
    directionOfEntrance: initialData.directionOfEntrance || "",
    landSize: initialData.landSize || "",
    lengthOfPlot: initialData.lengthOfPlot || "",
    widthOfPlot: initialData.widthOfPlot || "",
    internalId: id || "",
    details: initialData.details || {
      current: "",
      pfp: "",
      loanPending: "",
      rent: "",
      return: "",
      acquisition: "",
      netValue: "",
      totalLoan: "",
      rentalYield: "",
      returnPercentage: "",
      isComplete: "no",
    },
    financialDetails: initialData.financialDetails || {
      paymentMode: "",
      cash: "",
      loan: "",
    },
  });

  useEffect(() => {
    // Only update formData if the dependencies have actually changed
    if (
      projectName !== formData.Name ||
      projectType !== formData.Type ||
      propertyType !== formData.Type
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...initialData,
        Name: projectName || initialData.projectName || "",
        Type: projectType || initialData.propertyType || "",
        pinCode: initialData.pinCode || "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName, projectType, propertyType, initialData]);

  const inputFieldsBasedOnType = {
    apartment: [
      {
        label: "Year of Purchase",
        name: "yearOfPurchase",
        type: "text",
        placeholder: "E.g. 2022",
      },
      {
        label: "Purchase Price in Crores",
        name: "purchasePrice",
        type: "text",
        placeholder: "E.g. 1.3",
      },
      {
        label: "Unit No.",
        name: "unitNo",
        type: "text",
        placeholder: "E.g. C102",
      },
      {
        label: "Is This a Corner Unit?",
        name: "cornerUnit",
        type: "select",
        options: ["Yes", "No"],
      },
      {
        label: "BHK",
        name: "bhk",
        type: "select",
        options: ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"],
      },
      {
        label: "Super Built Up Area (Sq ft)",
        name: "superBuiltUpArea",
        type: "text",
        placeholder: "E.g. 1200",
      },
      { label: "Floor", name: "floor", type: "text", placeholder: "E.g. 13" },
      {
        label: "Direction of Entrance",
        name: "directionOfEntrance",
        type: "select",
        options: ["North", "South", "East", "West"],
      },
    ],
    "villa or rowhouse": [
      {
        label: "Year of Purchase",
        name: "yearOfPurchase",
        type: "text",
        placeholder: "E.g. 2022",
      },
      {
        label: "Purchase Price in Crores",
        name: "purchasePrice",
        type: "text",
        placeholder: "E.g. 1.3",
      },
      {
        label: "Unit No.",
        name: "unitNo",
        type: "text",
        placeholder: "E.g. C102",
      },
      {
        label: "Is This a Corner Unit?",
        name: "cornerUnit",
        type: "select",
        options: ["Yes", "No"],
      },
      {
        label: "BHK",
        name: "bhk",
        type: "select",
        options: ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"],
      },
      {
        label: "Super Built Up Area (Sq ft)",
        name: "superBuiltUpArea",
        type: "text",
        placeholder: "E.g. 1200",
      },
      {
        label: "Land Size (Sq ft)",
        name: "landSize",
        type: "text",
        placeholder: "E.g. 3000",
      },
      {
        label: "Direction of Entrance",
        name: "directionOfEntrance",
        type: "select",
        options: ["North", "South", "East", "West"],
      },
    ],
    plot: [
      {
        label: "Year of Purchase",
        name: "yearOfPurchase",
        type: "text",
        placeholder: "E.g. 2022",
      },
      {
        label: "Purchase Price in Crores",
        name: "purchasePrice",
        type: "text",
        placeholder: "E.g. 1.3",
      },
      {
        label: "Unit No.",
        name: "unitNo",
        type: "text",
        placeholder: "E.g. C102",
      },
      {
        label: "Is This a Corner Unit?",
        name: "cornerUnit",
        type: "select",
        options: ["Yes", "No"],
      },
      {
        label: "Length of Plot",
        name: "lengthOfPlot",
        type: "text",
        placeholder: "E.g. 1000",
      },
      {
        label: "Width of Plot",
        name: "widthOfPlot",
        type: "text",
        placeholder: "E.g. 1000",
      },
      {
        label: "Direction of Entrance",
        name: "directionOfEntrance",
        type: "select",
        options: ["North", "South", "East", "West"],
      },
    ],
  };

  const inputFields =
    inputFieldsBasedOnType[propertyType] || inputFieldsBasedOnType["Apartment"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let regex;

    switch (name) {
      case "yearOfPurchase":
        regex = /^\d{0,4}$/;
        break;
      case "purchasePrice":
        regex = /^(?:\d{0,3}(?:\.\d{0,2})?)?$/;
        break;
      case "unitNo":
        regex = /^[a-zA-Z0-9]*$/;
        break;
      case "superBuiltUpArea":
        regex = /^\d*$/;
        break;
      case "floor":
        regex = /^\d*$/;
        break;
      default:
        regex = /.*/;
    }

    if (regex.test(value)) {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const isButtonActive = inputFields.every(
    (field) => formData[field.name] && formData[field.name].trim() !== ""
  );

  const handleSubmit = () => {
    onNext({ ...formData, internalId: id });
  };

  return (
    <div className="flex flex-col main-content py-10 px-32 bg-[#FAFBFC] w-[75%] sm:w-full sm:px-6 pr:w-full pr:px-28">
      <div onClick={onBack} className="flex space-x-[12px] cursor-pointer">
        <img src={arrow} alt="arrow" />
        <div className="font-montserrat font-semibold text-[14px] text-[#7A7B7C]">
          Back
        </div>
      </div>
      <div className="mt-5 font-noticiaText font-bold text-[40px] sm:text-[28px] text-[#252626]">
        Add Your Unit Details
      </div>
      <div className="flex flex-wrap -mx-2 mt-[25px] sm:flex-col">
        {inputFields.map((field, index) => (
          <div className="px-2 w-1/2 sm:w-full" key={index}>
            <label className="block font-montserrat font-medium text-[14px] text-[#252626]">
              {field.label}
              <span className="text-[#E11E1E]">*</span>
            </label>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                className="w-full h-[48px] border-[1px] border-[#A3A4A5] rounded-[6px] py-2 px-[16px] font-lato font-normal text-[16px] text-[#252626] mt-[5px] mb-6"
              >
                <option value="">Please Select</option>
                {field.options.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={field.name}
                type="text"
                placeholder={field.placeholder || "Please Enter"}
                value={formData[field.name]}
                onChange={handleInputChange}
                className="w-full h-[48px] border-[1px] border-[#A3A4A5] rounded-[6px] py-2 px-[16px] font-lato font-normal text-[16px] text-[#252626] mt-[5px] mb-6"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-start">
        <button
          onClick={handleSubmit}
          type="submit"
          className={`w-[300px] h-[48px] border-[1px] border-[#A3A4A5] rounded-[6px] p-2 sm:mt-2 sm:mb-10 sm:w-full pr:w-[48.5%] pr:mt-2 ld:w-[48.5%] ${
            isButtonActive
              ? "bg-[#153E3B] text-[#FAFBFC]"
              : "bg-[#CFCECE] text-[#7A7B7C]"
          }`}
          disabled={!isButtonActive}
        >
          Next
        </button>
      </div>
    </div>
  );
};

UnitContainer.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  propertyType: PropTypes.string,
  projectName: PropTypes.string,
  projectType: PropTypes.string,
  id: PropTypes.string,
  initialData: PropTypes.object,
};

export default UnitContainer;
