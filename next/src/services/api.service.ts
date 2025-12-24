import { BodyClassic, AppHeaders } from "@/types/ApiResponseType";
import { sendRequestServer } from "./api.actions";
// import { getAuthSession } from "../lib/auth";
// import { UserInterfaceAuth } from "@/types/user/user_schema";

/**
 * Default headers for API requests
 */
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

/**
 * Base service class for handling API requests
 * Provides common HTTP methods and authentication functionality
 */
export default class ApiService {
  /**
   * Abstract method to be implemented by child classes
   * Defines the base endpoint for the service
   */
  protected endpoint(): string {
    throw new Error("The method 'endpoint' is not implemented.");
  }

  /**
   * Sends a POST request to the API
   * @param {Object} params - Request parameters
   * @param {string} [params.endPointOption=""] - Additional endpoint path
   * @param {string} [params.url] - Override default URL
   * @param {ApiResponseType.BodyClassic} params.body - Request body
   * @param {ApiResponseType.AppHeaders} [params.headers] - Additional headers
   * @param {string} [params.token] - Authentication token
   */
  async post({
    endPointOption = "",
    url,
    body,
    headers,
    token,
  }: {
    endPointOption?: string;
    url?: string;
    body: BodyClassic<any>;
    headers?: AppHeaders;
    token?: string;
  }): Promise<Response> {
    try {
      return await this.sendRequest({
        method: "POST",
        endPointOption,
        url,
        body,
        headers,
        token,
      });
    } catch (error) {
      console.error("Error in POST request:", error);
      throw error;
    }
  }

  /**
   * Sends a GET request to the API
   * Similar parameter structure as post method
   */
  async get({
    endPointOption = "",
    url,
    headers,
    token,
  }: {
    endPointOption?: string;
    url?: string;
    headers?: AppHeaders;
    token?: string;
  }): Promise<Response> {
    return await this.sendRequest({
      method: "GET",
      endPointOption,
      url,
      // body: null,
      headers,
      token,
    });
  }

  /**
   * Sends a PATCH request to the API
   * Similar parameter structure as post method
   */
  async patch({
    endPointOption = "",
    url,
    body,
    headers,
    token,
  }: {
    endPointOption?: string;
    url?: string;
    body: BodyClassic<any>;
    headers?: AppHeaders;
    token?: string | null;
  }): Promise<Response> {
    return await this.sendRequest({
      method: "PATCH",
      endPointOption,
      url,
      body,
      headers,
      token,
    });
  }

  /**
   * Sends a PUT request to the API
   * Similar parameter structure as post method
   */
  async put({
    endPointOption = "",
    url,
    body,
    headers,
    token,
  }: {
    endPointOption?: string;
    url?: string;
    body: BodyClassic<any>;
    headers?: AppHeaders;
    token?: string | null;
  }): Promise<Response> {
    return await this.sendRequest({
      method: "PUT",
      endPointOption,
      url,
      body,
      headers,
      token,
    });
  }

  /**
   * Sends a DELETE request to the API
   * Similar parameter structure as get method
   */
  async delete({
    endPointOption = "",
    url,
    headers,
    token,
  }: {
    endPointOption: string;
    url?: string;
    headers?: AppHeaders;
    token?: string;
  }): Promise<Response> {
    return await this.sendRequest({
      method: "DELETE",
      endPointOption,
      url,
      body: undefined,
      headers,
      token,
    });
  }

  /**
   * Fetches select table data from the API
   * @param {Object} params - Request parameters
   * @param {string[]} params.tables - Tables to fetch data from
   * @param {string} [params.portail] - Portal identifier
   * @returns {Promise<T>} Generic type response
   */
  async getDataSelectTable<T>({
    tables,
    portail,
  }: {
    tables: string[];
    portail?: string;
  }): Promise<T> {
    try {
      const body = {
        data_select: tables,
        portail,
      };

      const response = await this.sendRequest({
        method: "POST",
        endPointOption: "",
        url: `${process.env.API_URL}/app/data-select`,
        body,
      });

      if (!response.ok) {
        throw new Error(
          response.statusText || "Failed to fetch data select table"
        );
      }

      const data = await response.json();

      if (data) return data;

      throw new Error("Failed to fetch data select table");
    } catch (error) {
      console.error("Error in getDataSelectTable:", error);
      throw error;
    }
  }


  async getAllEntity() {
    try {
      const response = await this.sendRequest({
        method: "GET",
        endPointOption: "",
        url: `${process.env.API_URL}/app/data-all-entity`,
      });

      if (!response.ok) {
        throw new Error(
          response.statusText || "Failed to fetch data select table"
        );
      }

      const data = await response.json();

      if (data) return data;

      throw new Error("Failed to fetch all table");
    } catch (error) {
      console.error("Error in getTable:", error);
      throw error;
    }
  }

  /**
   * Gets the current authenticated user
   * @returns {Promise<UserInterfaceAuth | undefined>} Current user or undefined
   */
  // async getCurrentUser(): Promise<UserInterfaceAuth | undefined> {
  //   try {
  //     const session = await getAuthSession();
  //     return session?.user;
  //   } catch (error) {
  //     console.error("Error getting current user:", error);
  //     return undefined;
  //   }
  // }

  /**
   * Core method for sending requests to the API
   * Handles authentication and header management
   * @param {Object} params - Request parameters
   * @returns {Promise<Response>} Fetch API response
   */
  async sendRequest({
    method,
    endPointOption = "",
    url,
    body,
    headers,
    token,
  }: {
    method: string;
    endPointOption: string;
    url?: string;
    body?: BodyClassic<any>;
    headers?: AppHeaders;
    token?: string | null;
  }): Promise<Response> {
    const apiUrl = `${this.endpoint()}${endPointOption}`;
    const data = JSON.stringify(body ?? {});
    const appHeaders = new Headers(DEFAULT_HEADERS);

    // Merge additional headers if provided
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        appHeaders.append(key, value);
      });
    }

    // Handle authentication token
    // const session = await getAuthSession();
    // const userToken = token ?? session?.token;
    // if (userToken && userToken !== "not_auth") {
    //   appHeaders.append("Authorization", `Bearer ${userToken}`);
    //   appHeaders.append("X-Site-ID", `${session?.user.currentSiteId}`);
    // }

    return sendRequestServer({
      url: url ?? `${process.env.API_URL}${apiUrl}`,
      headers: appHeaders,
      method,
      body: data,
    });
  }
}
