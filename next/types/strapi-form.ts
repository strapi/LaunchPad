// types/strapi-form.ts

export interface StrapiFormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'number' | 'url';
  label: string;
  placeholder?: string;
  required: boolean;
  description?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  options?: Array<{
    value: string;
    label: string;
  }>;
  gridColumn?: string; // Pour la disposition en grille (ex: "span 1", "span 2")
}

export interface VtigerMapping {
  [formField: string]: string; // Mapping champ formulaire -> champ Vtiger
}

export interface StrapiFormConfig {
  id: number;
  documentId: string;
  formName: string;
  title: string;
  description?: string;
  submitButtonText: string;
  successMessage: string;
  errorMessage: string;
  vtigerEndpoint: string;
  vtigerModuleType: 'Leads' | 'Contacts';
  vtigerMapping: VtigerMapping;
  fields: StrapiFormField[];
  displayConfig?: {
    layout: 'single' | 'two-columns';
    containerClassName?: string;
    fieldsClassName?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;

}

export interface StrapiApiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}