/** Small shared helpers used across the client. */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitCommaSeparated(text: string): string[] {
  return text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function jsonToText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
