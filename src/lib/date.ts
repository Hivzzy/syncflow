import { format, formatDistanceToNow, isPast, isToday, isTomorrow, parseISO } from 'date-fns';

/**
 * Format relative time (e.g., "5 minutes ago", "2 days ago")
 */
export function formatRelativeTime(dateStringOrDate: string | Date | null | undefined): string {
  if (!dateStringOrDate) return '-';
  const date = typeof dateStringOrDate === 'string' ? parseISO(dateStringOrDate) : dateStringOrDate;
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format standard date (e.g., "Aug 24, 2026")
 */
export function formatStandardDate(dateStringOrDate: string | Date | null | undefined): string {
  if (!dateStringOrDate) return '-';
  const date = typeof dateStringOrDate === 'string' ? parseISO(dateStringOrDate) : dateStringOrDate;
  return format(date, 'MMM d, yyyy');
}

/**
 * Format due date with status flags
 */
export function formatDueDate(dateStringOrDate: string | Date | null | undefined): {
  formatted: string;
  isOverdue: boolean;
  isToday: boolean;
  isTomorrow: boolean;
} {
  if (!dateStringOrDate) {
    return { formatted: 'No due date', isOverdue: false, isToday: false, isTomorrow: false };
  }

  const date = typeof dateStringOrDate === 'string' ? parseISO(dateStringOrDate) : dateStringOrDate;
  const today = isToday(date);
  const tomorrow = isTomorrow(date);
  const overdue = isPast(date) && !today;

  let formatted = format(date, 'MMM d');
  if (today) formatted = 'Today';
  if (tomorrow) formatted = 'Tomorrow';

  return {
    formatted,
    isOverdue: overdue,
    isToday: today,
    isTomorrow: tomorrow,
  };
}
