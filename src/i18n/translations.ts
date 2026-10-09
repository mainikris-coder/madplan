import { DayOfWeek } from '../types/planner';

export type Language = 'da' | 'en';

export interface TranslationStrings {
  // App & Navigation
  appTitle: string;
  navPlanner: string;
  navAnalytics: string;
  navSettings: string;
  weekLabel: (weekNumber: number, dateRange: string) => string;
  jumpToCurrentWeek: string;
  prevWeek: string;
  nextWeek: string;
  active: string;
  cancel: string;
  clear: string;
  add: string;
  save: string;
  close: string;
  noData: string;
  recommended: string;

  // Days of Week
  days: Record<DayOfWeek, string>;
  daysShort: Record<DayOfWeek, string>;

  // Planner View & Summary
  dailyDinners: string;
  mondayToSunday: string;
  weeklyGroceryBudget: string;
  target: string;
  dinnersPlanned: string;
  budgetUsedPercent: (pct: number) => string;
  exceededBudget: string;
  budgetRemaining: (amount: string) => string;
  tipTapToEdit: string;
  pastePlan: string;
  copyToNextWeek: string;
  copiedToNextWeek: (weekNumber: number) => string;
  copyFailed: string;
  noDinnerPlanned: string;
  ingredientCount: (count: number) => string;
  noIngredientsListed: string;

  // Meal Edit Modal
  dinnerTitle: (day: string) => string;
  mealNameLabel: string;
  mealNamePlaceholder: string;
  ideas: string;
  mealSuggestions: string[];
  costLabel: string;
  ingredientsLabel: string;
  itemCount: (count: number) => string;
  addIngredientPlaceholder: string;
  noIngredientsYet: string;
  notesLabel: string;
  notesPlaceholder: string;
  saveDinner: string;

  // Analytics View
  analyticsTitle: string;
  analyticsSubtitle: string;
  avgWeekly: string;
  acrossRecordedWeeks: string;
  highestWeek: string;
  lowestWeek: string;
  totalDinners: string;
  plannedFamilyMeals: string;
  spendingTrends: string;
  spendingTrendsSubtitle: string;
  chartBars: string;
  chartPills: string;
  chartSpent: string;
  chartBudget: string;
  weeklyHistory: string;
  weeksRecorded: (count: number) => string;
  dinnersCount: (planned: number) => string;
  openInPlanner: string;
  weekNumberLabel: (weekNumber: number, year: number) => string;

  // Settings View
  settingsTitle: string;
  settingsSubtitle: string;
  languageTitle: string;
  languageSubtitle: string;
  languageDanish: string;
  languageEnglish: string;
  languageUpdated: (lang: string) => string;
  currencyTitle: string;
  selectCurrency: string;
  currencyPlacement: string;
  placementBefore: string;
  placementAfter: string;
  currencyUpdated: (symbol: string) => string;
  budgetTargetTitle: string;
  budgetTargetSubtitle: string;
  saveTarget: string;
  budgetUpdated: (amount: number) => string;
  backupTitle: string;
  backupSubtitle: string;
  sharePlanButton: string;
  copyJsonButton: string;
  downloadJsonButton: string;
  importButton: string;
  clearDataButton: string;
  resetDemoButton: string;
  confirmClearTitle: string;
  confirmClearWarning: string;
  confirmClearButton: string;
  confirmResetTitle: string;
  confirmResetWarning: string;
  confirmResetButton: string;
  resetSuccessToast: string;
  clearSuccessToast: string;
  jsonCopiedToast: string;
  jsonCopyFailedToast: string;
  backupSharedToast: string;
  backupShareFailedToast: string;
  exportedToast: string;
  exportFailedToast: string;
  offlineCardTitle: string;
  offlineCardSubtitle: string;

  // Import Modal
  importModalTitle: string;
  importModalSubtitle: string;
  pasteFromClipboard: string;
  chooseBackupFile: string;
  pastedContentLabel: string;
  clearText: string;
  pastedTextPlaceholder: string;
  validDataDetected: string;
  invalidData: string;
  defaultInvalidDataMsg: string;
  weeksCountLabel: string;
  mealsCountLabel: string;
  plannedLabel: string;
  totalCostLabel: string;
  importStrategyLabel: string;
  smartMerge: string;
  smartMergeDesc: string;
  replaceAll: string;
  replaceAllDesc: string;
  importTipTitle: string;
  importTipDesc: string;
  confirmImportButton: string;
  clipboardUnsupported: string;
  clipboardEmpty: string;
  clipboardSuccess: string;
  clipboardManualNotice: string;
  fileLoaded: (name: string) => string;
  fileReadError: string;
  importFailed: string;
  importSuccessToast: (meals: number, weeks: number) => string;
}

export const translations: Record<Language, TranslationStrings> = {
  da: {
    // App & Navigation
    appTitle: 'Madplan',
    navPlanner: 'Madplan',
    navAnalytics: 'Statistik',
    navSettings: 'Indstillinger',
    weekLabel: (weekNumber, dateRange) => `Uge ${weekNumber} (${dateRange})`,
    jumpToCurrentWeek: 'Gå til denne uge',
    prevWeek: 'Forrige uge',
    nextWeek: 'Næste uge',
    active: 'Aktiv',
    cancel: 'Annuller',
    clear: 'Ryd',
    add: 'Tilføj',
    save: 'Gem',
    close: 'Luk',
    noData: 'Ingen data',
    recommended: 'Anbefalet',

    // Days of Week
    days: {
      Monday: 'Mandag',
      Tuesday: 'Tirsdag',
      Wednesday: 'Onsdag',
      Thursday: 'Torsdag',
      Friday: 'Fredag',
      Saturday: 'Lørdag',
      Sunday: 'Søndag',
    },
    daysShort: {
      Monday: 'Man',
      Tuesday: 'Tir',
      Wednesday: 'Ons',
      Thursday: 'Tor',
      Friday: 'Fre',
      Saturday: 'Lør',
      Sunday: 'Søn',
    },

    // Planner View & Summary
    dailyDinners: 'Daglige måltider',
    mondayToSunday: 'Mandag – Søndag',
    weeklyGroceryBudget: 'Ugentligt madbudget',
    target: 'mål',
    dinnersPlanned: 'Planlagte måltider',
    budgetUsedPercent: (pct) => `${pct}% af budgettet brugt`,
    exceededBudget: 'Budget overskredet',
    budgetRemaining: (amount) => `${amount} tilbage`,
    tipTapToEdit: 'Tip: Tryk på en ret for at redigere',
    pastePlan: 'Indsæt madplan',
    copyToNextWeek: 'Kopier til næste uge',
    copiedToNextWeek: (weekNumber) => `Madplanen blev kopieret til uge ${weekNumber}!`,
    copyFailed: 'Kunne ikke kopiere madplan.',
    noDinnerPlanned: 'Ingen aftensmad planlagt endnu',
    ingredientCount: (count) => (count === 1 ? '1 ingrediens' : `${count} ingredienser`),
    noIngredientsListed: 'Ingen ingredienser angivet',

    // Meal Edit Modal
    dinnerTitle: (day) => `${day} Aftensmad`,
    mealNameLabel: 'Ret / Måltid',
    mealNamePlaceholder: 'f.eks. Boller i karry',
    ideas: 'Idéer:',
    mealSuggestions: [
      'Boller i karry',
      'Frikadeller med kartofler',
      'Stegt flæsk med persillesovs',
      'Tarteletter med høns i asparges',
      'Hakkebøf med bløde løg',
      'Pasta med kødsovs',
      'Kylling i karry med ris',
      'Laks med ovnbagte rodfrugter',
      'Mørbradgryde',
      'Hjemmelavet pizza',
    ],
    costLabel: 'Pris for ingredienser',
    ingredientsLabel: 'Ingredienser',
    itemCount: (count) => (count === 1 ? '1 vare' : `${count} varer`),
    addIngredientPlaceholder: 'Tilføj ingrediens (f.eks. Hakket oksekød)...',
    noIngredientsYet: 'Ingen ingredienser tilføjet endnu.',
    notesLabel: 'Noter / Kok (Valgfrit)',
    notesPlaceholder: 'f.eks. Mor laver mad, lav dobbelt portion',
    saveDinner: 'Gem aftensmad',

    // Analytics View
    analyticsTitle: 'Forbrug & Statistik',
    analyticsSubtitle: 'Historisk overblik over madbudget og udgifter',
    avgWeekly: 'Gns. ugentligt',
    acrossRecordedWeeks: 'Over registrerede uger',
    highestWeek: 'Højeste uge',
    lowestWeek: 'Laveste uge',
    totalDinners: 'Måltider i alt',
    plannedFamilyMeals: 'Planlagte familiemåltider',
    spendingTrends: 'Forbrugsudvikling',
    spendingTrendsSubtitle: 'Samlede ugentlige udgifter over tid',
    chartBars: 'Søjler',
    chartPills: 'Kort',
    chartSpent: 'Brugt',
    chartBudget: 'Budget',
    weeklyHistory: 'Ugentlig forbrugshistorik',
    weeksRecorded: (count) => (count === 1 ? '1 uge registreret' : `${count} uger registreret`),
    dinnersCount: (planned) => `${planned}/7 måltider`,
    openInPlanner: 'Åbn i madplan',
    weekNumberLabel: (weekNumber, year) => `Uge ${weekNumber}, ${year}`,

    // Settings View
    settingsTitle: 'Indstillinger & Data',
    settingsSubtitle: 'Vælg sprog, valuta og administrer dine lokale data',
    languageTitle: 'Sprog',
    languageSubtitle: 'Vælg det sprog, appen skal vises på',
    languageDanish: 'Dansk',
    languageEnglish: 'English',
    languageUpdated: (lang) => `Sprog ændret til ${lang}`,
    currencyTitle: 'Valutaindstillinger',
    selectCurrency: 'Vælg valuta',
    currencyPlacement: 'Placering',
    placementBefore: 'Foran (f.eks. kr.100)',
    placementAfter: 'Efter (f.eks. 100 kr.)',
    currencyUpdated: (symbol) => `Valuta opdateret til ${symbol}`,
    budgetTargetTitle: 'Ugentligt budgetmål',
    budgetTargetSubtitle: 'Sæt et ugentligt forbrugsmål at holde dine madudgifter op imod.',
    saveTarget: 'Gem mål',
    budgetUpdated: (amount) => `Ugentligt budgetmål opdateret til ${amount}`,
    backupTitle: 'Sikkerhedskopiering & Data',
    backupSubtitle:
      'Da denne app kører 100% i din browser uden eksterne servere, gemmes dine data i localStorage. Del eller eksporter din madplan for at overføre til andre enheder, eller importer en madplan.',
    sharePlanButton: 'Del madplan (Tekst / Besked)',
    copyJsonButton: 'Kopier backup-JSON',
    downloadJsonButton: 'Download backup-fil',
    importButton: 'Indsæt / Importer madplan (JSON)',
    clearDataButton: 'Ryd alle data',
    resetDemoButton: 'Nulstil til demo-data',
    confirmClearTitle: 'Er du sikker på, at du vil rydde alle data? Alle planlagte måltider og uger vil blive slettet.',
    confirmClearWarning:
      'Dette sletter alle måltider permanent. Dine indstillinger for sprog og valuta bevares. Handlingen kan ikke fortrydes.',
    confirmClearButton: 'Ja, ryd alle data',
    confirmResetTitle: 'Er du sikker på, at du vil nulstille? Nuværende data erstattes af eksempeldata.',
    confirmResetWarning:
      'Dette erstatter alle dine nuværende madplaner med standard demodata. Handlingen kan ikke fortrydes.',
    confirmResetButton: 'Ja, nulstil til demo',
    resetSuccessToast: 'Databasen blev nulstillet til standard demo-data.',
    clearSuccessToast: 'Alle madplandata blev ryddet.',
    jsonCopiedToast: 'JSON kopieret til udklipsholder! Indsæt i en besked-app.',
    jsonCopyFailedToast: 'Kunne ikke kopiere til udklipsholder.',
    backupSharedToast: 'Backup delt!',
    backupShareFailedToast: 'Kunne ikke dele backup.',
    exportedToast: 'Madplandata blev eksporteret!',
    exportFailedToast: 'Kunne ikke eksportere backup-fil.',
    offlineCardTitle: 'Offline-klar Web-app',
    offlineCardSubtitle: 'Kører 100% lokalt i din browser uden ekstern lagring eller sporing.',

    // Import Modal
    importModalTitle: 'Importer madplan',
    importModalSubtitle: 'Indsæt JSON eller kopieret beskedtekst for at importere måltider',
    pasteFromClipboard: 'Indsæt fra udklipsholder',
    chooseBackupFile: 'Vælg backup-fil',
    pastedContentLabel: 'Indsat indhold',
    clearText: 'Ryd tekst',
    pastedTextPlaceholder:
      'Indsæt madplan-JSON eller beskedtekst her...\n\nEksempel:\nHer er min madplan:\n{\n  "weeks": [ ... ]\n}',
    validDataDetected: 'Gyldige madplandata fundet!',
    invalidData: 'Ugyldige eller ufuldstændige data',
    defaultInvalidDataMsg: 'Kontroller venligst, at den indsatte tekst indeholder gyldige madplandata.',
    weeksCountLabel: 'Uger',
    mealsCountLabel: 'Måltider',
    plannedLabel: 'planlagt',
    totalCostLabel: 'Samlet',
    importStrategyLabel: 'Importmetode',
    smartMerge: 'Smart fletning',
    smartMergeDesc: 'Fletter måltider ind i eksisterende uger uden at slette andre uger.',
    replaceAll: 'Erstat alt',
    replaceAllDesc: 'Overskriver din lokale database med de importerede data.',
    importTipTitle: 'Tip:',
    importTipDesc:
      'Når nogen sender dig en madplan via besked (WhatsApp, iMessage, SMS), skal du blot kopiere beskeden og trykke Indsæt fra udklipsholder herover. Samtaletekst ignoreres automatisk.',
    confirmImportButton: 'Importer madplandata',
    clipboardUnsupported:
      'Udklipsholderen understøttes ikke af din browser. Indsæt venligst direkte i tekstfeltet nedenfor.',
    clipboardEmpty: 'Udklipsholderen er tom. Kopiér en madplanbesked eller JSON først.',
    clipboardSuccess: 'Tekst indsat fra udklipsholder!',
    clipboardManualNotice:
      'Kunne ikke tilgå udklipsholderen automatisk. Hold fingeren nede eller højreklik for at indsætte i tekstfeltet.',
    fileLoaded: (name) => `Indlæste ${name}`,
    fileReadError: 'Kunne ikke læse den valgte fil.',
    importFailed: 'Kunne ikke importere madplandata.',
    importSuccessToast: (meals, weeks) =>
      `Importerede ${meals} planlagte måltider på tværs af ${weeks} uge(r)!`,
  },

  en: {
    // App & Navigation
    appTitle: 'Weekly Dinner',
    navPlanner: 'Planner',
    navAnalytics: 'Analytics',
    navSettings: 'Settings',
    weekLabel: (weekNumber, dateRange) => `Week ${weekNumber} (${dateRange})`,
    jumpToCurrentWeek: 'Click to jump to current week',
    prevWeek: 'Previous Week',
    nextWeek: 'Next Week',
    active: 'Active',
    cancel: 'Cancel',
    clear: 'Clear',
    add: 'Add',
    save: 'Save',
    close: 'Close',
    noData: 'No data',
    recommended: 'Recommended',

    // Days of Week
    days: {
      Monday: 'Monday',
      Tuesday: 'Tuesday',
      Wednesday: 'Wednesday',
      Thursday: 'Thursday',
      Friday: 'Friday',
      Saturday: 'Saturday',
      Sunday: 'Sunday',
    },
    daysShort: {
      Monday: 'Mon',
      Tuesday: 'Tue',
      Wednesday: 'Wed',
      Thursday: 'Thu',
      Friday: 'Fri',
      Saturday: 'Sat',
      Sunday: 'Sun',
    },

    // Planner View & Summary
    dailyDinners: 'Daily Dinners',
    mondayToSunday: 'Monday – Sunday',
    weeklyGroceryBudget: 'Weekly Grocery Budget',
    target: 'target',
    dinnersPlanned: 'Dinners Planned',
    budgetUsedPercent: (pct) => `${pct}% of budget used`,
    exceededBudget: 'Exceeded budget',
    budgetRemaining: (amount) => `${amount} remaining`,
    tipTapToEdit: 'Tip: Tap any meal card to edit',
    pastePlan: 'Paste Plan',
    copyToNextWeek: 'Copy to next week',
    copiedToNextWeek: (weekNumber) => `Current week copied to Week ${weekNumber}!`,
    copyFailed: 'Failed to copy week plan.',
    noDinnerPlanned: 'No dinner planned yet',
    ingredientCount: (count) => (count === 1 ? '1 ingredient' : `${count} ingredients`),
    noIngredientsListed: 'No ingredients listed',

    // Meal Edit Modal
    dinnerTitle: (day) => `${day} Dinner`,
    mealNameLabel: 'Meal / Course Name',
    mealNamePlaceholder: 'e.g. Spaghetti Bolognese',
    ideas: 'Ideas:',
    mealSuggestions: [
      'Spaghetti Bolognese',
      'Chicken Fajitas',
      'Homemade Pizza',
      'Chicken Stir Fry',
      'Salmon Bowls',
      'Steak & Potatoes',
      'Pasta Carbonara',
      'Chicken Salad',
      'Beef Chili',
      'Vegetable Curry',
    ],
    costLabel: 'Cost of Ingredients',
    ingredientsLabel: 'Ingredients List',
    itemCount: (count) => (count === 1 ? '1 item' : `${count} items`),
    addIngredientPlaceholder: 'Add ingredient (e.g. Minced beef)...',
    noIngredientsYet: 'No ingredients added yet.',
    notesLabel: 'Notes / Cook (Optional)',
    notesPlaceholder: 'e.g. Mom cooking, double recipe for leftovers',
    saveDinner: 'Save Dinner',

    // Analytics View
    analyticsTitle: 'Spending & Analytics',
    analyticsSubtitle: 'Historical overview of grocery spending trends',
    avgWeekly: 'Avg Weekly',
    acrossRecordedWeeks: 'Across recorded weeks',
    highestWeek: 'Highest Week',
    lowestWeek: 'Lowest Week',
    totalDinners: 'Total Dinners',
    plannedFamilyMeals: 'Planned family meals',
    spendingTrends: 'Spending Trends',
    spendingTrendsSubtitle: 'Total weekly expenses over time',
    chartBars: 'Bars',
    chartPills: 'Pills',
    chartSpent: 'Spent',
    chartBudget: 'Budget',
    weeklyHistory: 'Weekly Spending History',
    weeksRecorded: (count) => (count === 1 ? '1 week recorded' : `${count} weeks recorded`),
    dinnersCount: (planned) => `${planned}/7 dinners`,
    openInPlanner: 'Open in Weekly Planner',
    weekNumberLabel: (weekNumber, year) => `Week ${weekNumber}, ${year}`,

    // Settings View
    settingsTitle: 'Settings & Data',
    settingsSubtitle: 'Configure language, currency, and local storage backups',
    languageTitle: 'Language',
    languageSubtitle: 'Choose the language used throughout the app',
    languageDanish: 'Dansk',
    languageEnglish: 'English',
    languageUpdated: (lang) => `Language updated to ${lang}`,
    currencyTitle: 'Currency Preferences',
    selectCurrency: 'Select Currency',
    currencyPlacement: 'Placement',
    placementBefore: 'Before ($100)',
    placementAfter: 'After (100 kr.)',
    currencyUpdated: (symbol) => `Currency updated to ${symbol}`,
    budgetTargetTitle: 'Weekly Budget Target',
    budgetTargetSubtitle: 'Set a weekly spending target to track your grocery costs against.',
    saveTarget: 'Save Target',
    budgetUpdated: (amount) => `Weekly budget goal updated to ${amount}`,
    backupTitle: 'Backup & Data Portability',
    backupSubtitle:
      'Because this app runs 100% in your browser with zero external servers, your data is saved in localStorage. Export and share your backup to sync across devices, or import a backup from another device.',
    sharePlanButton: 'Share Plan (Text / Messaging)',
    copyJsonButton: 'Copy Backup JSON',
    downloadJsonButton: 'Download Backup File',
    importButton: 'Paste & Import Meal Plan (JSON)',
    clearDataButton: 'Clear All Data',
    resetDemoButton: 'Reset to Demo Sample Data',
    confirmClearTitle: 'Are you sure you want to clear all data? All planned meals and weeks will be deleted.',
    confirmClearWarning:
      'This will permanently delete all planned meals and historical data. Your preferences (currency and language) will be preserved. This cannot be undone.',
    confirmClearButton: 'Yes, Clear All',
    confirmResetTitle: 'Are you sure you want to reset? Current data will be replaced by demo samples.',
    confirmResetWarning:
      'This will replace all your current meal plans with sample data. This action cannot be undone.',
    confirmResetButton: 'Yes, Reset',
    resetSuccessToast: 'Database reset to default demo data.',
    clearSuccessToast: 'All data cleared. Starting fresh with an empty planner.',
    jsonCopiedToast: 'JSON copied to clipboard! Paste into messaging app.',
    jsonCopyFailedToast: 'Failed to copy to clipboard.',
    backupSharedToast: 'Backup shared successfully!',
    backupShareFailedToast: 'Failed to share backup.',
    exportedToast: 'Plan data exported successfully!',
    exportFailedToast: 'Failed to export backup file.',
    offlineCardTitle: 'Offline-Ready Static Web App',
    offlineCardSubtitle: 'Hosted statically on GitHub Pages with zero server tracking.',

    // Import Modal
    importModalTitle: 'Import Meal Plan Data',
    importModalSubtitle: 'Paste JSON or copied message text to import meals',
    pasteFromClipboard: 'Paste from Clipboard',
    chooseBackupFile: 'Choose Backup File',
    pastedContentLabel: 'Pasted Content',
    clearText: 'Clear text',
    pastedTextPlaceholder:
      'Paste meal plan JSON or text message here...\n\nExample:\nHere is my meal plan backup:\n{\n  "weeks": [ ... ]\n}',
    validDataDetected: 'Valid meal plan data detected!',
    invalidData: 'Invalid or incomplete data',
    defaultInvalidDataMsg: 'Please check that the pasted text includes valid JSON meal plan data.',
    weeksCountLabel: 'Weeks',
    mealsCountLabel: 'Meals',
    plannedLabel: 'planned',
    totalCostLabel: 'Total',
    importStrategyLabel: 'Import Strategy',
    smartMerge: 'Smart Merge',
    smartMergeDesc: 'Merges meals into existing weeks without deleting other weeks.',
    replaceAll: 'Replace All',
    replaceAllDesc: 'Overwrites your local database with the imported data.',
    importTipTitle: 'Tip:',
    importTipDesc:
      'When someone sends you a meal plan via text message (WhatsApp, iMessage, SMS), simply copy the message and tap Paste from Clipboard above. Conversational intro text is automatically ignored.',
    confirmImportButton: 'Import Plan Data',
    clipboardUnsupported:
      'Clipboard read access is not supported by your browser. Please paste directly into the box below.',
    clipboardEmpty: 'Clipboard is empty. Please copy a meal plan message or JSON first.',
    clipboardSuccess: 'Text pasted from clipboard!',
    clipboardManualNotice:
      'Could not access clipboard automatically. Please long-press or right-click to paste into the text box below.',
    fileLoaded: (name) => `Loaded ${name}`,
    fileReadError: 'Failed to read selected file.',
    importFailed: 'Failed to import meal plan data.',
    importSuccessToast: (meals, weeks) =>
      `Successfully imported ${meals} planned dinners across ${weeks} week(s)!`,
  },
};

