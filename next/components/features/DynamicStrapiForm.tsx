// components/DynamicStrapiForm.tsx

"use client";

import { VtigerBlockForm } from "./form/VtigerBlockForm";
import { StrapiFormConfig } from "@/types/strapi-form";
import { cn } from "@/lib/utils";

interface DynamicStrapiFormProps {
  formConfig: StrapiFormConfig;
  className?: string;
}

export function DynamicStrapiForm({ formConfig, className }: DynamicStrapiFormProps) {
  const config = formConfig.attributes;

  // Déterminer la classe de grille selon la configuration
  const getFieldsClassName = () => {
    if (config.displayConfig?.layout === 'two-columns') {
      return "grid grid-cols-1 md:grid-cols-2 gap-4";
    }
    return config.displayConfig?.fieldsClassName || "space-y-4";
  };

  return (
    <VtigerBlockForm
      title={config.title}
      description={config.description}
      fields={config.fields}
      submitButtonText={config.submitButtonText}
      successMessage={config.successMessage}
      errorMessage={config.errorMessage}
      moduleType={config.vtigerModuleType}
      mapping={config.vtigerMapping}
      containerClassName={cn(
        config.displayConfig?.containerClassName,
        className
      )}
      fieldsClassName={getFieldsClassName()}
    />
  );
}

// Fonction pour récupérer la configuration depuis Strapi
export async function getStrapiFormConfig(formName: string): Promise<StrapiFormConfig | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/form-configs?filters[formName][$eq]=${formName}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        next: { revalidate: 60 }, // Cache de 60 secondes
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch form config');
    }

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      return data.data[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching Strapi form config:', error);
    return null;
  }
}