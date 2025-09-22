import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { isString } from "highcharts";

export function formatCost(price) {
  if (!price && price !== 0) return;

  price = String(price);
  let isNegative = false;

  if (price < 0) {
    isNegative = true;
    price = Math.abs(price);
  }

  // Convert the price to a string and remove any existing commas
  let priceStr = price?.toString().replace(/,/g, "");

  // Split the number into integer and decimal parts
  let [integerPart, decimalPart] = priceStr.split(".");

  // Add commas for lakhs and crores
  let lastThree = integerPart.substring(integerPart.length - 3);
  let otherNumbers = integerPart.substring(0, integerPart.length - 3);

  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }

  otherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  // Combine the formatted integer part with decimal part (if exists)
  let formattedPrice = `₹${otherNumbers}${lastThree}`;
  if (decimalPart) {
    formattedPrice += `.${decimalPart}`;
  }

  if (isNegative) formattedPrice = `-${formattedPrice}`;

  return formattedPrice;
}

export const formatCostSuffix = (cost) => {
  let isNegative = false;

  if (cost < 0) {
    isNegative = true;
    cost = Math.abs(cost);
  }

  const formatValue = (value) => (value % 1 !== 0 ? value.toFixed(1) : value);

  if (cost >= 10000000) {
    const value = cost / 10000000;
    cost = `₹${formatValue(value)} Cr`;
  } else if (cost >= 100000) {
    const value = cost / 100000;
    cost = `₹${formatValue(value)} L`;
  } else {
    cost = `₹${cost}`;
  }

  if (isNegative) cost = `-${cost}`;
  return cost;
};

export function toCapitalizedWords(str) {
  if (!str || !isString(str)) return;
  str = str?.trim();

  const words = str.split(/\s+/);

  const capitalizedWords = words.map((word) => {
    // Check if the word is fully uppercase, and if so, leave it as is
    if (word === word.toUpperCase()) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return capitalizedWords.join(" ");
}

export const getProjectImages = (projectId, imageData) => {
  const projectImages =
    imageData.length > 0
      ? imageData.find((item) => item.project_id === projectId)
      : [];
  return projectImages ? projectImages.large_image_urls : [];
};

export const getSvgLinkForPrice = (price, isSelected) => {
  const svgString = isSelected
    ? `<svg width="65" height="32" viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_2581_105133)">
<rect x="4.5" y="2.5" width="61" height="22" rx="11" fill="#153E3B"/>
<text x="35" y="19" font-family="Arial" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">${`${price}`}</text>
<path d="M34.5 33L26.2728 23.25L42.7272 23.25L34.5 33Z" fill="#153E3B"/>
</g>
<defs>
<filter id="filter0_d_2581_105133" x="-3" y="-1" width="76" height="41" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2581_105133"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2581_105133" result="shape"/>
</filter>
</defs>
</svg>`
    : `<svg width="84" height="36" viewBox="0 0 84 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_8_10540)">
<rect x="5.5" y="2.5" width="70" height="22" rx="11" fill="#FAFAFA"/>


<text x="40" y="18" font-family="Arial" font-size="12" font-weight="700" fill="#151413" text-anchor="middle">${`${price}`}</text>

<path d="M44.5 33L36.2728 23.25L52.7272 23.25L44.5 33Z" fill="#FAFAFA"/>
</g>
<defs>
<filter id="filter0_d_8_10540" x="-4" y="-1" width="98" height="40" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_8_10540"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_8_10540" result="shape"/>
</filter>
</defs>
</svg>`;

  // Encode the SVG string to use it as a data URI
  const encodedSVG = encodeURIComponent(svgString);

  const src = `data:image/svg+xml;charset=utf-8,${encodedSVG}`;
  return src;
};

export const getSvgLinkForPriceWithTruTag = (price, isSelected) => {
  const svgString = isSelected
    ? `<svg width="65" height="32" viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_2581_105133)">
<rect x="4.5" y="2.5" width="61" height="22" rx="11" fill="#153E3B"/>
<text x="35" y="19" font-family="Arial" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">${price}</text>
<path d="M34.5 33L26.2728 23.25L42.7272 23.25L34.5 33Z" fill="#153E3B"/>
</g>
<defs>
<filter id="filter0_d_2581_105133" x="-3" y="-1" width="76" height="41" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2581_105133"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2581_105133" result="shape"/>
</filter>
</defs>
</svg>`
    : `<svg width="84" height="36" viewBox="0 0 84 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_8_10540)">
<rect x="5.5" y="2.5" width="79" height="22" rx="11" fill="#FAFAFA"/>
<rect x="7.5" y="4.5" width="18" height="18" rx="9" fill="#0A0B0A"/>
<path d="M22 9.92315V12.4075L16.4928 9.4843H16.4919L11 12.4V9.91484L16.4919 7L22 9.92315Z" fill="#FAFAFA"/>
<path d="M22 14.4647V17.8491H19.6591V15.7064L19.6438 15.6981L17.67 14.6508V20.0001H15.33V14.6425L13.34 15.6981V17.8491H11V14.4563L13.34 13.2138L16.491 11.5415L16.5 11.5457L19.6591 13.2221L22 14.4647Z" fill="#FAFAFA"/>
<text x="55" y="18" font-family="Arial" font-size="12" font-weight="700" fill="#151413" text-anchor="middle">${price}</text>
<path d="M44.5 33L36.2728 23.25L52.7272 23.25L44.5 33Z" fill="#FAFAFA"/>
</g>
<defs>
<filter id="filter0_d_8_10540" x="-4" y="-1" width="98" height="40" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_8_10540"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_8_10540" result="shape"/>
</filter>
</defs>
</svg>`;
  // Encode the SVG string to use it as a data URI
  const encodedSVG = encodeURIComponent(svgString);
  const src = `data:image/svg+xml;charset=utf-8,${encodedSVG}`;
  return src;
};

export const bulkUploadLarge = async (dataArray) => {
  const collectionRef = collection(db, "new_projects"); // Adjust collection name

  try {
    for (let i = 0; i < dataArray.length; i += 500) {
      const batch = writeBatch(db); // Create a new batch for each 500 operations
      const batchChunk = dataArray.slice(i, i + 500); // Split the data into chunks of 500 or fewer

      batchChunk.forEach((data) => {
        const docRef = doc(collectionRef); // Create a new document reference
        batch.set(docRef, data); // Add the document to the batch
      });

      await batch.commit(); // Commit the batch for the current chunk
    }
  } catch (error) {}
};

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

export const formatMonthYear = (dateString) => {
  const [month, year] = dateString.split("/");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthIndex = parseInt(month) - 1;
  return `${months[monthIndex]} ${year}`;
};

export const arrayToString = (array) => {
  if (!Array.isArray(array)) {
    throw new Error("Input must be an array");
  }
  array = array.map((arr) => toCapitalizedWords(arr));
  return array.join(", ");
};

export function formatTimestampDateWithoutDate(timestamp) {
  // If timestamp is too large, assume it's in milliseconds
  if (timestamp > 1e10) {
    timestamp = Math.floor(timestamp / 1000); // Convert to seconds
  }

  const date = new Date(timestamp * 1000); // Ensure timestamp is in milliseconds

  const day = date.getDate(); // Using local date instead of UTC
  const month = date.toLocaleString("en-US", {
    month: "long",
    timeZone: "Asia/Kolkata",
  });
  const year = date.getFullYear(); // Using local year instead of UTC

  return `${month} ${year}`;
}

export function formatTimestampDate(timestamp) {
  // If timestamp is too large, assume it's in milliseconds
  if (timestamp > 1e10) {
    timestamp = Math.floor(timestamp / 1000); // Convert to seconds
  }

  const date = new Date(timestamp * 1000); // Ensure timestamp is in milliseconds

  const day = date.getUTCDate();
  const month = date.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

export function formatDate(date) {
  let dateObj;

  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === "number") {
    // Handle Unix timestamps - if it's in seconds (10 digits), convert to milliseconds
    const timestamp = date.toString().length === 10 ? date * 1000 : date;
    dateObj = new Date(timestamp);
  } else {
    // Handle strings and other formats
    dateObj = new Date(date);
  }

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "____";
  }

  // Use Intl.DateTimeFormat to properly convert to IST and format
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedDate = formatter.format(dateObj).split(" ");
  return `${formattedDate[1]} ${formattedDate[0]} ${formattedDate[2]}`;
}

export const upperCaseProperties = {
  "kns ananta": "KNS Ananta",
  "svb maplewood": "SVB Maplewood",
  "dnr solace": "DNR Solace",
  "snn estates felicity": "SNN Estates Felicity",
  "tata raagam": "TATA Raagam",
  "jrc wildwoods": "JRC Wildwoods",
  "dnr arista": "DNR Arista",
  "kns billore": "KNS Billore",
  "kns athena": "KNS Athena",
  "slv millenial": "SLV Millenial",
  "ssvr niyaara": "SSVR Niyaara",
  "kns candrill": "KNS Candrill",
  "psr vanasree": "PSR Vanasree",
  "ars signaturehomes": "ARS Signaturehomes",
  "cascedia tvs emerald": "Cascedia TVS Emerald",
  "dnr parklink": "DNR Parklink",
  "grc saffron skies": "GRC Saffron Skies",
};

export function customRound(decimal) {
  const fractionalPart = decimal % 1; // Get the fractional part of the number
  if (fractionalPart < 0.5) {
    return Math.floor(decimal); // Round down
  } else {
    return Math.ceil(decimal); // Round up
  }
}

export function formatPhoneNumber(phoneNumber) {
  if (!/^\+\d{12}$/.test(phoneNumber)) {
    throw new Error(
      "Invalid phone number format. Expected format: +918774544343"
    );
  }

  // Extract country code and number parts
  const countryCode = phoneNumber.slice(0, 3); // "+91"
  const numberPart = phoneNumber.slice(3); // "8774544343"

  // Format the number part
  const formattedNumber = `${numberPart.slice(0, 3)}-${numberPart.slice(3, 6)}-${numberPart.slice(6)}`;

  // Return the final formatted phone number
  return `${countryCode} ${formattedNumber}`;
}

export function formatToOneDecimal(decimal) {
  console.log("Decimal value received:",Math.trunc(decimal * 10) / 10);
  return Math.trunc(decimal * 10) / 10;
}

export function getTruGrowthStatus(cagr) {
  if (cagr <= 4) {
    return "Low";
  } else if (cagr <= 8) {
    return "Medium";
  } else if (cagr > 8) {
    return "High";
  } else {
    return;
  }
}
