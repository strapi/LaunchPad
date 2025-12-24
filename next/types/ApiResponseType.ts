// ApiResponseType.ts
import { z } from "zod";

/**
 * Schema for pagination data validation using Zod
 * Defines the structure and types of pagination information returned by the API
 */
export const PaginationSchema = z.object({
  current_page: z.number(), // Current page number
  next_page: z.string().optional(), // URL for next page, if available
  previous_page: z.string().optional(), // URL for previous page, if available
  first_page: z.string(), // URL for first page
  last_page: z.string(), // URL for last page
  max_per_page: z.number(), // Maximum items per page
  total_items: z.number(), // Total number of items
  total_pages: z.number(), // Total number of pages
});

/**
 * Generic class for handling paginated list responses
 * @template T - Type of items in the list
 */
export class ListResponse<T> {
  data: T[]; // Array of items
  pagination: z.infer<typeof PaginationSchema>; // Pagination information
  code: number; // Response code

  constructor(
    data: T[],
    pagination: z.infer<typeof PaginationSchema>,
    code: number
  ) {
    this.data = data;
    this.pagination = pagination;
    this.code = code;
  }

  /**
   * Type guard to check if an object is a ListResponse instance
   * @param obj - Object to check
   * @returns Boolean indicating if object is ListResponse
   */
  static isListResponse(obj: any): obj is ListResponse<any> {
    return (
      obj instanceof ListResponse ||
      (obj &&
        Array.isArray(obj.data) &&
        obj.pagination &&
        typeof obj.code !== "undefined")
    );
  }

  /**
   * Converts the list response to a plain object
   * @returns Object containing data array, pagination info, and response code
   */
  toObject() {
    return {
      data: this.data,
      pagination: this.pagination,
      code: this.code
    };
  }
}

/**
 * Generic class for handling single item responses
 * @template T - Type of the data item
 */
export class DataResponse<T> {
  data: T; // Single item data
  code: number; // Response code

  constructor(data: T, code: number) {
    this.data = data;
    this.code = code;
  }

  /**
   * Type guard to check if an object is a DataResponse instance
   * @param obj - Object to check
   * @returns Boolean indicating if object is DataResponse
   */
  static isDataResponse(obj: any): obj is DataResponse<any> {
    return (
      obj instanceof DataResponse ||
      (obj && obj.code && obj.data && typeof obj.data !== "undefined")
    );
  }

  /**
   * Converts the data response to a plain object
   * @returns Object containing data and response code
   */
  toObject() {
    return {
      data: this.data,
      code: this.code
    };
  }
}

/**
 * Class for handling error responses from the API
 */
export class ErrorResponse {
  code: number; // Error code
  message: string; // Error message

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }

  /**
   * Type guard to check if an object is an ErrorResponse instance
   * @param obj - Object to check
   * @returns Boolean indicating if object is ErrorResponse
   */
  static isErrorResponse(obj: any): obj is ErrorResponse {
    return obj instanceof ErrorResponse || (obj && obj.code && obj.message);
  }
  /**
   * Converts the error response to a key-value object
   * @returns Object containing error code and message
   */
  toObject(): { code: number; message: string } {
    return {
      code: this.code,
      message: this.message
    };
  }
}

/**
 * Class for handling message responses from the API
 * Similar to ErrorResponse but can include additional data
 */
export class MessageResponse {
  code: number; // Response code
  message: string; // Response message
  data?: any; // Optional additional data

  constructor(code: number, message: string, data?: any) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  /**
   * Type guard to check if an object is a MessageResponse instance
   * @param obj - Object to check
   * @returns Boolean indicating if object is MessageResponse
   */
  static isMessageResponse(obj: any): obj is MessageResponse {
    return obj instanceof MessageResponse || (obj && obj.code && obj.message);
  }

  /**
   * Converts the message response to a plain object
   * @returns Object containing code, message and optional data
   */
  toObject() {
    return {
      code: this.code,
      message: this.message,
      data: this.data
    };
  }
}

/**
 * Type Definitions
 */
// Generic type for request body with specific data type
export type BodyClassic<T> = T;
// Type for HTTP headers
export type AppHeaders = Record<string, string>;
// Union type for list responses that can be either successful or error/message
export type ApiResponseList<T> =
  | ListResponse<T>
  | ErrorResponse
  | MessageResponse;
// Union type for single data responses that can be either successful or error/message
export type ApiResponseData<T> =
  | DataResponse<T>
  | ErrorResponse
  | MessageResponse;
