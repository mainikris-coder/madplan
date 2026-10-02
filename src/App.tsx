import React from 'react';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import { AppShell } from './components/layout/AppShell';
import { PlannerView } from './components/planner/PlannerView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { formatWeekDateRange } from './utils/dateUtils';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedWeek,
    settings,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  } = usePlanner();

  const currentWeekText = `Week ${selectedWeek.weekNumber} (${formatWeekDateRange(
    selectedWeek.year,
    selectedWeek.weekNumber
  )})`;

  return (
    <AppShell
      activeTab={activeTab}
      onChangeTab={setActiveTab}
      currentWeekText={currentWeekText}
      totalSpent={selectedWeek.totalSpent}
      currencySymbol={settings.currencySymbol}
      currencyPosition={settings.currencyPosition}
      budgetGoal={selectedWeek.budgetGoal}
      onPrevWeek={goToPreviousWeek}
      onNextWeek={goToNextWeek}
      onCurrentWeek={goToCurrentWeek}
    >
      {activeTab === 'planner' && <PlannerView />}
      {activeTab === 'analytics' && <AnalyticsView />}
      {activeTab === 'settings' && <SettingsView />}
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <PlannerProvider>
      <AppContent />
    </PlannerProvider>
  );
};

export default App;
