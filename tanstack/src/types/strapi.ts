export interface StrapiData {
  id: number;
  [key: string]: any;
}

export interface StrapiResponse {
  data: StrapiData | Array<StrapiData>;
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
