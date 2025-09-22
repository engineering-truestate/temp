  export const countryCodeDropdownStyle = {
    control: (provided, state) => ({
      ...provided,
      border: "1px solid #d1d5db", // Same as border-gray-300 (matches your other inputs)
      borderRadius: "6px",
      padding: "0",
      boxShadow: "none", // Remove default react-select shadow
      "&:hover": {
        borderColor: "#d1d5db", // Keep same border color on hover
        boxShadow: "none",
      },
      "&:focus-within": {
        borderColor: "#d1d5db", // Keep same border color when focused
        boxShadow: "none",
        outline: "none",
      },
      minHeight: "38px",
      width: "100%",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "96px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? "#153E3B" 
        : state.isFocused 
        ? "#F0F1F2" 
        : "white",
      color: state.isSelected ? "white" : "#252626",
      padding: "8px 4px",
      fontSize: "13px",
      textAlign: "left",
    }),
    input: (provided) => ({
      ...provided,
      padding: 0,
    }),
    singleValue: (provided) => ({
      ...provided,
      marginLeft: 0,
      marginRight: 0,
      fontSize: "13px",
      color: "#252626",
      textAlign: "left",
      width: "100%",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 0 2px 4px",
      justifyContent: "flex-start",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "2px",
      width: "16px",
    }),
  };