/**
 * Report Service
 * Handles all report-related API calls
 */

const REPORT_API_BASE_URL = "https://cashflow-calc-dot-iqol-crm.uc.r.appspot.com/api";

/**
 * Fetch investment report from the API
 * @param {Object} payload - The payload for the investment report request
 * @param {number} payload.acquisitionPrice - The acquisition price
 * @param {number} payload.tenure - The tenure in years
 * @param {number} payload.holdingPeriod - The holding period in years
 * @param {string} payload.constructionCompletionDate - Construction completion date
 * @param {number} payload.finalPrice - The final selling price
 * @param {number} payload.interestRate - The interest rate
 * @param {string} payload.selectedCharge - The selected charge type
 * @param {string} payload.assetType - The asset type (apartment, plot, etc.)
 * @returns {Promise<Object>} The investment report data
 */
export const fetchInvestmentReport = async (payload) => {
  try {
    const response = await fetch(`${REPORT_API_BASE_URL}/investmentReport`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching investment report:", error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
};

/**
 * Validate report payload before sending to API
 * @param {Object} payload - The payload to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateReportPayload = (payload) => {
  const errors = [];

  if (!payload.acquisitionPrice || payload.acquisitionPrice <= 0) {
    errors.push("Acquisition price must be greater than 0");
  }

  if (!payload.tenure || payload.tenure <= 0) {
    errors.push("Tenure must be greater than 0");
  }

  if (!payload.holdingPeriod || payload.holdingPeriod <= 0) {
    errors.push("Holding period must be greater than 0");
  }

  if (!payload.finalPrice || payload.finalPrice <= 0) {
    errors.push("Final price must be greater than 0");
  }

  if (!payload.interestRate || payload.interestRate <= 0) {
    errors.push("Interest rate must be greater than 0");
  }

  if (!payload.assetType) {
    errors.push("Asset type is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};