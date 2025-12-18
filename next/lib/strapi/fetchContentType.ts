import { draftMode } from 'next/headers';
import qs from 'qs';

import { spreadStrapiData } from './spreadStrapiData';
import type { StrapiResponse } from '@/types/strapi';

/**
 * Fetches data for a specified Strapi content type.
 *
 * @param {string} contentType - The type of content to fetch from Strapi.
 * @param {string} params - Query parameters to append to the API request.
 * @return {Promise<object>} The fetched data.
 */
export default async function fetchContentType(
  contentType: string,
  params: Record<string, unknown> = {},
  spreadData?: boolean
): Promise<any> {
  const { isEnabled: isDraftMode } = await draftMode();

  try {
    const queryParams = { ...params };

    if (isDraftMode) {
      queryParams.status = 'draft';
    }

    // Construct the full URL for the API request
    const url = new URL(`api/${contentType}`, process.env.API_URL);

    // Perform the fetch request with the provided query parameters
    const response = await fetch(`${url.href}?${qs.stringify(queryParams)}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'strapi-encode-source-maps': isDraftMode ? 'true' : 'false',
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch data from Strapi (url=${url.toString()}, status=${response.status})`
      );
      // Return appropriate fallback based on expected data structure
      return spreadData ? null : { data: [] };
    }
    const jsonData: StrapiResponse = await response.json();
    return spreadData ? spreadStrapiData(jsonData) : jsonData;
  } catch (error) {
    // Log any errors that occur during the fetch process
    console.error('FetchContentTypeError', error);
    // Return appropriate fallback based on expected data structure
    return spreadData ? null : { data: [] };
  }
}
