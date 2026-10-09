import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { useTranslation } from '../../i18n';
import { Language } from '../../types/planner';
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
  Languages,
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

  const { t, language, setLanguage } = useTranslation();

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

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    const langName = lang === 'da' ? t.languageDanish : t.languageEnglish;
    showNotification('success', t.languageUpdated(langName));
  };

  const handleModalImport = (rawText: string, mode: 'merge' | 'replace') => {
    const result = importData(rawText, mode);
    if (result.success && result.summary) {
      showNotification(
        'success',
        t.importSuccessToast(result.summary.totalMealsPlanned, result.summary.weekCount)
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
    showNotification('success', t.currencyUpdated(symbol));
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
      showNotification('success', t.budgetUpdated(parsed));
    }
  };

  // Copy JSON to clipboard
  const handleCopyJSON = async () => {
    try {
      const dataStr = exportData();
      await navigator.clipboard.writeText(dataStr);
      showNotification('success', t.jsonCopiedToast);
    } catch {
      showNotification('error', t.jsonCopyFailedToast);
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
          showNotification('success', t.backupSharedToast);
        } catch (shareErr) {
          // If file sharing fails, fall back to text sharing
          if ((shareErr as Error).name !== 'AbortError') {
            try {
              await navigator.share({
                title: 'madplan Meal Plan Backup',
                text: `Here is my meal plan backup:\n\n${dataStr}`,
              });
              showNotification('success', t.backupSharedToast);
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
    } catch {
      showNotification('error', t.backupShareFailedToast);
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
      showNotification('success', t.exportedToast);
    } catch {
      showNotification('error', t.exportFailedToast);
    }
  };

  // Handle Clear All Data
  const handleConfirmClear = () => {
    clearData();
    setConfirmClear(false);
    showNotification('success', t.clearSuccessToast);
  };

  // Handle Demo Reset
  const handleConfirmReset = () => {
    resetData();
    setConfirmReset(false);
    showNotification('success', t.resetSuccessToast);
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
          {t.settingsTitle}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {t.settingsSubtitle}
        </p>
      </div>

      {/* Language Switcher */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Languages className="w-4 h-4 text-brand-600" />
            {t.languageTitle}
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            {t.languageSubtitle}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleSelectLanguage('da')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
              language === 'da'
                ? 'bg-brand-500 text-white border-brand-500 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="text-sm">🇩🇰</span>
            <span>{t.languageDanish}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectLanguage('en')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-brand-500 text-white border-brand-500 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="text-sm">🇬🇧</span>
            <span>{t.languageEnglish}</span>
          </button>
        </div>
      </div>

      {/* Currency Preferences */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-brand-600" />
          {t.currencyTitle}
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">
            {t.selectCurrency}
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
          <span className="text-xs font-medium text-slate-600">{t.currencyPlacement}</span>
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
              {t.placementBefore}
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
              {t.placementAfter}
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
          {t.budgetTargetTitle}
        </h3>
        <p className="text-xs text-slate-500">
          {t.budgetTargetSubtitle}
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
            {t.saveTarget}
          </button>
        </div>
      </form>

      {/* Data Management & Backups */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          {t.backupTitle}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {t.backupSubtitle}
        </p>

        <div className="flex flex-col gap-2 pt-1">
          {/* Share Button (Primary) */}
          <button
            type="button"
            onClick={handleShareJSON}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            {t.sharePlanButton}
          </button>

          {/* Copy Button (Secondary) */}
          <button
            type="button"
            onClick={handleCopyJSON}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Copy className="w-4 h-4 text-slate-500" />
            {t.copyJsonButton}
          </button>

          {/* Download Button (Tertiary) */}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            {t.downloadJsonButton}
          </button>

          {/* Paste & Import Button */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-brand-50 hover:bg-brand-100 active:bg-brand-200 text-brand-700 border border-brand-200/90 rounded-xl text-xs font-bold transition-colors shadow-2xs"
          >
            <ClipboardPaste className="w-4 h-4 text-brand-600 shrink-0" />
            {t.importButton}
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
              {t.clearDataButton}
            </button>
          ) : (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 mt-1">
              <p className="text-xs text-rose-800 font-semibold">
                {t.confirmClearTitle}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleConfirmClear}
                  className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  {t.confirmClearButton}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
                >
                  {t.cancel}
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
              {t.resetDemoButton}
            </button>
          ) : (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 mt-1">
              <p className="text-xs text-rose-800 font-semibold">
                {t.confirmResetTitle}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  {t.confirmResetButton}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
                >
                  {t.cancel}
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
          <p className="font-bold">{t.offlineCardTitle}</p>
          <p className="text-[11px] text-brand-700">
            {t.offlineCardSubtitle}
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
