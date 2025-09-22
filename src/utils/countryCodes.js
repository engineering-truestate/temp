import axios from "axios";
import { COUNTRY_CODES_OPTIONS } from "../constants/countryCodes";

export const fetchCountryCodes = async () => {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all");
    const codes = response.data
      .filter(
        (country) =>
          country.idd.root &&
          country.idd.suffixes &&
          country.idd.suffixes.length > 0
      )
      .map((country) => {
        const code =
          "+" + country.idd.root.slice(1) + country.idd.suffixes[0];
        return {
          value: code,
          label: code,
        };
      })
      .filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.value === item.value)
      ) // Remove duplicates
      .sort((a, b) => {
        // Put +91 first, then sort others numerically
        if (a.value === "+91") return -1;
        if (b.value === "+91") return 1;
        return parseInt(a.value.slice(1)) - parseInt(b.value.slice(1));
      });

    return codes;
  } catch (error) {
    console.error("Failed to fetch country codes:", error);
    return COUNTRY_CODES_OPTIONS;
  }
};