import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import {
  Download,
  RotateCcw,
  Coins,
  ShieldCheck,
  Target,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Share2,
  Copy,
  ClipboardPaste,
  Trash2,
} from 'lucide-react';
import { ImportModal } from './ImportModal';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    selectedWeek,
    saveMeal,
    resetData,
    clearData,
    exportData,
    importData,
  } = usePlanner();

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [budgetInput, setBudgetInput] = useState<string>(
    (selectedWeek.budgetGoal || 850).toString()
  );
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleModalImport = (rawText: string, mode: 'merge' | 'replace') => {
    const result = importData(rawText, mode);
    if (result.success && result.summary) {
      showNotification(
        'success',
        `Successfully imported ${result.summary.totalMealsPlanned} planned dinners across ${result.summary.weekCount} week(s)!`
      );
    }
    return result;
  };

  // Currency selection
  const popularCurrencies = [
    { symbol: 'kr.', name: 'DKK (kr.)', pos: 'suffix' as const },
    { symbol: '€', name: 'EUR (€)', pos: 'prefix' as const },
    { symbol: '$', name: 'USD ($)', pos: 'prefix' as const },
    { symbol: '£', name: 'GBP (£)', pos: 'prefix' as const },
  ];

  const handleSelectCurrency = (symbol: string, pos: 'prefix' | 'suffix') => {
    updateSettings({
      currencySymbol: symbol,
      currencyPosition: pos,
    });
    showNotification('success', `Currency updated to ${symbol}`);
  };

  // Handle Budget Goal Save
  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(budgetInput);
    if (!isNaN(parsed) && parsed > 0) {
      // Update current week's budget goal
      selectedWeek.budgetGoal = parsed;
      // trigger save
      saveMeal(selectedWeek.meals[0]); // triggers week recalculation
      showNotification('success', `Weekly budget goal updated to ${parsed}`);
    }
  };

  // Copy JSON to clipboard
  const handleCopyJSON = async () => {
    try {
      const dataStr = exportData();
      await navigator.clipboard.writeText(dataStr);
      showNotification('success', 'JSON copied to clipboard! Paste into messaging app.');
    } catch {
      showNotification('error', 'Failed to copy to clipboard.');
    }
  };

  // Share via native Web Share API
  const handleShareJSON = async () => {
    try {
      const dataStr = exportData();
      const dateStr = new Date().toISOString().slice(0, 10);
      const fileName = `madplan-backup-${dateStr}.json`;

      // Check if Web Share API is available
      if (navigator.share) {
        try {
          // Try to share with file (mobile)
          const file = new File([dataStr], fileName, { type: 'application/json' });
          await navigator.share({
            title: 'madplan Meal Plan Backup',
            text: 'Here is my meal plan backup for syncing across devices:',
            files: [file],
          });
          showNotification('success', 'Backup shared successfully!');
        } catch (shareErr) {
          // If file sharing fails, fall back to text sharing
          if ((shareErr as Error).name !== 'AbortError') {
            try {
              await navigator.share({
                title: 'madplan Meal Plan Backup',
                text: `Here is my meal plan backup:\n\n${dataStr}`,
              });
              showNotification('success', 'Backup shared successfully!');
            } catch (textShareErr) {
              if ((textShareErr as Error).name !== 'AbortError') {
                // User cancelled, don't show error
              }
            }
          }
        }
      } else {
        // Fallback to copy if Web Share API not available
        handleCopyJSON();
      }
    } catch (err) {
      showNotification('error', 'Failed to share backup.');
    }
  };

  // Handle Export to JSON (download as file)
  const handleExport = () => {
    try {
      const dataStr = exportData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `madplan-backup-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('success', 'Plan data exported successfully!');
    } catch {
      showNotification('error', 'Failed to export backup file.');
    }
  };

  // Handle Clear All Data
  const handleConfirmClear = () => {
    clearData();
    setConfirmClear(false);
    showNotification('success', 'All meal plan data has been cleared.');
  };

  // Handle Demo Reset
  const handleConfirmReset = () => {
    resetData();
    setConfirmReset(false);
    showNotification('success', 'Database reset to default demo data.');
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div
          role="status"
          className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold shadow-md border animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Settings & Data
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure preferences, currencies, and local storage backups
        </p>
      </div>

      {/* Currency Preferences */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-brand-600" />
          Currency Preferences
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">
            Select Currency
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {popularCurrencies.map((curr) => {
              const isSelected =
                settings.currencySymbol === curr.symbol &&
                settings.currencyPosition === curr.pos;

              return (
                <button
                  key={curr.symbol}
                  type="button"
                  onClick={() => handleSelectCurrency(curr.symbol, curr.pos)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-brand-500 text-white border-brand-500 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {curr.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Currency Position Toggle */}
        <div className="pt-1 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600">Placement</span>
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => updateSettings({ currencyPosition: 'prefix' })}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                settings.currencyPosition === 'prefix'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Prefix ($100)
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ currencyPosition: 'suffix' })}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                settings.currencyPosition === 'suffix'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Suffix (100 kr.)
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Budget Goal */}
      <form
        onSubmit={handleSaveBudget}
        className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3"
      >
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Target className="w-4 h-4 text-brand-600" />
          Weekly Budget Target
        </h3>
        <p className="text-xs text-slate-500">
          Set a weekly spending target to track your grocery costs against.
        </p>

        <div className="flex gap-2">
          <div className="relative flex-1 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all">
            <input
              type="number"
              min="1"
              step="5"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white text-sm font-bold text-slate-800 focus:outline-hidden"
              placeholder="850"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Save Target
          </button>
        </div>
      </form>

      {/* Data Management & Backups */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          Backup & Data Portability
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Because this app runs 100% in your browser with zero external servers, your data is saved in <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">localStorage</code>. Export and share your backup to sync across devices, or import a backup from another device.
        </p>

        <div className="flex flex-col gap-2 pt-1">
          {/* Share Button (Primary) */}
          <button
            type="button"
            onClick={handleShareJSON}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            Share Backup via Messaging
          </button>

          {/* Copy Button (Secondary) */}
          <button
            type="button"
            onClick={handleCopyJSON}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Copy className="w-4 h-4 text-slate-500" />
            Copy Backup JSON
          </button>

          {/* Download Button (Tertiary) */}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Download Backup File
          </button>

          {/* Paste & Import Button */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-brand-50 hover:bg-brand-100 active:bg-brand-200 text-brand-700 border border-brand-200/90 rounded-xl text-xs font-bold transition-colors shadow-2xs"
          >
            <ClipboardPaste className="w-4 h-4 text-brand-600 shrink-0" />
            Paste & Import Meal Plan (JSON)
          </button>

          {/* Clear Data button with confirmation modal/state */}
          {!confirmClear ? (
            <button
              type="button"
              onClick={() => {
                setConfirmClear(true);
                setConfirmReset(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 text-rose-600 hover:bg-rose-50 active:bg-rose-100 rounded-xl text-xs font-semibold transition-colors border border-transparent hover:border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All Data
            </button>
          ) : (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 mt-1">
              <p className="text-xs text-rose-800 font-semibold">
                Are you sure you want to clear all data? All planned meals and weeks will be deleted.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleConfirmClear}
                  className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Yes, Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Reset button with confirmation modal/state */}
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => {
                setConfirmReset(true);
                setConfirmClear(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors border border-transparent hover:border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to Demo Sample Data
            </button>
          ) : (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 mt-1">
              <p className="text-xs text-rose-800 font-semibold">
                Are you sure you want to reset? Current data will be replaced by demo samples.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Yes, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* App Architecture & Info Card */}
      <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-100 flex items-center gap-3 text-xs text-brand-900">
        <Smartphone className="w-5 h-5 text-brand-600 shrink-0" />
        <div>
          <p className="font-bold">Offline-Ready Static Web App</p>
          <p className="text-[11px] text-brand-700">
            Hosted statically on GitHub Pages with zero server tracking.
          </p>
        </div>
      </div>

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

export default SettingsView;
