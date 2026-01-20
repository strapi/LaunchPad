// LocalRuntime.d.ts
export interface Memory {
  addMessage(
    role: string,
    content: string,
    type: string,
    memorized: boolean
  ): Promise<void>;
}

export interface ActionResult {
  status: "success" | "failure" | string; // Extended allowed values
  content?: string | any[]; // If content may be an array, also add
  error?: any;
  stderr?: any; // If there are additional properties, also add
}

export interface Action {
  type: string;
  params: Record<string, any>;
}

export interface DockerRuntime {
  memory: Memory;
  constructor(options?: { memory: Memory });
  handle_memory(result: ActionResult, action: Action): Promise<Memory>;
  execute_action(action: Action): Promise<ActionResult>;
  write_code(action: Action): Promise<ActionResult>;
  read_file(action: Action): Promise<ActionResult>;
}