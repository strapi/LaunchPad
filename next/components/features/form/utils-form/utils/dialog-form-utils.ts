// utils/dialog-form-utils.ts

import { FieldValues } from "react-hook-form";
import { FieldConfig, FormConfig } from "../types/dialog-form";
import { z } from "zod";

// Générateur automatique de champs basé sur un schéma Zod
export function generateFieldsFromSchema<T>(
  schema: z.ZodSchema<T>,
  customFields?: Partial<Record<keyof T, Partial<FieldConfig>>>
): FieldConfig[] {
  const fields: FieldConfig[] = [];

  // Cette fonction est un exemple - vous devrez l'adapter selon votre schéma
  // En réalité, extraire les champs d'un schéma Zod est complexe
  // Je recommande de définir les champs manuellement ou d'utiliser une bibliothèque comme zod-to-json-schema

  return fields;
}

// Utilitaire pour créer rapidement une configuration de formulaire
export function createFormConfig<T extends FieldValues = FieldValues>(
  config: Omit<FormConfig<T>, "mode"> & { mode?: "create" | "update" }
): FormConfig<T> {
  return {
    mode: "create",
    ...config,
  };
}

// Utilitaire pour valider et transformer les données avant soumission
export function validateAndTransformData<T>(
  data: any,
  schema: z.ZodSchema<T>,
  fields: FieldConfig[]
): T {
  // Transformation des données selon le type de champ
  const transformedData = { ...data };

  fields.forEach((field) => {
    const value = transformedData[field.name];

    switch (field.type) {
      case "number":
        if (value !== undefined && value !== "" && value !== null) {
          transformedData[field.name] = Number(value);
        }
        break;
      case "checkbox":
      case "switch":
        transformedData[field.name] = Boolean(value);
        break;
      case "date":
        if (value && value instanceof Date) {
          transformedData[field.name] = value;
        } else if (value) {
          transformedData[field.name] = new Date(value);
        }
        break;
      case "file":
        // Gestion des fichiers - ne pas transformer
        break;
      default:
        // Pour les autres types, garder la valeur telle quelle
        break;
    }
  });

  return schema.parse(transformedData);
}

// Utilitaire pour obtenir les classes CSS du dialog selon la taille
export function getDialogClasses(
  size: FormConfig["size"] = "md",
  customClass: string = ""
): string {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  return `${sizeClasses[size] || sizeClasses.md} ${customClass}`;
}

// Utilitaire pour créer des champs communs
export const commonFields = {
  text: (
    name: string,
    label: string,
    options?: Partial<FieldConfig>
  ): FieldConfig => ({
    name,
    label,
    type: "text",
    required: false,
    ...options,
  }),

  email: (
    name: string,
    label: string,
    options?: Partial<FieldConfig>
  ): FieldConfig => ({
    name,
    label,
    type: "email",
    required: false,
    ...options,
  }),

  password: (
    name: string,
    label: string,
    options?: Partial<FieldConfig>
  ): FieldConfig => ({
    name,
    label,
    type: "password",
    required: false,
    ...options,
  }),

  select: (
    name: string,
    label: string,
    options: Array<{ value: string; label: string }>,
    config?: Partial<FieldConfig>
  ): FieldConfig => ({
    name,
    label,
    type: "select",
    options,
    required: false,
    ...config,
  }),

  textarea: (
    name: string,
    label: string,
    rows = 3,
    options?: Partial<FieldConfig>
  ): FieldConfig => ({
    name,
    label,
    type: "textarea",
    rows,
    required: false,
    ...options,
  }),

  number: (
    name: string,
    label: string,
    options?: Partial<FieldConfig>
  ): FieldConfig => ({
    name,
    label,
    type: "number",
    required: false,
    ...options,
  }),

  checkbox: (
    name: string,
    label: string,
    options?: Partial<FieldConfig>
  ): FieldConfig => ({
    name,
    label,
    type: "checkbox",
    required: false,
    ...options,
  }),

  switch: (
    name: string,
    label: string,
    options?: Partial<FieldConfig>
  ): FieldConfig => ({
    name,
    label,
    type: "switch",
    required: false,
    ...options,
  }),

  date: (
    name: string,
    label: string,
    options?: Partial<FieldConfig>
  ): FieldConfig => ({
    name,
    label,
    type: "date",
    required: false,
    ...options,
  }),

  file: (
    name: string,
    label: string,
    accept?: string,
    options?: Partial<FieldConfig>
  ): FieldConfig => ({
    name,
    label,
    type: "file",
    accept,
    required: false,
    ...options,
  }),
};
