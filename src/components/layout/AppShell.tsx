import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { NavigationTab } from '../../types/planner';

interface AppShellProps {
  children: React.ReactNode;
  activeTab: NavigationTab;
  onChangeTab: (tab: NavigationTab) => void;
  currentWeekText: string;
  totalSpent: number;
  currencySymbol: string;
  currencyPosition?: 'prefix' | 'suffix';
  budgetGoal?: number;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
  onCurrentWeek?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeTab,
  onChangeTab,
  currentWeekText,
  totalSpent,
  currencySymbol,
  currencyPosition,
  budgetGoal,
  onPrevWeek,
  onNextWeek,
  onCurrentWeek,
}) => {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center selection:bg-brand-100">
      {/* Mobile container - full width on phones, constrained mobile frame on desktop */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 flex flex-col relative shadow-xl border-x border-slate-200/60">
        <Header
          currentWeekText={currentWeekText}
          totalSpent={totalSpent}
          currencySymbol={currencySymbol}
          currencyPosition={currencyPosition}
          budgetGoal={budgetGoal}
          onPrevWeek={onPrevWeek}
          onNextWeek={onNextWeek}
          onCurrentWeek={onCurrentWeek}
          showWeekNav={activeTab === 'planner'}
        />

        <main className="flex-1 px-4 py-4 pb-24 overflow-y-auto">
          {children}
        </main>

        <BottomNav activeTab={activeTab} onChangeTab={onChangeTab} />
      </div>
    </div>
  );
};
