import {
  formatCostSuffix,
  toCapitalizedWords,
  upperCaseProperties,
  formatCost
} from "./common.js";

export const handleStatus = (status) => {
    if (status === "Shared") {
      return "Being Discussed";
    }
    if (status.includes("Back")) {
      return "Not Interested";
    }
    return toCapitalizedWords(status);
  };

  export const handleStatusColour = (status) => {
    if (status === "Not Discussed") {
      return "#FBDD97";
    } else if (status === "Being Discussed") {
      return "#FCE9BA";
    } else if (status === "Booking Amount") {
      return "#91F3BF";
    } else if (status === "Not Interested") {
      return "#F9ABB9";
    } else if (status === "Short Listed") {
      return "#F6BC2F";
    } else {
      return "#C2EFE9";
    }
  };

  // const handleTruGrowthStatus = (status) => {
  //   return toCapitalizedWords(status) + " growth";
  // };

  export const handleTruGrowthStatus = (cagr) => {
    if (cagr <= 4) {
      return "Low CAGR";
    } else if (cagr <= 8) {
      return "Medium CAGR";
    } else if (cagr > 8) {
      return "High CAGR";
    }
  };

  export const handleTruValueStatus = (status) => {
    return toCapitalizedWords(status);
  };

  export const handleGrowthAndValueStatusColour = (status) => {
    if (status === "Undervalued") {
      return "#DAFBEA";
    } else if (status === "Overvalued") {
      return "#F9ABB9";
    } else if (status === "Fairly Valued") {
      return "#FBDD97";
    }
  };

  export const handleGrowthStatusColour = (status) => {
    if (status === "High CAGR") {
      return "#DAFBEA";
    } else if (status === "Low CAGR") {
      return "#FCD5DC";
    } else if (status === "Medium CAGR") {
      return "#FBDD97";
    }
  };

  export const handleGrowthStatusTextColour = (status) => {
    if (status === "High CAGR") {
      // return "#0E8345";
      return "#151413";
    } else if (status === "Low CAGR") {
      return "#BD0E2D";
    } else if (status === "Medium CAGR") {
      return "#866106";
    }
  };

  export const handleAddedBy = (recommendedBy) => {
      if (recommendedBy) {
        if (
          recommendedBy === "Customer" ||
          recommendedBy === "masal" ||
          recommendedBy === "agent"
        ) {
          return toCapitalizedWords(recommendedBy);
        }
  
        const agentData = agentsData?.find(
          (agent) => agent.email === recommendedBy
        );
        if (agentData) {
          return toCapitalizedWords(agentData.name);
        }
        return recommendedBy;
      }
      return "";
    };

export const handleGrowthCagr = (cagr) => {
    if (cagr <= 4) {
      return "Low";
    } else if (cagr <= 8) {
      return "Medium";
    } else if (cagr > 8) {
      return "High";
    }
    return "Overvalued";
  };


export const handleValue = (value) => {
    if (value) {
      return toCapitalizedWords(value);
    }
    return "Undervalued";
  };

export const handleGrowth = (growth) => {
    if (growth) {
      return toCapitalizedWords(growth);
    }
    return "Overvalued";
  };

export const handleValueGrowthColor = (item) => {
    if (item === "Undervalued" || item === "High") {
      return "#DAFBEA";
    } else if (item === "Overvalued" || item === "Low") {
      return "#F9ABB9";
    } else if (item === "Fairly Valued" || item === "Medium") {
      return "#FBDD97";
    } else return "#FBDAC0";
  };

export const handlePrices = (price) => {
    if (price) {
      return formatCost(parseInt(price));
    } else return "____";
  };

export function formatHandOverDate(date) {
    if (date === "____") return date;
    const [month, year] = date.split("/");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  }