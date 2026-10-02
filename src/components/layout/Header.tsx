import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, DollarSign } from 'lucide-react';

interface HeaderProps {
  currentWeekText: string;
  totalSpent: number;
  currencySymbol: string;
  currencyPosition?: 'prefix' | 'suffix';
  budgetGoal?: number;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
  onCurrentWeek?: () => void;
  showWeekNav?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentWeekText,
  totalSpent,
  currencySymbol,
  currencyPosition = 'suffix',
  budgetGoal,
  onPrevWeek,
  onNextWeek,
  onCurrentWeek,
  showWeekNav = true,
}) => {
  const formattedSpend = currencyPosition === 'prefix'
    ? `${currencySymbol}${totalSpent.toFixed(2)}`
    : `${totalSpent.toFixed(2)} ${currencySymbol}`;

  const isOverBudget = budgetGoal !== undefined && totalSpent > budgetGoal;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
        {/* App Title & Current Week */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-sm">
            <span className="text-xl leading-none">🍲</span>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-tight">
              Weekly Dinner
            </h1>
            <button
              onClick={onCurrentWeek}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors"
              title="Click to jump to current week"
            >
              <Calendar className="w-3 h-3" />
              <span>{currentWeekText}</span>
            </button>
          </div>
        </div>

        {/* Right side: Week Stepper & Total Spent Chip */}
        <div className="flex items-center gap-2">
          {showWeekNav && (
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={onPrevWeek}
                aria-label="Previous Week"
                className="p-1.5 rounded-md hover:bg-white active:bg-slate-200 text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onNextWeek}
                aria-label="Next Week"
                className="p-1.5 rounded-md hover:bg-white active:bg-slate-200 text-slate-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Total Spent Badge */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-semibold text-xs transition-colors shadow-xs ${
              isOverBudget
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-brand-50 text-brand-800 border border-brand-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 opacity-70" />
            <span>{formattedSpend}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
