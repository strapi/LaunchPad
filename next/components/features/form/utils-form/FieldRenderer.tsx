"use client";
// ./FieldRenderer.tsx
import { Control, FieldValues, FieldPath } from "react-hook-form";
import { FieldConfig } from "./types/dialog-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UploadIcon,  } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select2Field } from "./components/select2";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface FieldRendererProps<T extends FieldValues> {
  field: FieldConfig;
  control: Control<T>;
}

export function FieldRenderer<T extends FieldValues>({
  field,
  control,
}: FieldRendererProps<T>) {
  const renderField = (fieldProps: any) => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
        return (
          <Input
            {...fieldProps}
            type={field.type}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={field.className}
          />
        );

      case "number":
        return (
          <Input
            {...fieldProps}
            type="number"
            placeholder={field.placeholder}
            disabled={field.disabled}
            min={field.min}
            max={field.max}
            step={field.step}
            className={field.className}
            onChange={(e) => {
              const value = e.target.value;
              fieldProps.onChange(value === "" ? undefined : Number(value));
            }}
          />
        );

      case "textarea":
        return (
          <Textarea
            {...fieldProps}
            placeholder={field.placeholder}
            disabled={field.disabled}
            rows={field.rows}
            className={field.className}
          />
        );

      case "select":
        return (
          <Select
            onValueChange={fieldProps.onChange}
            value={fieldProps.value || ""}
            disabled={field.disabled}
          >
            <SelectTrigger className={field.className}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "select2":
        return <Select2Field field={field} fieldProps={fieldProps} />;

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={fieldProps.value || false}
              onCheckedChange={fieldProps.onChange}
              disabled={field.disabled}
              className={field.className}
            />
            <span className="text-sm">{field.label}</span>
          </div>
        );

      case "switch":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={fieldProps.value || false}
              onCheckedChange={fieldProps.onChange}
              disabled={field.disabled}
              className={field.className}
            />
            <span className="text-sm">{field.label}</span>
          </div>
        );

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !fieldProps.value && "text-muted-foreground",
                  field.className
                )}
                disabled={field.disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fieldProps.value ? (
                  format(fieldProps.value, "PPP", { locale: fr })
                ) : (
                  <span>{field.placeholder || "Sélectionner une date"}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fieldProps.value}
                onSelect={fieldProps.onChange}
                disabled={field.disabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case "file":
        return (
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept={field.accept}
              multiple={field.multiple}
              disabled={field.disabled}
              className={field.className}
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  fieldProps.onChange(
                    field.multiple ? Array.from(files) : files[0]
                  );
                }
              }}
            />
            <UploadIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        );

      default:
        return (
          <Input
            {...fieldProps}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={field.className}
          />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={field.name as FieldPath<T>}
      render={({ field: fieldProps }) => (
        <FormItem>
          {field.type !== "checkbox" && field.type !== "switch" && (
            <FormLabel>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FormLabel>
          )}
          <FormControl>{renderField(fieldProps)}</FormControl>
          {field.description && (
            <FormDescription>{field.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
