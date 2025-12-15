export interface StrapiData {
  id: number;
  [key: string]: any; // Allow for any additional fields
}

export interface StrapiResponse {
  data: StrapiData | StrapiData[];
}
