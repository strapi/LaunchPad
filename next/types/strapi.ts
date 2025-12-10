export interface StrapiData {
  id: number;
  [key: string]: any; // Allow for any additional fields
}

export interface StrapiResponse {
  data: StrapiData | StrapiData[];
}

export interface StrapiLocaleObject {
  id: number;
  documentId: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  isDefault: boolean;
}
