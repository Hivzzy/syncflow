import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines Tailwind CSS classes with clsx and twMerge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns initials from a full name (e.g., "Habbanma" -> "H", "John Doe" -> "JD")
 */
export function getAvatarInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Priority meta information helper (Labels, colors, badges)
 */
export function getPriorityMeta(priority: number): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  switch (priority) {
    case 1: // Urgent
      return { label: 'Urgent', color: '#ef4444', bgColor: 'bg-red-950/60', borderColor: 'border-red-800/50' };
    case 2: // High
      return { label: 'High', color: '#f97316', bgColor: 'bg-orange-950/60', borderColor: 'border-orange-800/50' };
    case 3: // Medium
      return { label: 'Medium', color: '#f59e0b', bgColor: 'bg-amber-950/60', borderColor: 'border-amber-800/50' };
    case 4: // Low
      return { label: 'Low', color: '#3b82f6', bgColor: 'bg-blue-950/60', borderColor: 'border-blue-800/50' };
    case 0: // None
    default:
      return { label: 'No Priority', color: '#94a3b8', bgColor: 'bg-slate-900', borderColor: 'border-slate-800' };
  }
}
