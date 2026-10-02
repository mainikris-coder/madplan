import React from 'react';
import { Copy, Sparkles, CheckCircle2 } from 'lucide-react';
import { WeekPlan, AppSettings } from '../../types/planner';

interface WeekSummaryBannerProps {
  week: WeekPlan;
  settings: AppSettings;
  onCopyNextWeek: () => void;
}

export const WeekSummaryBanner: React.FC<WeekSummaryBannerProps> = ({
  week,
  settings,
  onCopyNextWeek,
}) => {
  const plannedCount = week.meals.filter((m) => m.course.trim().length > 0).length;
  const budget = week.budgetGoal || 150;
  const percentage = Math.min(Math.round((week.totalSpent / budget) * 100), 100);
  const isOverBudget = week.totalSpent > budget;

  const formattedSpent = settings.currencyPosition === 'prefix'
    ? `${settings.currencySymbol}${week.totalSpent.toFixed(2)}`
    : `${week.totalSpent.toFixed(2)} ${settings.currencySymbol}`;

  const formattedBudget = settings.currencyPosition === 'prefix'
    ? `${settings.currencySymbol}${budget.toFixed(2)}`
    : `${budget.toFixed(2)} ${settings.currencySymbol}`;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
      {/* Top metrics row */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Weekly Grocery Budget
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className={`text-lg font-black tracking-tight ${isOverBudget ? 'text-rose-600' : 'text-slate-900'}`}>
              {formattedSpent}
            </span>
            <span className="text-xs font-medium text-slate-400">
              / {formattedBudget} target
            </span>
          </div>
        </div>

        {/* Days planned indicator */}
        <div className="text-right">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Dinners Planned
          </span>
          <div className="flex items-center justify-end gap-1 mt-0.5">
            <span className="text-sm font-bold text-slate-800">
              {plannedCount} / 7
            </span>
            {plannedCount === 7 && (
              <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isOverBudget
                ? 'bg-rose-500'
                : percentage > 85
                ? 'bg-amber-500'
                : 'bg-brand-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>{percentage}% of budget used</span>
          {isOverBudget ? (
            <span className="text-rose-600 font-semibold">Exceeded budget</span>
          ) : (
            <span>
              {settings.currencyPosition === 'prefix'
                ? `${settings.currencySymbol}${(budget - week.totalSpent).toFixed(2)}`
                : `${(budget - week.totalSpent).toFixed(2)} ${settings.currencySymbol}`}{' '}
              remaining
            </span>
          )}
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-100">
        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Tip: Tap any meal card to edit
        </span>

        <button
          type="button"
          onClick={onCopyNextWeek}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-brand-700 bg-slate-100 hover:bg-brand-50 px-2.5 py-1 rounded-lg transition-colors border border-slate-200/60"
          title="Clone this schedule to next week"
        >
          <Copy className="w-3 h-3" />
          Copy to next week
        </button>
      </div>
    </div>
  );
};
