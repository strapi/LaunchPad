/**
 * Fetches data for a specified Strapi content type.
 *
 * @param {string} contentType - The type of content to fetch from Strapi.
 * @param {string} params - Query parameters to append to the API request.
 * @return {Promise<object>} The fetched data.
 */

import { draftMode } from "next/headers";
import qs from "qs";

interface StrapiData {
  id: number;
  [key: string]: any; // Allow for any additional fields
}

interface StrapiResponse {
  data: StrapiData | StrapiData[];
}

export function spreadStrapiData(data: StrapiResponse): StrapiData | null {
  if (Array.isArray(data.data) && data.data.length > 0) {
    return data.data[0];
  }
  if (!Array.isArray(data.data)) {
    return data.data;
  }
  return null;
}

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export default async function fetchContentType(
  contentType: string,
  params: Record<string, unknown> = {},
  spreadData: boolean = false
): Promise<any> {
  const { isEnabled: isDraftMode } = draftMode();

  try {
    const queryParams = { ...params };

    if (isDraftMode) {
      queryParams.status = "draft";
    }

    const url = `${baseURL}/${contentType}?${qs.stringify(queryParams)}`;

    // Perform the fetch request with the provided query parameters
    const response = await fetch(url, {
      method: "GET",
      cache: isDraftMode ? "no-store" : "default",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from Strapi (url=${url}, status=${response.status})`
      );
    }
    const jsonData: StrapiResponse = await response.json();

    if (jsonData.data.length === 0) {
    }

    return spreadData ? spreadStrapiData(jsonData) : jsonData;
  } catch (error) {
    // Log any errors that occur during the fetch process
    console.error("FetchContentTypeError", error);
  }
}
