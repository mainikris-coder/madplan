import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { MealCard } from './MealCard';
import { MealEditModal } from './MealEditModal';
import { WeekSummaryBanner } from './WeekSummaryBanner';
import { DayOfWeek, DAYS_OF_WEEK, MealEntry } from '../../types/planner';

export const PlannerView: React.FC = () => {
  const {
    selectedWeek,
    settings,
    saveMeal,
    clearMeal,
    copyCurrentWeekToNext,
  } = usePlanner();

  const [editingDay, setEditingDay] = useState<DayOfWeek | null>(null);

  const currentEditingMeal: MealEntry | undefined = editingDay
    ? selectedWeek.meals.find((m) => m.day === editingDay)
    : undefined;

  const handleOpenEdit = (day: DayOfWeek) => {
    setEditingDay(day);
  };

  const handleCloseEdit = () => {
    setEditingDay(null);
  };

  return (
    <div className="space-y-4">
      {/* Weekly Budget Progress & Summary */}
      <WeekSummaryBanner
        week={selectedWeek}
        settings={settings}
        onCopyNextWeek={copyCurrentWeekToNext}
      />

      {/* Daily Meal Schedule (Monday to Sunday) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Daily Dinners
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">
            Monday – Sunday
          </span>
        </div>

        {DAYS_OF_WEEK.map((day) => {
          const meal = selectedWeek.meals.find((m) => m.day === day);
          return (
            <MealCard
              key={day}
              day={day}
              year={selectedWeek.year}
              weekNumber={selectedWeek.weekNumber}
              meal={meal}
              currencySymbol={settings.currencySymbol}
              currencyPosition={settings.currencyPosition}
              onEdit={() => handleOpenEdit(day)}
            />
          );
        })}
      </div>

      {/* Edit Meal Modal / Bottom Drawer */}
      {editingDay && (
        <MealEditModal
          isOpen={editingDay !== null}
          day={editingDay}
          year={selectedWeek.year}
          weekNumber={selectedWeek.weekNumber}
          meal={currentEditingMeal}
          currencySymbol={settings.currencySymbol}
          currencyPosition={settings.currencyPosition}
          onClose={handleCloseEdit}
          onSave={saveMeal}
          onClear={clearMeal}
        />
      )}
    </div>
  );
};

export default PlannerView;
