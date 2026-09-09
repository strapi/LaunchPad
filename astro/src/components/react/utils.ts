import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Class merger used by the copied Next components.
 *
 * The Next original also exports Strapi and formatting helpers; only `cn` is
 * reachable from the features island, so the rest is deliberately not carried
 * over.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
