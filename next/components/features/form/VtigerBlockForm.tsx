// components/VtigerBlockForm.tsx

"use client";
import { useState, useRef } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useVtiger } from "@/hooks/useVtiger";
import { StrapiFormField, VtigerMapping } from "@/types/strapi-form";
import { FieldRenderer } from "./utils-form/FieldRenderer";

interface VtigerBlockFormProps {
  title?: string;
  description?: string;
  fields: StrapiFormField[];
  submitButtonText?: string;
  successMessage?: string;
  errorMessage?: string;
  moduleType?: 'Leads' | 'Contacts';
  mapping?: VtigerMapping;
  containerClassName?: string;
  formClassName?: string;
  fieldsClassName?: string;
}

// Fonction pour construire le schéma Zod dynamiquement
function buildZodSchema(fields: StrapiFormField[]) {
  const schemaFields: any = {};

  fields.forEach((field) => {
    let fieldSchema: any;

    switch (field.type) {
      case 'email':
        fieldSchema = z.string().email('Email invalide');
        break;
      case 'url':
        fieldSchema = z.string().url('URL invalide').or(z.literal(''));
        break;
      case 'number':
        fieldSchema = z.number();
        if (field.validation?.min !== undefined) {
          fieldSchema = fieldSchema.min(field.validation.min);
        }
        if (field.validation?.max !== undefined) {
          fieldSchema = fieldSchema.max(field.validation.max);
        }
        break;
      case 'tel':
        fieldSchema = z.string();
        if (field.validation?.pattern) {
          fieldSchema = fieldSchema.regex(
            new RegExp(field.validation.pattern),
            'Format invalide'
          );
        }
        break;
      default:
        fieldSchema = z.string();
    }

    // Ajouter les validations de longueur
    if (field.validation?.minLength) {
      fieldSchema = fieldSchema.min(
        field.validation.minLength,
        `Minimum ${field.validation.minLength} caractères`
      );
    }
    if (field.validation?.maxLength) {
      fieldSchema = fieldSchema.max(
        field.validation.maxLength,
        `Maximum ${field.validation.maxLength} caractères`
      );
    }

    // Gérer les champs requis/optionnels
    if (!field.required) {
      fieldSchema = fieldSchema.optional().or(z.literal(''));
    }

    schemaFields[field.name] = fieldSchema;
  });

  return z.object(schemaFields);
}

export function VtigerBlockForm({
  title,
  description,
  fields,
  submitButtonText = "Envoyer",
  successMessage = "Formulaire envoyé avec succès !",
  errorMessage = "Erreur lors de l'envoi du formulaire",
  moduleType = 'Leads',
  mapping,
  containerClassName,
  formClassName,
  fieldsClassName,
}: VtigerBlockFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Construire le schéma dynamiquement
  const schema = buildZodSchema(fields);

  const form = useForm({
    resolver: zodResolver(schema) as any,
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = '';
      return acc;
    }, {} as any),
  });

  const { submit, isLoading } = useVtiger({
    moduleType,
    mapping,
    onSuccess: () => {
      toast.success(successMessage);
      form.reset();
    },
    onError: (error) => {
      toast.error(errorMessage, {
        description: error.message,
      });
    },
  });

  const scrollToFirstError = () => {
    const firstErrorField = Object.keys(form.formState.errors)[0];
    if (firstErrorField && scrollContainerRef.current) {
      const errorElement = scrollContainerRef.current.querySelector(
        `[name="${firstErrorField}"]`
      );
      if (errorElement) {
        errorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await submit(data);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setTimeout(scrollToFirstError, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("w-full", containerClassName)}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("space-y-6", formClassName)}
        >
          <div
            ref={scrollContainerRef}
            className={cn("space-y-4", fieldsClassName)}
          >
            {fields.map((field) => (
              <FieldRenderer
                key={field.name}
                field={{
                  ...field,
                  name: field.name as any,
                } as any}
                control={form.control}
              />
            ))}
          </div>

          <div className="flex items-center gap-4 pt-6 border-t">
            <Button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="min-w-[120px]"
              onClick={(e) => {
                const errors = form.formState.errors;
                if (Object.keys(errors).length > 0) {
                  Object.entries(errors).forEach(([key, error]) => {
                    if (error?.message) {
                      toast.error(`Erreur ${key}`, {
                        description: error.message.toString(),
                      });
                    }
                  });
                  setTimeout(scrollToFirstError, 100);
                }
              }}
            >
              {(isLoading || isSubmitting) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {submitButtonText}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}