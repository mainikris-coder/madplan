import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, Plus, Check, Coins, Sparkles } from 'lucide-react';
import { MealEntry, DayOfWeek, IngredientItem } from '../../types/planner';
import { getDateLabelForDay } from '../../utils/dateUtils';

interface MealEditModalProps {
  isOpen: boolean;
  day: DayOfWeek;
  year: number;
  weekNumber: number;
  meal?: MealEntry;
  currencySymbol: string;
  currencyPosition?: 'prefix' | 'suffix';
  onClose: () => void;
  onSave: (meal: MealEntry) => void;
  onClear: (day: DayOfWeek) => void;
}

const POPULAR_MEAL_SUGGESTIONS = [
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
];

export const MealEditModal: React.FC<MealEditModalProps> = ({
  isOpen,
  day,
  year,
  weekNumber,
  meal,
  currencySymbol,
  currencyPosition = 'prefix',
  onClose,
  onSave,
  onClear,
}) => {
  const [course, setCourse] = useState('');
  const [cost, setCost] = useState<string>('');
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [notes, setNotes] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state when modal opens or meal changes
  useEffect(() => {
    if (isOpen) {
      if (meal) {
        setCourse(meal.course || '');
        setCost(meal.cost > 0 ? meal.cost.toString() : '');
        setIngredients(meal.ingredients ? [...meal.ingredients] : []);
        setNotes(meal.notes || '');
      } else {
        setCourse('');
        setCost('');
        setIngredients([]);
        setNotes('');
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, meal]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const dateLabel = getDateLabelForDay(year, weekNumber, day);

  const handleAddIngredient = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newIngredient.trim();
    if (!trimmed) return;

    const newItem: IngredientItem = {
      id: `ing-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      isPurchased: false,
    };
    setIngredients([...ingredients, newItem]);
    setNewIngredient('');
  };

  const handleToggleIngredient = (id: string) => {
    setIngredients(
      ingredients.map((item) =>
        item.id === id ? { ...item, isPurchased: !item.isPurchased } : item
      )
    );
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };

  const handleSelectSuggestion = (suggested: string) => {
    setCourse(suggested);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCost = parseFloat(cost) || 0;
    const updatedMeal: MealEntry = {
      id: meal?.id || `meal-${Date.now()}`,
      day,
      course: course.trim(),
      cost: parsedCost,
      ingredients,
      notes: notes.trim() || undefined,
    };
    onSave(updatedMeal);
    onClose();
  };

  const handleClear = () => {
    onClear(day);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="meal-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal / Bottom Sheet Box */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden z-10 animate-in slide-in-from-bottom duration-200">
        {/* Top Drag Indicator for mobile */}
        <div className="flex justify-center pt-2 sm:hidden">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-slate-100">
          <div>
            <h2 id="meal-modal-title" className="text-base font-bold text-slate-900">
              {day} Dinner
            </h2>
            <p className="text-xs text-slate-500 font-medium">{dateLabel}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Meal Name Input */}
          <div>
            <label htmlFor="course-name" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Meal / Course Name
            </label>
            <input
              ref={inputRef}
              id="course-name"
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. Spaghetti Bolognese"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
            />

            {/* Quick suggestions */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0 font-medium">
                <Sparkles className="w-3 h-3 text-amber-500" /> Ideas:
              </span>
              {POPULAR_MEAL_SUGGESTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelectSuggestion(item)}
                  className="shrink-0 text-[11px] font-medium bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 px-2 py-0.5 rounded-md transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Cost Input */}
          <div>
            <label htmlFor="meal-cost" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Cost of Ingredients
            </label>
            <div className="relative rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                {currencyPosition === 'prefix' ? currencySymbol : <Coins className="w-4 h-4" />}
              </div>
              <input
                id="meal-cost"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-12 py-2.5 rounded-xl bg-white text-sm font-semibold text-slate-800 focus:outline-hidden"
              />
              {currencyPosition === 'suffix' && (
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                  {currencySymbol}
                </div>
              )}
            </div>
          </div>

          {/* Ingredients Section */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Ingredients List
              </label>
              <span className="text-[11px] text-slate-400">
                {ingredients.length} items
              </span>
            </div>

            {/* Add ingredient input */}
            <div className="flex gap-2 mb-2.5">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIngredient();
                  }
                }}
                placeholder="Add ingredient (e.g. Minced beef)..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={() => handleAddIngredient()}
                disabled={!newIngredient.trim()}
                className="px-3 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {/* Ingredient list items */}
            {ingredients.length > 0 ? (
              <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {ingredients.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleIngredient(item.id)}
                      className="flex items-center gap-2 text-left flex-1 min-w-0"
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          item.isPurchased
                            ? 'bg-brand-500 border-brand-500 text-white'
                            : 'border-slate-300 bg-white text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span
                        className={`truncate ${
                          item.isPurchased
                            ? 'line-through text-slate-400'
                            : 'text-slate-700 font-medium'
                        }`}
                      >
                        {item.name}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] text-slate-400 italic">No ingredients added yet.</p>
            )}
          </div>

          {/* Optional Notes */}
          <div>
            <label htmlFor="meal-notes" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Notes / Cook (Optional)
            </label>
            <input
              id="meal-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Mom cooking, double recipe for leftovers"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Actions Footer */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
            {meal && meal.course ? (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-colors"
              >
                Save Dinner
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
