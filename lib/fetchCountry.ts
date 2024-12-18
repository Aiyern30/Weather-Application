import { Country } from "@/type/country";

export const fetchAllCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    return data.map((country: any) => ({
      name: country.name.common,
      code: country.cca2,
    }));
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};
