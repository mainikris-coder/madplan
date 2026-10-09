export type DayOfWeek = 
  | 'Monday' 
  | 'Tuesday' 
  | 'Wednesday' 
  | 'Thursday' 
  | 'Friday' 
  | 'Saturday' 
  | 'Sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export interface IngredientItem {
  id: string;
  name: string;
  isPurchased?: boolean;
}

export interface MealEntry {
  id: string;
  day: DayOfWeek;
  course: string;
  cost: number;
  ingredients: IngredientItem[];
  notes?: string;
}

export interface WeekPlan {
  id: string;                // e.g., "2026-W40"
  weekNumber: number;
  year: number;
  meals: MealEntry[];
  totalSpent: number;
  budgetGoal?: number;
  updatedAt: string;
}

export type Language = 'da' | 'en';

export interface AppSettings {
  currencySymbol: string;
  currencyPosition: 'prefix' | 'suffix';
  theme: 'light' | 'dark' | 'system';
  language?: Language;
}

export interface AppDatabase {
  version: number;
  currentWeekId: string;
  weeks: Record<string, WeekPlan>;
  settings: AppSettings;
}

export type NavigationTab = 'planner' | 'analytics' | 'settings';
