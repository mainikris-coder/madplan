import {
  AppDatabase,
  WeekPlan,
  DayOfWeek,
  IngredientItem,
  AppSettings,
} from '../types/planner';
import { parseWeekId, getISOWeekDetails } from '../utils/dateUtils';
import { createEmptyWeek } from './storageService';

export interface ImportSummary {
  weekCount: number;
  weekIds: string[];
  totalMealsPlanned: number;
  totalCost: number;
  sourceType: 'full_database' | 'weeks_list' | 'single_week' | 'meals_list';
}

export interface ImportParseSuccess {
  success: true;
  db: AppDatabase;
  summary: ImportSummary;
}

export interface ImportParseFailure {
  success: false;
  error: string;
}

export type ImportParseResult = ImportParseSuccess | ImportParseFailure;

/**
 * Normalizes day string (e.g. "monday", "Mon", "Monday") into DayOfWeek.
 */
export function normalizeDayOfWeek(val: unknown): DayOfWeek | null {
  if (typeof val !== 'string') return null;
  const lower = val.trim().toLowerCase();
  const map: Record<string, DayOfWeek> = {
    monday: 'Monday',
    mon: 'Monday',
    tuesday: 'Tuesday',
    tue: 'Tuesday',
    tues: 'Tuesday',
    wednesday: 'Wednesday',
    wed: 'Wednesday',
    thursday: 'Thursday',
    thu: 'Thursday',
    thur: 'Thursday',
    thurs: 'Thursday',
    friday: 'Friday',
    fri: 'Friday',
    saturday: 'Saturday',
    sat: 'Saturday',
    sunday: 'Sunday',
    sun: 'Sunday',
  };
  return map[lower] || null;
}

/**
 * Normalizes a cost value (number, string like "$15.50", "15,50 kr", etc.).
 */
export function normalizeCost(val: unknown): number {
  if (typeof val === 'number') {
    return isNaN(val) ? 0 : Math.round(val * 100) / 100;
  }
  if (typeof val === 'string') {
    const cleaned = val.replace(/,/g, '.').replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
  }
  return 0;
}

/**
 * Normalizes ingredients (handles array of strings or array of objects).
 */
export function normalizeIngredients(val: unknown, mealId: string): IngredientItem[] {
  if (!Array.isArray(val)) return [];
  const results: IngredientItem[] = [];

  val.forEach((item, index) => {
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (trimmed) {
        results.push({
          id: `${mealId}-ing-${index + 1}`,
          name: trimmed,
          isPurchased: false,
        });
      }
    } else if (item && typeof item === 'object') {
      const raw = item as Record<string, unknown>;
      const name = typeof raw.name === 'string' ? raw.name.trim() : '';
      if (name) {
        results.push({
          id: typeof raw.id === 'string' && raw.id ? raw.id : `${mealId}-ing-${index + 1}`,
          name,
          isPurchased: Boolean(raw.isPurchased),
        });
      }
    }
  });

  return results;
}

/**
 * Parses and normalizes a single raw week object into a valid WeekPlan.
 */
export function normalizeWeekObject(
  rawWeek: unknown,
  fallbackYear: number,
  fallbackWeekNumber: number
): WeekPlan | null {
  if (!rawWeek || typeof rawWeek !== 'object') return null;

  const raw = rawWeek as Record<string, unknown>;
  let year = typeof raw.year === 'number' && raw.year > 2000 ? raw.year : fallbackYear;
  let weekNumber =
    typeof raw.weekNumber === 'number' && raw.weekNumber >= 1 && raw.weekNumber <= 53
      ? raw.weekNumber
      : fallbackWeekNumber;

  if (typeof raw.id === 'string') {
    if (raw.id.includes('-W')) {
      const parsed = parseWeekId(raw.id);
      year = parsed.year;
      weekNumber = parsed.weekNumber;
    } else {
      const match =
        raw.id.match(/week[-_](\d+)[-_](\d+)/i) || raw.id.match(/(\d+)[-_]week[-_](\d+)/i);
      if (match) {
        const num1 = parseInt(match[1], 10);
        const num2 = parseInt(match[2], 10);
        if (num1 > 1000) {
          year = num1;
          weekNumber = num2;
        } else {
          weekNumber = num1;
          year = num2;
        }
      }
    }
  }

  const baseWeek = createEmptyWeek(year, weekNumber);
  const weekId = baseWeek.id;

  if (Array.isArray(raw.meals)) {
    raw.meals.forEach((rawMeal) => {
      if (!rawMeal || typeof rawMeal !== 'object') return;
      const m = rawMeal as Record<string, unknown>;
      const day = normalizeDayOfWeek(m.day);
      if (!day) return;

      const existingIndex = baseWeek.meals.findIndex((meal) => meal.day === day);
      if (existingIndex >= 0) {
        const mealId = `${weekId}-${day.toLowerCase()}`;
        const course = typeof m.course === 'string' ? m.course.trim() : '';
        const cost = normalizeCost(m.cost);
        const ingredients = normalizeIngredients(m.ingredients, mealId);
        const notes = typeof m.notes === 'string' ? m.notes.trim() : undefined;

        baseWeek.meals[existingIndex] = {
          id: mealId,
          day,
          course,
          cost,
          ingredients,
          notes,
        };
      }
    });
  }

  const total = baseWeek.meals.reduce((sum, m) => sum + (Number(m.cost) || 0), 0);
  baseWeek.totalSpent = Math.round(total * 100) / 100;

  if (typeof raw.budgetGoal === 'number' && raw.budgetGoal > 0) {
    baseWeek.budgetGoal = raw.budgetGoal;
  }

  return baseWeek;
}

/**
 * Attempts to parse JSON string, with tolerant cleanup for common mobile text issues
 * (smart quotes, trailing commas).
 */
function tryParseJSON(str: string): unknown {
  try {
    return JSON.parse(str);
  } catch {
    // Sanitize curly/smart quotes
    let sanitized = str
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'");

    // Remove trailing commas before } or ]
    sanitized = sanitized.replace(/,\s*([}\]])/g, '$1');

    try {
      return JSON.parse(sanitized);
    } catch {
      return null;
    }
  }
}

/**
 * Extracts JSON content from raw input text that might include surrounding
 * messaging text, markdown code blocks, etc.
 */
export function extractJSONFromText(rawText: string): unknown {
  if (!rawText || typeof rawText !== 'string') return null;
  const trimmed = rawText.trim();
  if (!trimmed) return null;

  // 1. Direct parse attempt
  let parsed = tryParseJSON(trimmed);
  if (parsed) return parsed;

  // 2. Markdown code block: ```json ... ``` or ``` ... ```
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch) {
    parsed = tryParseJSON(codeBlockMatch[1].trim());
    if (parsed) return parsed;
  }

  // 3. Substring between first { and last }
  const firstCurly = trimmed.indexOf('{');
  const lastCurly = trimmed.lastIndexOf('}');
  if (firstCurly !== -1 && lastCurly > firstCurly) {
    parsed = tryParseJSON(trimmed.slice(firstCurly, lastCurly + 1));
    if (parsed) return parsed;
  }

  // 4. Substring between first [ and last ]
  const firstSquare = trimmed.indexOf('[');
  const lastSquare = trimmed.lastIndexOf(']');
  if (firstSquare !== -1 && lastSquare > firstSquare) {
    parsed = tryParseJSON(trimmed.slice(firstSquare, lastSquare + 1));
    if (parsed) return parsed;
  }

  return null;
}

/**
 * Main parser: takes arbitrary pasted text, extracts JSON, normalizes data into
 * standard AppDatabase format, and returns an informative summary.
 */
export function extractAndParseMealData(
  rawText: string,
  defaultWeekContext?: { year: number; weekNumber: number }
): ImportParseResult {
  const currentDetails = defaultWeekContext || getISOWeekDetails();
  const rawJSON = extractJSONFromText(rawText);

  if (!rawJSON || typeof rawJSON !== 'object') {
    return {
      success: false,
      error:
        'Could not find valid meal plan JSON in the pasted text. Please make sure the text includes meal plan data.',
    };
  }

  const normalizedWeeks: Record<string, WeekPlan> = {};
  let sourceType: ImportSummary['sourceType'] = 'full_database';
  let candidateSettings: AppSettings = {
    currencySymbol: 'kr.',
    currencyPosition: 'suffix',
    theme: 'system',
  };

  const rawObj = rawJSON as Record<string, unknown>;

  // Case 1: AppDatabase or object with "weeks" property
  if (rawObj.weeks) {
    if (rawObj.settings && typeof rawObj.settings === 'object') {
      const s = rawObj.settings as Record<string, unknown>;
      candidateSettings = {
        currencySymbol: typeof s.currencySymbol === 'string' ? s.currencySymbol : 'kr.',
        currencyPosition: s.currencyPosition === 'prefix' ? 'prefix' : 'suffix',
        theme: s.theme === 'dark' || s.theme === 'light' ? s.theme : 'system',
      };
    }

    if (Array.isArray(rawObj.weeks)) {
      sourceType = 'weeks_list';
      rawObj.weeks.forEach((w) => {
        const norm = normalizeWeekObject(w, currentDetails.year, currentDetails.weekNumber);
        if (norm) {
          normalizedWeeks[norm.id] = norm;
        }
      });
    } else if (typeof rawObj.weeks === 'object' && rawObj.weeks !== null) {
      sourceType = 'full_database';
      const weeksObj = rawObj.weeks as Record<string, unknown>;
      Object.keys(weeksObj).forEach((weekKey) => {
        const norm = normalizeWeekObject(
          weeksObj[weekKey],
          currentDetails.year,
          currentDetails.weekNumber
        );
        if (norm) {
          normalizedWeeks[norm.id] = norm;
        }
      });
    }
  } else if (Array.isArray(rawJSON)) {
    // Case 2: Array of items
    const firstItem = rawJSON[0];
    if (firstItem && typeof firstItem === 'object' && 'meals' in firstItem) {
      // Array of week objects
      sourceType = 'weeks_list';
      rawJSON.forEach((w) => {
        const norm = normalizeWeekObject(w, currentDetails.year, currentDetails.weekNumber);
        if (norm) {
          normalizedWeeks[norm.id] = norm;
        }
      });
    } else if (firstItem && typeof firstItem === 'object' && ('day' in firstItem || 'course' in firstItem)) {
      // Array of meals for current week
      sourceType = 'meals_list';
      const singleWeek = normalizeWeekObject(
        {
          year: currentDetails.year,
          weekNumber: currentDetails.weekNumber,
          meals: rawJSON,
        },
        currentDetails.year,
        currentDetails.weekNumber
      );
      if (singleWeek) {
        normalizedWeeks[singleWeek.id] = singleWeek;
      }
    }
  } else if (rawObj.meals && Array.isArray(rawObj.meals)) {
    // Case 3: Single week object
    sourceType = 'single_week';
    const singleWeek = normalizeWeekObject(
      rawObj,
      currentDetails.year,
      currentDetails.weekNumber
    );
    if (singleWeek) {
      normalizedWeeks[singleWeek.id] = singleWeek;
    }
  }

  const weekIds = Object.keys(normalizedWeeks);
  if (weekIds.length === 0) {
    return {
      success: false,
      error:
        'Found JSON, but it did not contain recognizable weeks or meal items. Expected fields like "weeks" or "meals".',
    };
  }

  // Calculate summary metrics
  let totalMealsPlanned = 0;
  let totalCost = 0;

  weekIds.forEach((id) => {
    const w = normalizedWeeks[id];
    totalCost += w.totalSpent;
    totalMealsPlanned += w.meals.filter((m) => m.course.trim().length > 0).length;
  });

  const preferredWeekId =
    typeof rawObj.currentWeekId === 'string' && normalizedWeeks[rawObj.currentWeekId]
      ? rawObj.currentWeekId
      : weekIds[0];

  const db: AppDatabase = {
    version: 1,
    currentWeekId: preferredWeekId,
    weeks: normalizedWeeks,
    settings: candidateSettings,
  };

  return {
    success: true,
    db,
    summary: {
      weekCount: weekIds.length,
      weekIds,
      totalMealsPlanned,
      totalCost: Math.round(totalCost * 100) / 100,
      sourceType,
    },
  };
}
