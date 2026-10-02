import { DayOfWeek, DAYS_OF_WEEK } from '../types/planner';

/**
 * Calculates the ISO 8601 week number and ISO year for a given date.
 */
export function getISOWeekDetails(date: Date = new Date()): { year: number; weekNumber: number } {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  target.setDate(target.getDate() - dayNr + 3); // Thursday of this week defines ISO year
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  const weekNumber = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  const year = new Date(firstThursday).getFullYear();
  return { year, weekNumber };
}

/**
 * Returns the total number of ISO weeks in a given year (52 or 53).
 */
export function getWeeksInYear(year: number): number {
  const dec28 = new Date(year, 11, 28);
  return getISOWeekDetails(dec28).weekNumber;
}

/**
 * Returns the Date object representing Monday of the specified ISO week.
 */
export function getMondayOfWeek(year: number, weekNumber: number): Date {
  const jan4 = new Date(year, 0, 4);
  const day = (jan4.getDay() + 6) % 7;
  const mondayWeek1 = new Date(year, 0, 4 - day);
  const targetMonday = new Date(mondayWeek1);
  targetMonday.setDate(mondayWeek1.getDate() + (weekNumber - 1) * 7);
  return targetMonday;
}

/**
 * Formats a year and week number into a standard identifier (e.g. "2026-W40").
 */
export function formatWeekId(year: number, weekNumber: number): string {
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

/**
 * Parses an ID (e.g. "2026-W40") into year and weekNumber.
 */
export function parseWeekId(weekId: string): { year: number; weekNumber: number } {
  const parts = weekId.split('-W');
  if (parts.length === 2) {
    const year = parseInt(parts[0], 10);
    const weekNumber = parseInt(parts[1], 10);
    if (!isNaN(year) && !isNaN(weekNumber)) {
      return { year, weekNumber };
    }
  }
  return getISOWeekDetails();
}

/**
 * Returns the previous week, accounting for year boundaries.
 */
export function getPreviousWeek(year: number, weekNumber: number): { year: number; weekNumber: number } {
  if (weekNumber > 1) {
    return { year, weekNumber: weekNumber - 1 };
  }
  const prevYear = year - 1;
  return { year: prevYear, weekNumber: getWeeksInYear(prevYear) };
}

/**
 * Returns the next week, accounting for year boundaries.
 */
export function getNextWeek(year: number, weekNumber: number): { year: number; weekNumber: number } {
  const maxWeeks = getWeeksInYear(year);
  if (weekNumber < maxWeeks) {
    return { year, weekNumber: weekNumber + 1 };
  }
  return { year: year + 1, weekNumber: 1 };
}

/**
 * Formats the date range for the week (e.g. "Sep 28 – Oct 4").
 */
export function formatWeekDateRange(year: number, weekNumber: number): string {
  const monday = getMondayOfWeek(year, weekNumber);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const monMonth = monday.toLocaleString('en-US', { month: 'short' });
  const sunMonth = sunday.toLocaleString('en-US', { month: 'short' });

  if (monMonth === sunMonth) {
    return `${monMonth} ${monday.getDate()} – ${sunday.getDate()}`;
  }
  return `${monMonth} ${monday.getDate()} – ${sunMonth} ${sunday.getDate()}`;
}

/**
 * Returns the date label for a specific day of the week (e.g. "Oct 2").
 */
export function getDateLabelForDay(year: number, weekNumber: number, day: DayOfWeek): string {
  const dayIndex = DAYS_OF_WEEK.indexOf(day);
  const monday = getMondayOfWeek(year, weekNumber);
  const targetDate = new Date(monday);
  targetDate.setDate(monday.getDate() + (dayIndex >= 0 ? dayIndex : 0));
  return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
