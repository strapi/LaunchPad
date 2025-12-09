// ./BlockForm.tsx

"use client";
import { useState, useEffect, useRef } from "react";
import {
  useForm,
  FieldValues,
  SubmitHandler,
  DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormConfig } from "./types/dialog-form";
import { useCrud } from "./hooks/useCrud";
import {
  validateAndTransformData,
} from "./utils/dialog-form-utils";
import { FieldRenderer } from "./FieldRenderer";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { isDevDebug } from "@/lib/utils/constantes";
import { toast } from "sonner";
import { z } from "zod";

interface BlockFormProps<T extends FieldValues = FieldValues> {
  config: Omit<FormConfig<T>, 'dialogProps'>;
  onCancel?: () => void;
  showCancelButton?: boolean;
  containerClassName?: string;
  formClassName?: string;
  fieldsClassName?: string;
  footerClassName?: string;
}

export function BlockForm<T extends FieldValues = FieldValues>({
  config,
  onCancel,
  showCancelButton = false,
  containerClassName,
  formClassName,
  fieldsClassName,
  footerClassName,
}: BlockFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const defaultValues: DefaultValues<T> = (config.initialData ||
    {}) as DefaultValues<T>;

  // FIX: Cast explicite du resolver pour résoudre le problème de typage
  const form = useForm<T>({
    resolver: zodResolver(config.schema as z.ZodType<T, any, any>),
    defaultValues,
  });

  const { create, update, isLoading } = useCrud<T>({
    serviceName: config.serviceName,
    onSuccess: (data) => {
      config.onSuccess?.(data);
      form.reset();
    },
    onError: config.onError,
    invalidateQueries: [config.serviceName],
  });

  // Réinitialiser le formulaire quand les données initiales changent
  useEffect(() => {
    if (config.initialData) {
      form.reset(config.initialData as DefaultValues<T>);
    }
  }, [config.initialData, form]);

  // Fonction pour scroller vers le premier champ en erreur
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

  const onSubmit: SubmitHandler<T> = async (data: T) => {
    try {
      setIsSubmitting(true);

      // Validation et transformation des données
      const validatedData = validateAndTransformData(
        data,
        config.schema,
        config.fields
      );

      console.log("Données validées:", validatedData);

      if (config.mode === "update" && config.id) {
        await update(validatedData, config.id);
      } else {
        await create(validatedData);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      config.onError?.(error as Error);
      setTimeout(scrollToFirstError, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading && !isSubmitting) {
      form.reset();
      onCancel?.();
    }
  };

  return (
    <div className={cn("w-full", containerClassName)}>
      {/* Header optionnel */}
      {(config.title || config.description) && (
        <div className="mb-6">
          {config.title && (
            <h2 className="text-2xl font-bold tracking-tight">
              {config.title}
            </h2>
          )}
          {config.description && (
            <p className="text-muted-foreground mt-2">
              {config.description}
            </p>
          )}
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "space-y-6",
            config.customClass?.containerForm,
            formClassName
          )}
        >
          {/* Conteneur des champs */}
          <div
            ref={scrollContainerRef}
            className={cn(
              "space-y-4",
              config.customClass?.containerFields,
              fieldsClassName
            )}
          >
            {config.fields.map((field) => (
              <FieldRenderer<T>
                key={field.name}
                field={field}
                control={form.control}
              />
            ))}
          </div>

          {/* Footer avec boutons */}
          <div className={cn(
            "flex items-center gap-4 pt-6 border-t",
            footerClassName
          )}>
            {showCancelButton && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading || isSubmitting}
              >
                Annuler
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="min-w-[120px]"
              onClick={(e) => {
                const errors = form.formState.errors;
                if (isDevDebug) {
                  console.log("=== CLICK SUBMIT ===");
                  console.log("Form errors:", form.formState.errors);
                  console.log("Form values:", form.getValues());
                }

                if (Object.keys(errors).length > 0) {
                  for (var key in errors) {
                    const elt = errors[key];
                    if (elt?.message) {
                      toast.error("Erreur " + key, {
                        description: elt.message.toString(),
                      });
                    }
                  }
                  setTimeout(scrollToFirstError, 100);
                }
              }}
            >
              {(isLoading || isSubmitting) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {config.mode === "update" ? "Mettre à jour" : "Envoyer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}