import { AppDatabase, WeekPlan, MealEntry } from '../types/planner';

/**
 * Merges imported database with existing database intelligently.
 * 
 * Strategy:
 * - For each week, keeps the most recently updated version
 * - For conflicting meals (both sides modified), uses timestamp comparison
 * - Preserves ingredients and settings from both sides when appropriate
 * - Handles missing/null values gracefully
 */
export function mergeDataWithExisting(
  importedDb: AppDatabase,
  existingDb: AppDatabase
): AppDatabase {
  const merged: AppDatabase = {
    version: Math.max(importedDb.version, existingDb.version),
    currentWeekId: existingDb.currentWeekId, // Keep existing context
    weeks: { ...existingDb.weeks },
    settings: mergeSettings(importedDb.settings, existingDb.settings),
  };

  // Merge weeks
  Object.keys(importedDb.weeks).forEach((weekId) => {
    const importedWeek = importedDb.weeks[weekId];
    const existingWeek = merged.weeks[weekId];

    if (!existingWeek) {
      // Week doesn't exist locally, take imported week as-is
      merged.weeks[weekId] = importedWeek;
    } else {
      // Both sides have this week, merge intelligently
      merged.weeks[weekId] = mergeWeeks(importedWeek, existingWeek);
    }
  });

  return merged;
}

/**
 * Merges two week plans, keeping the most recent version for each meal.
 */
function mergeWeeks(importedWeek: WeekPlan, existingWeek: WeekPlan): WeekPlan {
  const importedTime = new Date(importedWeek.updatedAt).getTime();
  const existingTime = new Date(existingWeek.updatedAt).getTime();

  // If imported week is much newer (>1 hour), use it entirely
  if (importedTime > existingTime + 3600000) {
    return importedWeek;
  }

  // If existing week is much newer, keep it
  if (existingTime > importedTime + 3600000) {
    return existingWeek;
  }

  // Times are close, merge meals individually
  const mergedMeals = mergeMeals(importedWeek.meals, existingWeek.meals);

  return {
    id: existingWeek.id,
    weekNumber: existingWeek.weekNumber,
    year: existingWeek.year,
    meals: mergedMeals,
    totalSpent: recalculateTotal(mergedMeals),
    budgetGoal: importedWeek.budgetGoal ?? existingWeek.budgetGoal,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Merges meal arrays by day, keeping the most recently updated meal.
 */
function mergeMeals(importedMeals: MealEntry[], existingMeals: MealEntry[]): MealEntry[] {
  const mealMap = new Map<string, MealEntry>();

  // Add existing meals to map (indexed by day)
  existingMeals.forEach((meal) => {
    mealMap.set(meal.day, meal);
  });

  // Merge imported meals
  importedMeals.forEach((importedMeal) => {
    const existingMeal = mealMap.get(importedMeal.day);

    if (!existingMeal) {
      // No conflict, add imported meal
      mealMap.set(importedMeal.day, importedMeal);
    } else {
      // Both have a meal for this day, pick the newer one
      const merged = mergeMealEntry(importedMeal, existingMeal);
      mealMap.set(importedMeal.day, merged);
    }
  });

  // Return meals in consistent day order
  const dayOrder = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  return dayOrder
    .map((day) => mealMap.get(day))
    .filter((meal): meal is MealEntry => meal !== undefined);
}

/**
 * Merges two meal entries for the same day.
 * Keeps the more recently modified version.
 */
function mergeMealEntry(importedMeal: MealEntry, existingMeal: MealEntry): MealEntry {
  // If one meal is empty/placeholder and the other isn't, prefer the non-empty one
  const importedIsEmpty = !importedMeal.course || importedMeal.cost === 0;
  const existingIsEmpty = !existingMeal.course || existingMeal.cost === 0;

  if (importedIsEmpty && !existingIsEmpty) {
    return existingMeal;
  }
  if (!importedIsEmpty && existingIsEmpty) {
    return importedMeal;
  }

  // Both have content, merge intelligently
  const merged: MealEntry = {
    id: existingMeal.id, // Keep existing ID
    day: existingMeal.day,
    course: importedMeal.course || existingMeal.course,
    cost: importedMeal.cost !== 0 ? importedMeal.cost : existingMeal.cost,
    ingredients: mergeIngredients(importedMeal.ingredients, existingMeal.ingredients),
    notes: importedMeal.notes || existingMeal.notes,
  };

  return merged;
}

/**
 * Merges ingredient lists intelligently.
 * Combines ingredients from both sides, preferring purchased status from existing.
 */
function mergeIngredients(
  importedIngredients: Array<{ id: string; name: string; isPurchased?: boolean }>,
  existingIngredients: Array<{ id: string; name: string; isPurchased?: boolean }>
): Array<{ id: string; name: string; isPurchased?: boolean }> {
  const ingredientMap = new Map<string, { id: string; name: string; isPurchased?: boolean }>();

  // Add existing ingredients (prioritize purchased status from existing)
  existingIngredients.forEach((ing) => {
    ingredientMap.set(ing.name.toLowerCase(), ing);
  });

  // Merge imported ingredients
  importedIngredients.forEach((importedIng) => {
    const key = importedIng.name.toLowerCase();
    const existing = ingredientMap.get(key);

    if (!existing) {
      // New ingredient from imported
      ingredientMap.set(key, importedIng);
    } else {
      // Ingredient exists in both, keep existing's purchased status
      // (local user's shopping progress is more important)
      ingredientMap.set(key, {
        ...importedIng,
        isPurchased: existing.isPurchased ?? importedIng.isPurchased,
      });
    }
  });

  return Array.from(ingredientMap.values());
}

/**
 * Merges settings, preferring imported settings if defined.
 */
function mergeSettings(
  importedSettings: any,
  existingSettings: any
): { currencySymbol: string; currencyPosition: 'prefix' | 'suffix'; theme: 'light' | 'dark' | 'system' } {
  return {
    currencySymbol: importedSettings?.currencySymbol ?? existingSettings?.currencySymbol ?? '$',
    currencyPosition:
      importedSettings?.currencyPosition ?? existingSettings?.currencyPosition ?? 'prefix',
    theme: importedSettings?.theme ?? existingSettings?.theme ?? 'system',
  };
}

/**
 * Recalculates total spent from meals.
 */
function recalculateTotal(meals: MealEntry[]): number {
  const total = meals.reduce((sum, meal) => sum + (Number(meal.cost) || 0), 0);
  return Math.round(total * 100) / 100;
}
