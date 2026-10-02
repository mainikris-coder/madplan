import {
  AppDatabase,
  WeekPlan,
  MealEntry,
  DayOfWeek,
  DAYS_OF_WEEK,
} from '../types/planner';
import { formatWeekId, getISOWeekDetails } from '../utils/dateUtils';

const STORAGE_KEY = 'madplan_db_v1';
const CURRENT_VERSION = 1;

/**
 * Creates an empty week plan with empty meal placeholders for all 7 days.
 */
export function createEmptyWeek(year: number, weekNumber: number): WeekPlan {
  const id = formatWeekId(year, weekNumber);
  const meals: MealEntry[] = DAYS_OF_WEEK.map((day) => ({
    id: `${id}-${day.toLowerCase()}`,
    day,
    course: '',
    cost: 0,
    ingredients: [],
  }));

  return {
    id,
    weekNumber,
    year,
    meals,
    totalSpent: 0,
    budgetGoal: 150,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Recalculates the totalSpent field of a week from its meals.
 */
export function recalculateWeekTotal(week: WeekPlan): WeekPlan {
  const total = week.meals.reduce((sum, meal) => sum + (Number(meal.cost) || 0), 0);
  return {
    ...week,
    totalSpent: Math.round(total * 100) / 100,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Generates rich realistic seed data for the current week and several past weeks.
 */
export function generateSeedData(): AppDatabase {
  const currentWeek = getISOWeekDetails(); // e.g. 2026, W40
  const weeks: Record<string, WeekPlan> = {};

  const historicalMealTemplates: Array<{
    meals: Array<{ day: DayOfWeek; course: string; cost: number; ingredients: string[] }>;
  }> = [
    // Week 33
    {
      meals: [
        { day: 'Monday', course: 'Pasta Carbonara', cost: 14.5, ingredients: ['Spaghetti', 'Pancetta', 'Eggs', 'Parmesan'] },
        { day: 'Tuesday', course: 'Chicken Fajitas', cost: 19.0, ingredients: ['Chicken Breast', 'Tortillas', 'Bell Peppers', 'Onion'] },
        { day: 'Wednesday', course: 'Tomato & Basil Soup', cost: 9.5, ingredients: ['Tomatoes', 'Basil', 'Heavy Cream', 'Garlic Bread'] },
        { day: 'Thursday', course: 'Beef Chili con Carne', cost: 21.0, ingredients: ['Ground Beef', 'Kidney Beans', 'Tomatoes', 'Chili Spices'] },
        { day: 'Friday', course: 'Fish Tacos', cost: 18.5, ingredients: ['White Fish Fillet', 'Cabbage Slaw', 'Lime', 'Tortillas'] },
        { day: 'Saturday', course: 'Ribeye Steak & Fries', cost: 34.0, ingredients: ['Ribeye Steaks', 'Potatoes', 'Butter', 'Rosemary'] },
        { day: 'Sunday', course: 'Vegetable Lasagna', cost: 16.0, ingredients: ['Lasagna Sheets', 'Spinach', 'Ricotta', 'Tomato Sauce'] },
      ],
    },
    // Week 34
    {
      meals: [
        { day: 'Monday', course: 'Teriyaki Chicken Rice', cost: 15.0, ingredients: ['Chicken Thighs', 'Soy Sauce', 'Jasmine Rice', 'Broccoli'] },
        { day: 'Tuesday', course: 'Beef Burger Night', cost: 22.0, ingredients: ['Burger Buns', 'Ground Beef', 'Cheddar', 'Lettuce'] },
        { day: 'Wednesday', course: 'Greek Salad & Pita', cost: 11.5, ingredients: ['Feta Cheese', 'Cucumbers', 'Kalamata Olives', 'Pita'] },
        { day: 'Thursday', course: 'Lentil Dahl & Naan', cost: 10.0, ingredients: ['Red Lentils', 'Coconut Milk', 'Garlic', 'Naan'] },
        { day: 'Friday', course: 'Homemade Pizza', cost: 17.5, ingredients: ['Pizza Dough', 'Mozzarella', 'Pepperoni', 'Tomato Puree'] },
        { day: 'Saturday', course: 'Roast Lemon Chicken', cost: 26.0, ingredients: ['Whole Chicken', 'Lemons', 'Baby Potatoes', 'Thyme'] },
        { day: 'Sunday', course: 'Pesto Gnocchi', cost: 12.0, ingredients: ['Gnocchi', 'Basil Pesto', 'Pine Nuts', 'Parmesan'] },
      ],
    },
    // Week 35
    {
      meals: [
        { day: 'Monday', course: 'Turkey Meatballs', cost: 16.5, ingredients: ['Ground Turkey', 'Spaghetti', 'Marinara', 'Oregano'] },
        { day: 'Tuesday', course: 'Quesadillas', cost: 13.0, ingredients: ['Flour Tortillas', 'Cheese Mix', 'Salsa', 'Guacamole'] },
        { day: 'Wednesday', course: 'Thai Green Curry', cost: 20.0, ingredients: ['Chicken Breast', 'Green Curry Paste', 'Coconut Milk', 'Bamboo Shoots'] },
        { day: 'Thursday', course: 'Minestrone Soup', cost: 11.0, ingredients: ['Beans', 'Pasta', 'Carrots', 'Celery', 'Vegetable Broth'] },
        { day: 'Friday', course: 'Sushi Rolls Night', cost: 28.5, ingredients: ['Sushi Rice', 'Salmon', 'Nori Sheets', 'Avocado'] },
        { day: 'Saturday', course: 'BBQ Pulled Pork', cost: 25.0, ingredients: ['Pork Shoulder', 'BBQ Sauce', 'Brioche Buns', 'Coleslaw'] },
        { day: 'Sunday', course: 'Leftover Carnitas', cost: 6.0, ingredients: ['Leftover Pork', 'Tortillas', 'Cilantro'] },
      ],
    },
    // Week 36
    {
      meals: [
        { day: 'Monday', course: 'Creamy Mushroom Risotto', cost: 14.0, ingredients: ['Arborio Rice', 'Cremini Mushrooms', 'White Wine', 'Parmesan'] },
        { day: 'Tuesday', course: 'Tacos Supreme', cost: 21.5, ingredients: ['Hard Taco Shells', 'Ground Beef', 'Sour Cream', 'Cheddar'] },
        { day: 'Wednesday', course: 'Caesar Salad with Chicken', cost: 15.0, ingredients: ['Romaine', 'Grilled Chicken', 'Croutons', 'Caesar Dressing'] },
        { day: 'Thursday', course: 'Vegetable Stir Fry', cost: 13.0, ingredients: ['Tofu', 'Mixed Veggies', 'Egg Noodles', 'Sesame Oil'] },
        { day: 'Friday', course: 'Fish & Chips', cost: 24.0, ingredients: ['Cod Fillets', 'Batter Mix', 'Tartar Sauce', 'Fries'] },
        { day: 'Saturday', course: 'Beef Stew', cost: 27.0, ingredients: ['Beef Chuck', 'Red Wine', 'Carrots', 'Potatoes'] },
        { day: 'Sunday', course: 'Macaroni & Cheese', cost: 9.5, ingredients: ['Elbow Macaroni', 'Sharp Cheddar', 'Milk', 'Breadcrumbs'] },
      ],
    },
    // Week 37
    {
      meals: [
        { day: 'Monday', course: 'Spinach & Feta Pie', cost: 13.5, ingredients: ['Phyllo Pastry', 'Spinach', 'Feta', 'Eggs'] },
        { day: 'Tuesday', course: 'Korean Bibimbap', cost: 19.0, ingredients: ['Rice', 'Beef Strips', 'Fried Egg', 'Kimchi', 'Gochujang'] },
        { day: 'Wednesday', course: 'Tomato Pasta', cost: 8.5, ingredients: ['Penne', 'Canned San Marzano Tomatoes', 'Garlic', 'Olive Oil'] },
        { day: 'Thursday', course: 'Chicken Enchiladas', cost: 20.0, ingredients: ['Corn Tortillas', 'Shredded Chicken', 'Enchilada Sauce', 'Monterey Jack'] },
        { day: 'Friday', course: 'Crispy Salmon Bowls', cost: 29.0, ingredients: ['Salmon Fillets', 'Brown Rice', 'Edamame', 'Spicy Mayo'] },
        { day: 'Saturday', course: 'Lamb Chops & Veggies', cost: 35.0, ingredients: ['Lamb Chops', 'Garlic Butter', 'Asparagus', 'Mint Sauce'] },
        { day: 'Sunday', course: 'Leftover Enchiladas', cost: 5.0, ingredients: ['Leftovers'] },
      ],
    },
    // Week 38
    {
      meals: [
        { day: 'Monday', course: 'Chicken Fried Rice', cost: 12.0, ingredients: ['Day-old Rice', 'Chicken', 'Peas', 'Eggs', 'Soy Sauce'] },
        { day: 'Tuesday', course: 'Beef Burrito Bowls', cost: 18.5, ingredients: ['Ground Beef', 'Black Beans', 'Corn', 'Avocado'] },
        { day: 'Wednesday', course: 'Butternut Squash Soup', cost: 10.0, ingredients: ['Butternut Squash', 'Ginger', 'Coconut Cream', 'Pumpkin Seeds'] },
        { day: 'Thursday', course: 'Pork Chops & Apple Sauce', cost: 19.5, ingredients: ['Pork Chops', 'Apples', 'Cinnamon', 'Green Beans'] },
        { day: 'Friday', course: 'Takeout-style Lo Mein', cost: 14.0, ingredients: ['Lo Mein Noodles', 'Cabbage', 'Carrots', 'Oyster Sauce'] },
        { day: 'Saturday', course: 'Homemade Burgers', cost: 23.5, ingredients: ['Ground Chuck', 'Brioche Buns', 'Pickles', 'Bacon'] },
        { day: 'Sunday', course: 'Tortellini in Brodo', cost: 11.0, ingredients: ['Cheese Tortellini', 'Chicken Broth', 'Parmesan'] },
      ],
    },
    // Week 39
    {
      meals: [
        { day: 'Monday', course: 'Shrimp Scampi', cost: 22.0, ingredients: ['Shrimp', 'Linguine', 'Garlic', 'White Wine', 'Parsley'] },
        { day: 'Tuesday', course: 'Chicken Tikka Masala', cost: 21.0, ingredients: ['Chicken Breast', 'Tikka Masala Sauce', 'Basmati Rice', 'Naan'] },
        { day: 'Wednesday', course: 'Avocado Toast & Eggs', cost: 9.0, ingredients: ['Sourdough Bread', 'Avocados', 'Eggs', 'Chili Flakes'] },
        { day: 'Thursday', course: 'Stuffed Bell Peppers', cost: 16.0, ingredients: ['Bell Peppers', 'Ground Beef', 'Rice', 'Tomato Sauce'] },
        { day: 'Friday', course: 'Artisan Pizza Night', cost: 18.0, ingredients: ['Flour', 'Yeast', 'Buffalo Mozzarella', 'Prosciutto'] },
        { day: 'Saturday', course: 'Slow Cooker Pot Roast', cost: 31.0, ingredients: ['Chuck Roast', 'Carrots', 'Potatoes', 'Beef Stock'] },
        { day: 'Sunday', course: 'Vegetable Fried Noodles', cost: 10.5, ingredients: ['Noodles', 'Bok Choy', 'Mushrooms', 'Soy Sauce'] },
      ],
    },
    // Week 40 (Current Week - directly from handoff plan!)
    {
      meals: [
        { day: 'Monday', course: 'Spaghetti Bolognese', cost: 15.0, ingredients: ['Minced Beef', 'Spaghetti', 'Crushed Tomatoes', 'Onion', 'Garlic'] },
        { day: 'Tuesday', course: 'Tacos', cost: 22.5, ingredients: ['Taco Shells', 'Ground Beef', 'Cheese', 'Salsa', 'Lettuce'] },
        { day: 'Wednesday', course: 'Chicken Salad', cost: 12.0, ingredients: ['Chicken Breast', 'Mixed Greens', 'Cherry Tomatoes', 'Vinaigrette'] },
        { day: 'Thursday', course: 'Stir Fry', cost: 18.0, ingredients: ['Beef Strips', 'Bell Peppers', 'Broccoli', 'Soy Sauce', 'Rice'] },
        { day: 'Friday', course: 'Homemade Pizza', cost: 20.0, ingredients: ['Pizza Dough', 'Mozzarella', 'Ham', 'Tomato Sauce'] },
        { day: 'Saturday', course: 'Steak and Potatoes', cost: 30.0, ingredients: ['Sirloin Steaks', 'Baking Potatoes', 'Butter', 'Garlic'] },
        { day: 'Sunday', course: 'Leftovers', cost: 8.0, ingredients: ['Leftover Steaks & Pizza', 'Side Salad'] },
      ],
    },
  ];

  // Populate weeks 33 through 40
  const startWeek = currentWeek.weekNumber - historicalMealTemplates.length + 1; // e.g. 40 - 8 + 1 = 33
  historicalMealTemplates.forEach((template, idx) => {
    const weekNum = startWeek + idx;
    const weekYear = currentWeek.year;
    const weekId = formatWeekId(weekYear, weekNum);

    const weekMeals: MealEntry[] = template.meals.map((m) => ({
      id: `${weekId}-${m.day.toLowerCase()}`,
      day: m.day,
      course: m.course,
      cost: m.cost,
      ingredients: m.ingredients.map((ing, i) => ({
        id: `${weekId}-${m.day.toLowerCase()}-ing-${i}`,
        name: ing,
        isPurchased: true,
      })),
    }));

    const total = weekMeals.reduce((sum, item) => sum + item.cost, 0);

    weeks[weekId] = {
      id: weekId,
      weekNumber: weekNum,
      year: weekYear,
      meals: weekMeals,
      totalSpent: Math.round(total * 100) / 100,
      budgetGoal: 150,
      updatedAt: new Date().toISOString(),
    };
  });

  const currentWeekId = formatWeekId(currentWeek.year, currentWeek.weekNumber);

  return {
    version: CURRENT_VERSION,
    currentWeekId,
    weeks,
    settings: {
      currencySymbol: '$',
      currencyPosition: 'prefix',
      theme: 'system',
    },
  };
}

/**
 * Loads the database from localStorage or initializes with seed data if absent.
 */
export function loadDatabase(): AppDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = generateSeedData();
      saveDatabase(seeded);
      return seeded;
    }

    const parsed = JSON.parse(raw) as AppDatabase;
    if (!parsed || typeof parsed !== 'object' || !parsed.weeks) {
      const seeded = generateSeedData();
      saveDatabase(seeded);
      return seeded;
    }

    return parsed;
  } catch (err) {
    console.warn('Failed to load database from localStorage, resetting to seed:', err);
    const seeded = generateSeedData();
    saveDatabase(seeded);
    return seeded;
  }
}

/**
 * Persists the database to localStorage.
 */
export function saveDatabase(db: AppDatabase): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return true;
  } catch (err) {
    console.error('Failed to save database to localStorage:', err);
    return false;
  }
}

/**
 * Resets local database to fresh sample data.
 */
export function resetToDemoData(): AppDatabase {
  const seeded = generateSeedData();
  saveDatabase(seeded);
  return seeded;
}

/**
 * Exports the entire database as a pretty-printed JSON string.
 */
export function exportDatabaseJSON(): string {
  const db = loadDatabase();
  return JSON.stringify(db, null, 2);
}

/**
 * Validates and imports a JSON string into localStorage.
 */
export function importDatabaseJSON(jsonStr: string): { success: boolean; error?: string; db?: AppDatabase } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON format' };
    }

    if (!parsed.weeks || typeof parsed.weeks !== 'object') {
      return { success: false, error: 'Missing "weeks" property in plan data' };
    }

    const db: AppDatabase = {
      version: parsed.version || CURRENT_VERSION,
      currentWeekId: parsed.currentWeekId || Object.keys(parsed.weeks)[0] || '',
      weeks: parsed.weeks,
      settings: parsed.settings || {
        currencySymbol: '$',
        currencyPosition: 'prefix',
        theme: 'system',
      },
    };

    saveDatabase(db);
    return { success: true, db };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown parsing error' };
  }
}
