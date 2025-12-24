"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useState, useCallback } from "react";
import { FieldConfig } from "../types/dialog-form";
import { X, Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Hook personnalisé pour gérer l'état d'un select2
const useSelect2State = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, setIsOpen, toggle, open, close };
};

// Composant Select2 séparé pour une meilleure organisation
interface Select2Props {
  field: FieldConfig;
  fieldProps: any;
}

export const Select2Field = ({ field, fieldProps }: Select2Props) => {
  const { isOpen, setIsOpen } = useSelect2State();

  const selectedValues = fieldProps.value || [];
  const selectedOptions =
    field.options?.filter((option) => selectedValues.includes(option.value)) ||
    [];

  // Déterminer la limite de sélection
  const getSelectionLimit = () => {
    if (field.multiple === true) {
      return Infinity; // Pas de limite si multiple est explicitement true
    }
    if (field.max !== undefined) {
      return field.max; // Utiliser la limite max si fournie
    }
    return 1; // Limite par défaut à 1
  };

  const selectionLimit = getSelectionLimit();

  const handleSelect = (optionValue: string | number) => {
    const currentValues = fieldProps.value || [];
    let newValues;

    if (currentValues.includes(optionValue)) {
      // Désélectionner l'option
      newValues = currentValues.filter((value: any) => value !== optionValue);
    } else {
      // Sélectionner l'option
      if (selectionLimit === 1) {
        // Mode single : remplacer la sélection
        newValues = [optionValue];
      } else if (currentValues.length < selectionLimit) {
        // Mode multiple avec limite : ajouter si sous la limite
        newValues = [...currentValues, optionValue];
      } else {
        // Limite atteinte, ne pas ajouter
        return;
      }
    }

    fieldProps.onChange(newValues);

    // Fermer le popover en mode single après sélection
    if (selectionLimit === 1 && !currentValues.includes(optionValue)) {
      setIsOpen(false);
    }
  };

  const handleRemove = (optionValue: string | number) => {
    const currentValues = fieldProps.value || [];
    const newValues = currentValues.filter(
      (value: any) => value !== optionValue
    );
    fieldProps.onChange(newValues);
  };

  // Vérifier si une option peut être sélectionnée
  const canSelectOption = (optionValue: string | number) => {
    const currentValues = fieldProps.value || [];
    return (
      currentValues.includes(optionValue) ||
      currentValues.length < selectionLimit
    );
  };

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={cn(
              "w-full justify-between min-h-10 h-auto",
              field.className
            )}
            disabled={field.disabled}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="text-xs"
                  >
                    {option.label}
                    {/* Afficher le X seulement en mode multiple ou si max > 1 */}
                    {selectionLimit !== 1 && (
                      <X
                        className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(option.value);
                        }}
                      />
                    )}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">
                  {field.placeholder || "Sélectionner des options..."}
                </span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Rechercher..." className="h-9" />
            <CommandEmpty>Aucune option trouvée.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {field.options?.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  const canSelect = canSelectOption(option.value);

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSelect(option.value)}
                      className={cn(
                        "cursor-pointer",
                        !canSelect &&
                          !isSelected &&
                          "opacity-50 cursor-not-allowed"
                      )}
                      disabled={!canSelect && !isSelected}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Affichage des sélections sous forme de badges séparées (optionnel) */}
      {selectedOptions.length > 0 && selectionLimit !== 1 && (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => (
            <Badge key={option.value} variant="outline" className="text-xs">
              {option.label}
              <X
                className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => handleRemove(option.value)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Indicateur de limite atteinte */}
      {selectionLimit !== Infinity && selectionLimit > 1 && (
        <div className="text-xs text-muted-foreground">
          {selectedValues.length}/{selectionLimit} sélectionné
          {selectedValues.length > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};
