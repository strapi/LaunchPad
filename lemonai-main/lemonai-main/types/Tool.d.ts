/**
 * Describes a single parameter for a tool.
 * Follows a subset of JSON Schema principles.
 */
export interface ToolParameter {
  type: "string" | "number" | "boolean" | "integer" | "array" | "object"; // Data type
  description: string; // Description for the LLM to understand the parameter
  items?: ToolParameter; // If type is 'array', describes the items in the array
  properties?: { [key: string]: ToolParameter }; // If type is 'object', describes the properties
  required?: string[]; // If type is 'object', lists required properties within it
  enum?: (string | number | boolean)[]; // Optional list of allowed values
}

/**
 * Defines the schema for the parameters object required by the tool's execute function.
 */
export interface ToolParameters {
  type: "object";
  properties: {
    [key: string]: ToolParameter; // Map parameter names to their definitions
  };
  required?: string[]; // List of parameter names that are mandatory
}

import { ActionResult } from "types/LocalRuntime";

/**
 * Represents an executable tool that the LLM Agent can use.
 */
export interface Tool {
  /**
   * A unique, descriptive name for the tool (used by the LLM to identify it).
   * Conventionally uses snake_case or camelCase.
   */
  name: string;

  /**
   * A detailed description of what the tool does, when it should be used,
   * and what kind of output it provides. Crucial for the LLM's planning.
   */
  description: string;

  /**
   * A JSON Schema-like definition of the parameters the tool's `execute` function expects.
   * This helps the LLM generate the correct arguments.
   */
  params: ToolParameters;

  /**
   * Indicates whether the tool's output should be included in the task memory
   * Useful for tools that provide contextual information that can be used for future tasks.
   */
  memorized?: boolean;

  /**
   * A function that generates a description of the tool's action based on the provided arguments.
   */
  getActionDescription?: (args: Record<string, any>) => Promise<string>;

  /**
   * The asynchronous function that performs the tool's action.
   * @param args - An object containing the arguments extracted by the LLM, matching the `parameters` schema.
   * @returns A Promise resolving to a string result that the LLM can understand and use.
   *          Should handle potential errors internally or throw errors that the agent can catch.
   */
  execute: (
    args: Record<string, any>,
    uuid: string,
    context: any
  ) => Promise<ActionResult>;
}
