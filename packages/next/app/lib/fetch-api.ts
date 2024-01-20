// greets https://github.com/strapi/nextjs-corporate-starter/blob/main/frontend/src/app/%5Blang%5D/utils/fetch-api.tsx#L4

import qs from "qs";
import { strapiUrl } from "./constants";

export default async function fetchAPI(
  path: string,
  urlParamsObject = {},
  options = {}
) {
  try {
    // Merge default and user options
    const mergedOptions = {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${strapiUrl}/api${path}${queryString ? `?${queryString}` : ""}`;

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error(error);
    throw new Error(`Error while fetching data from API.`);
  }
}