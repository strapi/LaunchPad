import type { StrapiResponse } from '@/types/data-source';

export const fetchStrapiData = async <T = any>(
  url: string
): Promise<T[]> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
  }

  const result: StrapiResponse<T> = await response.json();
  return result.data || [];
};