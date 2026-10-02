import React from 'react';
import { Plus, Edit2, ShoppingBag, Utensils } from 'lucide-react';
import { MealEntry, DayOfWeek } from '../../types/planner';
import { getDateLabelForDay } from '../../utils/dateUtils';

interface MealCardProps {
  day: DayOfWeek;
  year: number;
  weekNumber: number;
  meal?: MealEntry;
  currencySymbol: string;
  currencyPosition?: 'prefix' | 'suffix';
  onEdit: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  day,
  year,
  weekNumber,
  meal,
  currencySymbol,
  currencyPosition = 'prefix',
  onEdit,
}) => {
  const hasMeal = Boolean(meal && meal.course.trim().length > 0);
  const dateLabel = getDateLabelForDay(year, weekNumber, day);

  const formattedCost = meal && meal.cost > 0
    ? currencyPosition === 'prefix'
      ? `${currencySymbol}${meal.cost.toFixed(2)}`
      : `${meal.cost.toFixed(2)} ${currencySymbol}`
    : null;

  return (
    <article
      onClick={onEdit}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEdit();
        }
      }}
      className={`group relative w-full text-left rounded-2xl p-3.5 border transition-all cursor-pointer shadow-xs active:scale-[0.99] select-none ${
        hasMeal
          ? 'bg-white border-slate-200/90 hover:border-brand-300 hover:shadow-md'
          : 'bg-slate-50/80 border-dashed border-slate-200 hover:bg-white hover:border-brand-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Day Badge & Info */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Day pill */}
          <div
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border transition-colors ${
              hasMeal
                ? 'bg-brand-50 border-brand-200 text-brand-900'
                : 'bg-white border-slate-200 text-slate-400 group-hover:border-brand-200 group-hover:text-brand-600'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-tight">
              {day.slice(0, 3)}
            </span>
            <span className="text-[10px] text-slate-500 font-medium leading-none">
              {dateLabel}
            </span>
          </div>

          {/* Meal Details or Empty State */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {day}
              </span>
            </div>

            {hasMeal ? (
              <div>
                <h3 className="text-sm font-bold text-slate-800 truncate leading-snug">
                  {meal!.course}
                </h3>

                {/* Ingredients count & preview */}
                {meal!.ingredients && meal!.ingredients.length > 0 ? (
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                      <ShoppingBag className="w-3 h-3 text-slate-400" />
                      {meal!.ingredients.length} {meal!.ingredients.length === 1 ? 'ingredient' : 'ingredients'}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[160px]">
                      {meal!.ingredients.map((i) => i.name).slice(0, 2).join(', ')}
                      {meal!.ingredients.length > 2 ? '…' : ''}
                    </span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic mt-0.5">No ingredients listed</p>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-brand-600 transition-colors py-1">
                <Utensils className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">No dinner planned yet</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Cost & Edit affordance */}
        <div className="flex flex-col items-end justify-between h-12 shrink-0">
          {hasMeal ? (
            <>
              {formattedCost && (
                <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200/80 px-2 py-0.5 rounded-lg shadow-2xs">
                  {formattedCost}
                </span>
              )}
              <span className="text-slate-300 group-hover:text-brand-500 transition-colors">
                <Edit2 className="w-3.5 h-3.5" />
              </span>
            </>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all shadow-2xs">
              <Plus className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
