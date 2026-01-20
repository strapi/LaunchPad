// LocalRuntime.d.ts
export interface Memory {
  addMessage(
    role: string,
    content: string,
    type: string,
    memorized: boolean,
    meta: any
  ): Promise<void>;
}

export interface ActionResult {
  uuid?: string;
  status: "success" | "failure" | string; // Extended allowed values
  content: string; // Text content
  error?: any;
  stderr?: any; // Additional properties can be added if needed
  memorized?: boolean; // Whether the result is memorized
  meta?: any; // Extended properties
}

export interface Action {
  type: string;
  params: Record<string, any>;
}

export interface LocalRuntime {
  memory: Memory;
  constructor(options?: { memory: Memory });
  handle_memory(result: ActionResult, action: Action): Promise<Memory>;
  execute_action(action: Action): Promise<ActionResult>;
  write_code(action: Action): Promise<ActionResult>;
  read_file(action: Action): Promise<ActionResult>;
}
