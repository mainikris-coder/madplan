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
    budgetGoal: 850,
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
    // Uge 1 (7 uger siden)
    {
      meals: [
        { day: 'Monday', course: 'Pasta med kødsovs', cost: 75.0, ingredients: ['Hakket oksekød', 'Spaghetti', 'Hakkede tomater', 'Løg', 'Hvidløg'] },
        { day: 'Tuesday', course: 'Kylling i karry med ris', cost: 95.0, ingredients: ['Kyllingebryst', 'Karrypasta', 'Kokosmælk', 'Basmatiris', 'Peberfrugt'] },
        { day: 'Wednesday', course: 'Klassisk tomatsuppe', cost: 55.0, ingredients: ['Flåede tomater', 'Piskefløde', 'Suppenudler', 'Flûte'] },
        { day: 'Thursday', course: 'Chili con carne', cost: 90.0, ingredients: ['Hakket oksekød', 'Kidneybønner', 'Hakkede tomater', 'Mørk chokolade', 'Ris'] },
        { day: 'Friday', course: 'Hjemmelavet pizza', cost: 110.0, ingredients: ['Pizzadej', 'Revet mozzarella', 'Skinke', 'Tomatsauce', 'Champignon'] },
        { day: 'Saturday', course: 'Entrecôte med pommes frites & bearnaise', cost: 185.0, ingredients: ['Entrecôte', 'Bagekartofler', 'Bearnaisesauce', 'Friske bønner'] },
        { day: 'Sunday', course: 'Vegetarisk lasagne', cost: 85.0, ingredients: ['Lasagneplader', 'Spinat', 'Ricotta', 'Tomatsauce', 'Revet ost'] },
      ],
    },
    // Uge 2
    {
      meals: [
        { day: 'Monday', course: 'Frikadeller med kartofler & brun sovs', cost: 85.0, ingredients: ['Hakket kalv og flæsk', 'Kartofler', 'Løg', 'Mælk', 'Sovsekulør'] },
        { day: 'Tuesday', course: 'Tacos med oksekød & guacamole', cost: 115.0, ingredients: ['Tacoskaller', 'Hakket oksekød', 'Avocado', 'Revet cheddar', 'Tomatsalsa'] },
        { day: 'Wednesday', course: 'Græsk salat med kyllingespyd & tzatziki', cost: 90.0, ingredients: ['Kyllingebryst', 'Fetaost', 'Agurk', 'Græsk yoghurt', 'Pitabrød'] },
        { day: 'Thursday', course: 'Rød linsedal med naanbrød', cost: 65.0, ingredients: ['Røde linser', 'Kokosmælk', 'Ingefær', 'Hvidløg', 'Naanbrød'] },
        { day: 'Friday', course: 'Hjemmelavede burgere med sprøde ovnkartofler', cost: 130.0, ingredients: ['Burgerboller', 'Hakket oksekød', 'Cheddar', 'Bacon', 'Bagekartofler'] },
        { day: 'Saturday', course: 'Helstegt kylling med rodfrugter', cost: 140.0, ingredients: ['Hel kylling', 'Gulerødder', 'Pastinakker', 'Citron', 'Timian'] },
        { day: 'Sunday', course: 'Pasta med cremet basilikumpesto', cost: 60.0, ingredients: ['Fettuccine', 'Grøn pesto', 'Pinjekerner', 'Parmesan', 'Rucola'] },
      ],
    },
    // Uge 3
    {
      meals: [
        { day: 'Monday', course: 'Boller i karry med løse ris', cost: 85.0, ingredients: ['Hakket svinekød', 'Løg', 'Madlavningsfløde', 'Karry', 'Basmatiris'] },
        { day: 'Tuesday', course: 'Tortillas med pulled chicken & salsa', cost: 105.0, ingredients: ['Tortillapandekager', 'Kyllingelår', 'Majs', 'Creme fraiche', 'Jalapeños'] },
        { day: 'Wednesday', course: 'Thaisuppe med kylling & nudler', cost: 95.0, ingredients: ['Kyllingestrimler', 'Kokosmælk', 'Rød karrypasta', 'Æggenudler', 'Forårsløg'] },
        { day: 'Thursday', course: 'Kartoffel-porresuppe med sprød bacon', cost: 60.0, ingredients: ['Kartofler', 'Porrer', 'Bacontern', 'Piskefløde', 'Hvidløgsbrød'] },
        { day: 'Friday', course: 'Sushi bowl med laks & edamame', cost: 155.0, ingredients: ['Sushiris', 'Fersk laks', 'Avocado', 'Edamamebønner', 'Chilimayo'] },
        { day: 'Saturday', course: 'Mørbradgryde med bacon & cocktailpølser', cost: 165.0, ingredients: ['Svinemørbrad', 'Bacon', 'Cocktailpølser', 'Champignon', 'Piskefløde'] },
        { day: 'Sunday', course: 'Restemad & rugbrød med lune deller', cost: 40.0, ingredients: ['Rugbrød', 'Rester af deller', 'Rødbeder', 'Remoulade'] },
      ],
    },
    // Uge 4
    {
      meals: [
        { day: 'Monday', course: 'Klassisk risotto med svampe', cost: 75.0, ingredients: ['Risottoris', 'Brune markchampignon', 'Hvidvin', 'Parmesan', 'Smør'] },
        { day: 'Tuesday', course: 'Kødboller i tomatsauce med pasta', cost: 90.0, ingredients: ['Hakket oksekød', 'Penne', 'Hakkede tomater', 'Basilikum', 'Mozzarella'] },
        { day: 'Wednesday', course: 'Cæsarsalat med grillet kylling', cost: 85.0, ingredients: ['Romainesalat', 'Kyllingebryst', 'Kroketter', 'Cæsardressing', 'Parmesan'] },
        { day: 'Thursday', course: 'Wok med oksekød & grøntsager', cost: 110.0, ingredients: ['Oksekødsstrimler', 'Broccoli', 'Peberfrugt', 'Soja', 'Nudler'] },
        { day: 'Friday', course: 'Fish and chips med tatarsauce', cost: 125.0, ingredients: ['Torskefilet', 'Kartofler', 'Tatarsauce', 'Citron', 'Grønne ærter'] },
        { day: 'Saturday', course: 'Gullasch med kartoffelmos', cost: 145.0, ingredients: ['Skært oksekød', 'Kartofler', 'Løg', 'Paprika', 'Rødvin'] },
        { day: 'Sunday', course: 'Macaroni and cheese', cost: 55.0, ingredients: ['Makaroni', 'Cheddarost', 'Mælk', 'Smør', 'Muskatnød'] },
      ],
    },
    // Uge 5
    {
      meals: [
        { day: 'Monday', course: 'Spinattærte med feta & cherrytomater', cost: 75.0, ingredients: ['Tærtedej', 'Spinat', 'Fetaost', 'Æg', 'Fløde'] },
        { day: 'Tuesday', course: 'Biksemad med spejlæg & rødbeder', cost: 80.0, ingredients: ['Kødtern', 'Kartofler', 'Løg', 'Æg', 'Syltede rødbeder'] },
        { day: 'Wednesday', course: 'Pasta Carbonara', cost: 85.0, ingredients: ['Spaghetti', 'Bacon', 'Æg', 'Parmesan', 'Friskkværnet peber'] },
        { day: 'Thursday', course: 'Kylling fajitas med peberfrugt', cost: 115.0, ingredients: ['Kyllingebryst', 'Tortillas', 'Peberfrugt', 'Rødløg', 'Guacamole'] },
        { day: 'Friday', course: 'Ovnbagt laks med dildkartofler & hollandaise', cost: 160.0, ingredients: ['Laksefilet', 'Små kartofler', 'Hollandaisesauce', 'Frisk dild', 'Asparges'] },
        { day: 'Saturday', course: 'Lammekoteletter med bagt hvidløg & bønner', cost: 175.0, ingredients: ['Lammekoteletter', 'Hvidløgssmør', 'Grønne bønner', 'Kartoffelbåde'] },
        { day: 'Sunday', course: 'Tøm køleskabet / Restemad', cost: 35.0, ingredients: ['Rester fra ugen', 'Salat'] },
      ],
    },
    // Uge 6
    {
      meals: [
        { day: 'Monday', course: 'Stegte ris med kylling & grønt', cost: 70.0, ingredients: ['Kogte ris', 'Kyllingetern', 'Ærter', 'Gulerødder', 'Æg', 'Sojasauce'] },
        { day: 'Tuesday', course: 'Hakkebøf med bløde løg, kartofler & brun sovs', cost: 120.0, ingredients: ['Hakket oksekød', 'Store løg', 'Kartofler', 'Smør', 'Fløde'] },
        { day: 'Wednesday', course: 'Hokkaidosuppe med ristede græskarkerner', cost: 65.0, ingredients: ['Hokkaidogræskar', 'Kokosmælk', 'Ingefær', 'Græskarkerner', 'Flûte'] },
        { day: 'Thursday', course: 'Koteletter i fad med champignon & bacon', cost: 125.0, ingredients: ['Svinekoteletter', 'Champignon', 'Bacon', 'Hakkede tomater', 'Ris'] },
        { day: 'Friday', course: 'Mexicansk burrito bowl', cost: 105.0, ingredients: ['Hakket oksekød', 'Sorte bønner', 'Majs', 'Ris', 'Salsa', 'Cheddar'] },
        { day: 'Saturday', course: 'Ribeye med rødvinssauce & ovnbagte kartofler', cost: 190.0, ingredients: ['Ribeye bøffer', 'Bagekartofler', 'Rødvinssauce', 'Broccolini'] },
        { day: 'Sunday', course: 'Tortellini i cremet tomatsauce', cost: 60.0, ingredients: ['Ricotta-spinat tortellini', 'Hakkede tomater', 'Fløde', 'Parmesan'] },
      ],
    },
    // Uge 7
    {
      meals: [
        { day: 'Monday', course: 'Hvidløgsrejer med pasta & citron', cost: 120.0, ingredients: ['Kæmperejer', 'Linguine', 'Hvidløg', 'Hvidvin', 'Frisk persille'] },
        { day: 'Tuesday', course: 'Butter chicken med basmatiris', cost: 110.0, ingredients: ['Kyllingebryst', 'Smør', 'Tandoori krydderi', 'Fløde', 'Basmatiris', 'Naanbrød'] },
        { day: 'Wednesday', course: 'Rugbrødsbord med fiskefilet & lun leverpostej', cost: 75.0, ingredients: ['Rugbrød', 'Fiskefileter', 'Remoulade', 'Leverpostej', 'Bacon'] },
        { day: 'Thursday', course: 'Fyldte peberfrugter med oksekød & ris', cost: 95.0, ingredients: ['Røde peberfrugter', 'Hakket oksekød', 'Ris', 'Revet ost', 'Tomatsauce'] },
        { day: 'Friday', course: 'Italiensk pizza aften', cost: 115.0, ingredients: ['Pizzamel tipo 00', 'Gær', 'Bøffelmozzarella', 'Parmaskinke', 'Rucola'] },
        { day: 'Saturday', course: 'Gammeldags oksesteg med glaserede løg', cost: 180.0, ingredients: ['Oksesteg', 'Perleløg', 'Kartofler', 'Brun sovs', 'Tyttebær'] },
        { day: 'Sunday', course: 'Æggekage med bacon, tomat & purløg', cost: 55.0, ingredients: ['Æg', 'Mælk', 'Bacon i skiver', 'Tomater', 'Purløg', 'Rugbrød'] },
      ],
    },
    // Uge 8 (Nuværende uge)
    {
      meals: [
        { day: 'Monday', course: 'Boller i karry med æbletern & ris', cost: 85.0, ingredients: ['Hakket svinekød', 'Løg', 'Madlavningsfløde', 'Karry', 'Syrlige æbler', 'Basmatiris'] },
        { day: 'Tuesday', course: 'Tarteletter med høns i asparges', cost: 95.0, ingredients: ['Tarteletbunde', 'Kyllingekød', 'Hvide asparges', 'Smør', 'Mælk'] },
        { day: 'Wednesday', course: 'Pasta Carbonara', cost: 80.0, ingredients: ['Spaghetti', 'Bacon', 'Æg', 'Parmesan', 'Friskkværnet peber'] },
        { day: 'Thursday', course: 'Hakkebøffer med bløde løg & skysauce', cost: 115.0, ingredients: ['Hakket oksekød', 'Løg', 'Kartofler', 'Sky', 'Syltede agurker'] },
        { day: 'Friday', course: 'Stegt flæsk med persillesovs & kartofler', cost: 135.0, ingredients: ['Stegeflæsk i skiver', 'Kartofler', 'Smør', 'Mælk', 'Frisk kruspersille'] },
        { day: 'Saturday', course: 'Laks med ovnbagte rodfrugter & urtemayo', cost: 155.0, ingredients: ['Lakseportioner', 'Gulerødder', 'Pastinakker', 'Rødbeder', 'Krydderurtemayo'] },
        { day: 'Sunday', course: 'Søndags-restemad & sprød salat', cost: 40.0, ingredients: ['Rester fra ugens retter', 'Blandet grøn salat', 'Vinaigrette'] },
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
      budgetGoal: 850,
      updatedAt: new Date().toISOString(),
    };
  });

  const currentWeekId = formatWeekId(currentWeek.year, currentWeek.weekNumber);

  return {
    version: CURRENT_VERSION,
    currentWeekId,
    weeks,
    settings: {
      currencySymbol: 'kr.',
      currencyPosition: 'suffix',
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
 * Clears all meal plan data, wiping out all weeks and starting with an empty current week.
 * Preserves user settings if provided.
 */
export function clearAllData(currentSettings?: AppDatabase['settings']): AppDatabase {
  const current = getISOWeekDetails();
  const currentWeekId = formatWeekId(current.year, current.weekNumber);
  const emptyWeek = createEmptyWeek(current.year, current.weekNumber);

  const cleared: AppDatabase = {
    version: CURRENT_VERSION,
    currentWeekId,
    weeks: {
      [currentWeekId]: emptyWeek,
    },
    settings: currentSettings || {
      currencySymbol: 'kr.',
      currencyPosition: 'suffix',
      theme: 'system',
    },
  };

  saveDatabase(cleared);
  return cleared;
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
        currencySymbol: 'kr.',
        currencyPosition: 'suffix',
        theme: 'system',
      },
    };

    saveDatabase(db);
    return { success: true, db };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown parsing error' };
  }
}
