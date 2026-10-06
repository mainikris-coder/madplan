import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { MealCard } from './MealCard';
import { MealEditModal } from './MealEditModal';
import { WeekSummaryBanner } from './WeekSummaryBanner';
import { ImportModal } from '../settings/ImportModal';
import { DayOfWeek, DAYS_OF_WEEK, MealEntry } from '../../types/planner';
import { CheckCircle2 } from 'lucide-react';

export const PlannerView: React.FC = () => {
  const {
    selectedWeek,
    settings,
    saveMeal,
    clearMeal,
    copyCurrentWeekToNext,
    importData,
  } = usePlanner();

  const [editingDay, setEditingDay] = useState<DayOfWeek | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const currentEditingMeal: MealEntry | undefined = editingDay
    ? selectedWeek.meals.find((m) => m.day === editingDay)
    : undefined;

  const handleOpenEdit = (day: DayOfWeek) => {
    setEditingDay(day);
  };

  const handleCloseEdit = () => {
    setEditingDay(null);
  };

  const handleModalImport = (rawText: string, mode: 'merge' | 'replace') => {
    const result = importData(rawText, mode);
    if (result.success && result.summary) {
      showToast(
        `Imported ${result.summary.totalMealsPlanned} planned dinners across ${result.summary.weekCount} week(s)!`
      );
    }
    return result;
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="flex items-center gap-2 p-3 rounded-xl text-xs font-semibold shadow-md border bg-emerald-50 text-emerald-800 border-emerald-200 animate-in fade-in duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Weekly Budget Progress & Summary */}
      <WeekSummaryBanner
        week={selectedWeek}
        settings={settings}
        onCopyNextWeek={copyCurrentWeekToNext}
        onOpenImport={() => setIsImportModalOpen(true)}
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

      {/* Paste & Import Modal */}
      {isImportModalOpen && (
        <ImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleModalImport}
          currencySymbol={settings.currencySymbol}
          currencyPosition={settings.currencyPosition}
          currentWeekDetails={{
            year: selectedWeek.year,
            weekNumber: selectedWeek.weekNumber,
          }}
        />
      )}
    </div>
  );
};

export default PlannerView;
