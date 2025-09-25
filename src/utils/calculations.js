export const formatarea = (price) => {
    if (!price && price !== 0) return;

    price = String(price);
    let isNegative = false;

    if (price < 0) {
      isNegative = true;
      price = Math.abs(price);
    }
    let priceStr = price?.toString().replace(/,/g, "");
    let [integerPart, decimalPart] = priceStr.split(".");

    let lastThree = integerPart.substring(integerPart.length - 3);
    let otherNumbers = integerPart.substring(0, integerPart.length - 3);

    if (otherNumbers !== "") {
      lastThree = "," + lastThree;
    }

    otherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    let formattedPrice = `${otherNumbers}${lastThree}`;
    if (decimalPart) {
      formattedPrice += `.${decimalPart}`;
    }

    if (isNegative) formattedPrice = `-${formattedPrice}`;

    return formattedPrice;
  };


// function to calculate weighted avg cagr takes cagr and holding period of the properties 
export function calculateWeightedAvgCAGR(properties) {
    let totalWeight = 0;
    let weightedGrowthSum = 0;

    // Loop through each property to calculate the weighted growth sum
    properties.forEach(property => {
      const { cagr, holdingPeriod } = property;

      // Convert CAGR to growth factor for the holding period
      const growthFactor = Math.pow(1 + cagr, holdingPeriod);

      // Add the weighted growth factor to the sum
      weightedGrowthSum += growthFactor * holdingPeriod;

      // Sum up the total weight (holding periods)
      totalWeight += holdingPeriod;
    });

    // Calculate the weighted average growth factor
    const weightedGrowthFactor = weightedGrowthSum / totalWeight;

    // Calculate the weighted CAGR from the weighted growth factor
    const weightedCAGR = Math.pow(weightedGrowthFactor, 1 / totalWeight) - 1;

    return parseFloat((weightedCAGR * 100).toFixed(2));
  }

export function getMostRecentDate(dates) {
    // Get today's date
    const today = new Date();

    // Function to convert date string (DD/MM/YYYY) to Date object
    function parseDate(dateStr) {
      const [day, month, year] = dateStr.split('/');
      return new Date(year, month - 1, day); // Month is 0-indexed
    }

    // Convert all date strings to Date objects
    const dateObjects = dates.map(dateStr => parseDate(dateStr));

    // Find the most recent date
    const mostRecentDate = dateObjects.reduce((latest, current) => {
      return current > latest ? current : latest;
    });

    // Return the most recent date in DD/MM/YYYY format
    const day = mostRecentDate.getDate().toString().padStart(2, '0');
    const month = (mostRecentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = mostRecentDate.getFullYear();

    return `${day}/${month}/${year}`;
  }