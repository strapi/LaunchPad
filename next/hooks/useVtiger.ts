// hooks/useVtiger.ts

import { useState } from 'react';
import { VtigerMapping } from '@/types/strapi-form';

interface UseVtigerOptions {
  moduleType?: 'Leads' | 'Contacts';
  mapping?: VtigerMapping;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useVtiger(options: UseVtigerOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (formData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/vtiger-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          moduleType: options.moduleType || 'Leads',
          mapping: options.mapping,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la soumission');
      }

      options.onSuccess?.(result.data);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id: string, formData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/vtiger-contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          formData,
          mapping: options.mapping,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la mise à jour');
      }

      options.onSuccess?.(result.data);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submit,
    update,
    isLoading,
    error,
  };
}