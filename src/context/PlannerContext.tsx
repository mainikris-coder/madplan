import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  AppDatabase,
  WeekPlan,
  MealEntry,
  DayOfWeek,
  AppSettings,
  NavigationTab,
} from '../types/planner';
import {
  loadDatabase,
  saveDatabase,
  createEmptyWeek,
  recalculateWeekTotal,
  resetToDemoData,
  exportDatabaseJSON,
} from '../services/storageService';
import { extractAndParseMealData, ImportSummary } from '../services/importParser';
import { mergeDataWithExisting } from '../services/mergeService';
import {
  formatWeekId,
  parseWeekId,
  getPreviousWeek,
  getNextWeek,
  getISOWeekDetails,
} from '../utils/dateUtils';

interface PlannerContextType {
  database: AppDatabase;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedWeekId: string;
  selectedWeek: WeekPlan;
  settings: AppSettings;
  allWeeks: WeekPlan[];
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  goToCurrentWeek: () => void;
  selectWeek: (weekId: string) => void;
  saveMeal: (meal: MealEntry) => void;
  clearMeal: (day: DayOfWeek) => void;
  copyCurrentWeekToNext: () => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetData: () => void;
  exportData: () => string;
  importData: (
    jsonStr: string,
    mode?: 'merge' | 'replace'
  ) => { success: boolean; error?: string; summary?: ImportSummary };
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [database, setDatabase] = useState<AppDatabase>(() => loadDatabase());
  const [activeTab, setActiveTab] = useState<NavigationTab>('planner');

  // Resolve current real-world week
  const realCurrent = useMemo(() => getISOWeekDetails(), []);
  const initialWeekId = database.currentWeekId || formatWeekId(realCurrent.year, realCurrent.weekNumber);
  const [selectedWeekId, setSelectedWeekId] = useState<string>(initialWeekId);

  // Keep localStorage synchronized whenever database changes
  useEffect(() => {
    saveDatabase(database);
  }, [database]);

  // Retrieve or lazy-initialize the selected week plan
  const selectedWeek = useMemo(() => {
    if (database.weeks[selectedWeekId]) {
      return database.weeks[selectedWeekId];
    }
    const { year, weekNumber } = parseWeekId(selectedWeekId);
    return createEmptyWeek(year, weekNumber);
  }, [database.weeks, selectedWeekId]);

  // Sorted list of all recorded weeks
  const allWeeks = useMemo(() => {
    return Object.values(database.weeks).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.weekNumber - b.weekNumber;
    });
  }, [database.weeks]);

  // Navigate to previous week
  const goToPreviousWeek = useCallback(() => {
    const { year, weekNumber } = parseWeekId(selectedWeekId);
    const prev = getPreviousWeek(year, weekNumber);
    const prevId = formatWeekId(prev.year, prev.weekNumber);

    setDatabase((prevDb) => {
      if (!prevDb.weeks[prevId]) {
        return {
          ...prevDb,
          weeks: {
            ...prevDb.weeks,
            [prevId]: createEmptyWeek(prev.year, prev.weekNumber),
          },
        };
      }
      return prevDb;
    });

    setSelectedWeekId(prevId);
  }, [selectedWeekId]);

  // Navigate to next week
  const goToNextWeek = useCallback(() => {
    const { year, weekNumber } = parseWeekId(selectedWeekId);
    const next = getNextWeek(year, weekNumber);
    const nextId = formatWeekId(next.year, next.weekNumber);

    setDatabase((prevDb) => {
      if (!prevDb.weeks[nextId]) {
        return {
          ...prevDb,
          weeks: {
            ...prevDb.weeks,
            [nextId]: createEmptyWeek(next.year, next.weekNumber),
          },
        };
      }
      return prevDb;
    });

    setSelectedWeekId(nextId);
  }, [selectedWeekId]);

  // Jump to current week
  const goToCurrentWeek = useCallback(() => {
    const current = getISOWeekDetails();
    const currentId = formatWeekId(current.year, current.weekNumber);

    setDatabase((prevDb) => {
      if (!prevDb.weeks[currentId]) {
        return {
          ...prevDb,
          weeks: {
            ...prevDb.weeks,
            [currentId]: createEmptyWeek(current.year, current.weekNumber),
          },
        };
      }
      return prevDb;
    });

    setSelectedWeekId(currentId);
  }, []);

  const selectWeek = useCallback((weekId: string) => {
    setSelectedWeekId(weekId);
  }, []);

  // Save or update a meal within the selected week
  const saveMeal = useCallback(
    (meal: MealEntry) => {
      setDatabase((prevDb) => {
        const { year, weekNumber } = parseWeekId(selectedWeekId);
        const existingWeek = prevDb.weeks[selectedWeekId] || createEmptyWeek(year, weekNumber);

        const updatedMeals = existingWeek.meals.map((m) =>
          m.day === meal.day ? { ...meal } : m
        );

        const updatedWeek = recalculateWeekTotal({
          ...existingWeek,
          meals: updatedMeals,
        });

        return {
          ...prevDb,
          weeks: {
            ...prevDb.weeks,
            [selectedWeekId]: updatedWeek,
          },
        };
      });
    },
    [selectedWeekId]
  );

  // Clear a meal for a specific day
  const clearMeal = useCallback(
    (day: DayOfWeek) => {
      setDatabase((prevDb) => {
        const currentWeek = prevDb.weeks[selectedWeekId];
        if (!currentWeek) return prevDb;

        const updatedMeals = currentWeek.meals.map((m) =>
          m.day === day
            ? {
                id: `${selectedWeekId}-${day.toLowerCase()}`,
                day,
                course: '',
                cost: 0,
                ingredients: [],
                notes: undefined,
              }
            : m
        );

        const updatedWeek = recalculateWeekTotal({
          ...currentWeek,
          meals: updatedMeals,
        });

        return {
          ...prevDb,
          weeks: {
            ...prevDb.weeks,
            [selectedWeekId]: updatedWeek,
          },
        };
      });
    },
    [selectedWeekId]
  );

  // Duplicate current week meal schedule to the next week
  const copyCurrentWeekToNext = useCallback(() => {
    const { year, weekNumber } = parseWeekId(selectedWeekId);
    const next = getNextWeek(year, weekNumber);
    const nextId = formatWeekId(next.year, next.weekNumber);

    setDatabase((prevDb) => {
      const sourceWeek = prevDb.weeks[selectedWeekId] || createEmptyWeek(year, weekNumber);
      const clonedMeals: MealEntry[] = sourceWeek.meals.map((m) => ({
        ...m,
        id: `${nextId}-${m.day.toLowerCase()}`,
        ingredients: m.ingredients.map((ing, i) => ({
          ...ing,
          id: `${nextId}-${m.day.toLowerCase()}-ing-${i}`,
          isPurchased: false,
        })),
      }));

      const nextWeek = recalculateWeekTotal({
        id: nextId,
        year: next.year,
        weekNumber: next.weekNumber,
        meals: clonedMeals,
        totalSpent: 0,
        budgetGoal: sourceWeek.budgetGoal,
        updatedAt: new Date().toISOString(),
      });

      return {
        ...prevDb,
        weeks: {
          ...prevDb.weeks,
          [nextId]: nextWeek,
        },
      };
    });

    setSelectedWeekId(nextId);
  }, [selectedWeekId]);

  // Update app settings
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setDatabase((prevDb) => ({
      ...prevDb,
      settings: {
        ...prevDb.settings,
        ...newSettings,
      },
    }));
  }, []);

  // Reset database to demo data
  const resetData = useCallback(() => {
    const fresh = resetToDemoData();
    setDatabase(fresh);
    const current = getISOWeekDetails();
    setSelectedWeekId(formatWeekId(current.year, current.weekNumber));
  }, []);

  // Export JSON
  const exportData = useCallback(() => {
    return exportDatabaseJSON();
  }, []);

  // Import JSON / Pasted Text
  const importData = useCallback(
    (jsonStr: string, mode: 'merge' | 'replace' = 'merge') => {
      const parsed = extractAndParseMealData(jsonStr, {
        year: selectedWeek.year,
        weekNumber: selectedWeek.weekNumber,
      });

      if (!parsed.success) {
        return { success: false, error: parsed.error };
      }

      let finalDb: AppDatabase;
      if (mode === 'merge') {
        finalDb = mergeDataWithExisting(parsed.db, database);
      } else {
        finalDb = parsed.db;
      }

      saveDatabase(finalDb);
      setDatabase(finalDb);

      // Focus the imported week in view
      const targetWeekId = parsed.db.currentWeekId || Object.keys(parsed.db.weeks)[0];
      if (targetWeekId && finalDb.weeks[targetWeekId]) {
        setSelectedWeekId(targetWeekId);
      }

      return {
        success: true,
        summary: parsed.summary,
      };
    },
    [database, selectedWeek.year, selectedWeek.weekNumber]
  );

  return (
    <PlannerContext.Provider
      value={{
        database,
        activeTab,
        setActiveTab,
        selectedWeekId,
        selectedWeek,
        settings: database.settings,
        allWeeks,
        goToPreviousWeek,
        goToNextWeek,
        goToCurrentWeek,
        selectWeek,
        saveMeal,
        clearMeal,
        copyCurrentWeekToNext,
        updateSettings,
        resetData,
        exportData,
        importData,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = (): PlannerContextType => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
