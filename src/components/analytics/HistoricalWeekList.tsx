import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, ArrowRight } from 'lucide-react';
import { WeekPlan, AppSettings } from '../../types/planner';
import { formatWeekDateRange } from '../../utils/dateUtils';

interface HistoricalWeekListProps {
  weeks: WeekPlan[];
  settings: AppSettings;
  currentSelectedWeekId: string;
  onSelectAndOpenPlanner: (weekId: string) => void;
}

export const HistoricalWeekList: React.FC<HistoricalWeekListProps> = ({
  weeks,
  settings,
  currentSelectedWeekId,
  onSelectAndOpenPlanner,
}) => {
  // Sort descending by year and weekNumber (newest first)
  const sortedWeeks = [...weeks].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.weekNumber - a.weekNumber;
  });

  const [expandedWeekId, setExpandedWeekId] = useState<string | null>(currentSelectedWeekId || null);

  const toggleExpand = (id: string) => {
    setExpandedWeekId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Weekly Spending History
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">
          {weeks.length} {weeks.length === 1 ? 'week recorded' : 'weeks recorded'}
        </span>
      </div>

      <div className="space-y-2">
        {sortedWeeks.map((week) => {
          const isExpanded = expandedWeekId === week.id;
          const isSelected = currentSelectedWeekId === week.id;
          const isOver = week.budgetGoal !== undefined && week.totalSpent > week.budgetGoal;
          const plannedCount = week.meals.filter((m) => m.course.trim().length > 0).length;

          const formattedTotal = settings.currencyPosition === 'prefix'
            ? `${settings.currencySymbol}${week.totalSpent.toFixed(2)}`
            : `${week.totalSpent.toFixed(2)} ${settings.currencySymbol}`;

          return (
            <div
              key={week.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-xs ${
                isSelected
                  ? 'border-brand-400 ring-1 ring-brand-200'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Header row / clickable accordion trigger */}
              <div
                onClick={() => toggleExpand(week.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand(week.id);
                  }
                }}
                className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border text-xs font-bold ${
                      isSelected
                        ? 'bg-brand-500 border-brand-500 text-white'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    W{week.weekNumber}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-800 leading-none">
                        Week {week.weekNumber}, {week.year}
                      </h4>
                      {isSelected && (
                        <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded-md border border-brand-200">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {formatWeekDateRange(week.year, week.weekNumber)} • {plannedCount}/7 dinners
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${
                      isOver
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-brand-50 text-brand-800 border-brand-200'
                    }`}
                  >
                    {formattedTotal}
                  </span>

                  <button
                    type="button"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Details Body */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 space-y-2.5 bg-slate-50/50">
                  {/* Meal list breakdown */}
                  <div className="space-y-1.5">
                    {week.meals.map((meal) => {
                      const mealCostFormatted = meal.cost > 0
                        ? settings.currencyPosition === 'prefix'
                          ? `${settings.currencySymbol}${meal.cost.toFixed(2)}`
                          : `${meal.cost.toFixed(2)} ${settings.currencySymbol}`
                        : null;

                      return (
                        <div
                          key={meal.id}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white border border-slate-200/60"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-bold text-slate-400 w-7 shrink-0 text-[11px]">
                              {meal.day.slice(0, 3)}
                            </span>
                            <span
                              className={`truncate font-medium ${
                                meal.course ? 'text-slate-800' : 'text-slate-400 italic'
                              }`}
                            >
                              {meal.course || 'No dinner planned'}
                            </span>
                          </div>

                          <span className="font-semibold text-slate-700 shrink-0 pl-2">
                            {mealCostFormatted || '–'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Open in Planner Action */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectAndOpenPlanner(week.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <span>Open in Weekly Planner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
