"use server";

/**
 * Custom error class for API requests
 */
class ApiRequestError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
  }
}

/**
 * Sends an HTTP request to the server with the specified parameters
 */
export async function sendRequestServer({
  url,
  method,
  body,
  headers,
  cache = "no-store",
  timeout = 90000, // 90 seconds timeout
}: {
  url: string;
  method: string;
  body?: string;
  headers?: Headers;
  cache?: RequestCache;
  timeout?: number;
}): Promise<Response> {
  try {
    // Validate required parameters
    if (!url) throw new ApiRequestError(400, "URL is required");
    if (!method) throw new ApiRequestError(400, "HTTP method is required");

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Common request options
    const requestOptions: RequestInit = {
      method,
      headers,
      cache,
      signal: controller.signal,
    };

    // Add body for non-GET requests
    if (method !== "GET" && body) {
      requestOptions.body = body;
    }

    // Make the request
    const response = await fetch(url, requestOptions);

    // Clear timeout
    clearTimeout(timeoutId);

    // Log only in development
    if (process.env.NODE_ENV === "development") {
      console.log({
        url,
        method,
        headers,
        body,
        status: response.status,
        statusText: response.statusText,
      });
      // console.log({response});
    }

    // Handle common HTTP errors
    if (!response.ok) {
      throw new ApiRequestError(
        response.status,
        `Request failed: ${response.statusText}`
      );
    }

    return response;
  } catch (error: any) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    if (error.name === "AbortError") {
      throw new ApiRequestError(408, "Request timeout");
    }

    // Handle other errors
    console.error("API Request Error:", error);
    // throw new ApiRequestError(500, "Internal request error");
    throw error;
  }
}
