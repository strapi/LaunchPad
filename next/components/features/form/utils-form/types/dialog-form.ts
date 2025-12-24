// types/dialog-form.ts
import { z } from "zod";
import { ComponentProps } from "react";
import { FieldValues } from "react-hook-form";

export interface SelectDataOption {
  value: string | number;
  label: string;
}

// Types pour les différents types de champs
export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "select2"
  | "checkbox"
  | "date"
  | "switch"
  | "file";

// Configuration d'un champ
export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  // Pour les selects
  options?: SelectDataOption[];
  // Pour les inputs numériques
  min?: number;
  max?: number;
  step?: number;
  // Pour les textareas
  rows?: number;
  // Pour les fichiers
  accept?: string;
  multiple?: boolean;
  // Classes CSS personnalisées
  className?: string;
  // Validation personnalisée
  validate?: (value: any) => boolean | string;
}

// Type pour les propriétés du Dialog (remplace l'import inexistant)
export interface DialogProps extends ComponentProps<"div"> {
  modal?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Configuration du formulaire
export interface FormConfig<T extends FieldValues = FieldValues> {
  title: string;
  description?: string;
  serviceName: string;
  schema: z.ZodSchema<T>;
  fields: FieldConfig[];
  // Configuration du dialog
  dialogProps?: Partial<DialogProps>;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  // Classes CSS personnalisées
  customClass?: {
    containerFields?: React.HTMLAttributes<HTMLDivElement>["className"];
    containerForm?: React.HTMLAttributes<HTMLDivElement>["className"];
  };
  // Callbacks
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  // Données pour la modification
  //   initialData?: Partial<T>;
  initialData?: Partial<T>;
  mode?: "create" | "update";
  id?: string;
}

// Services API
export interface ApiServiceForm {
  createData: <T>(params: { serviceName: string; data: T }) => Promise<T>;
  updateData: <T>(params: {
    serviceName: string;
    data: T;
    id: string;
  }) => Promise<T>;
}

// Hook personnalisé pour les opérations CRUD
export interface CrudHookResult<T> {
  create: (data: T) => Promise<void>;
  update: (data: T, id: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}
