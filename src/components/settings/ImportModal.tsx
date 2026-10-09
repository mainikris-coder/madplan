import React, { useState, useRef, useMemo } from 'react';
import {
  X,
  ClipboardPaste,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { extractAndParseMealData, ImportSummary } from '../../services/importParser';
import { useTranslation } from '../../i18n';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (
    rawText: string,
    mode: 'merge' | 'replace'
  ) => { success: boolean; error?: string; summary?: ImportSummary };
  currencySymbol: string;
  currencyPosition?: 'prefix' | 'suffix';
  currentWeekDetails?: { year: number; weekNumber: number };
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  currencySymbol,
  currencyPosition = 'prefix',
  currentWeekDetails,
}) => {
  const { t } = useTranslation();
  const [pastedText, setPastedText] = useState('');
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Live parsing and validation of whatever text is entered
  const parseResult = useMemo(() => {
    if (!pastedText.trim()) return null;
    return extractAndParseMealData(pastedText, currentWeekDetails);
  }, [pastedText, currentWeekDetails]);

  if (!isOpen) return null;

  // Handle direct paste from clipboard using browser Clipboard API
  const handlePasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        showToast('info', t.clipboardUnsupported);
        textareaRef.current?.focus();
        return;
      }

      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        showToast('error', t.clipboardEmpty);
        return;
      }

      setPastedText(text);
      showToast('success', t.clipboardSuccess);
    } catch {
      showToast('info', t.clipboardManualNotice);
      textareaRef.current?.focus();
    }
  };

  // Handle choosing a JSON file as an alternative
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPastedText(content);
        showToast('success', t.fileLoaded(file.name));
      }
    };
    reader.onerror = () => {
      showToast('error', t.fileReadError);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClear = () => {
    setPastedText('');
    setToastMessage(null);
    textareaRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim() || !parseResult || !parseResult.success) return;

    const result = onImport(pastedText, importMode);
    if (result.success) {
      onClose();
    } else {
      showToast('error', result.error || t.importFailed);
    }
  };

  const formatCost = (val: number) => {
    return currencyPosition === 'prefix'
      ? `${currencySymbol}${val.toFixed(2)}`
      : `${val.toFixed(2)} ${currencySymbol}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-in slide-in-from-bottom duration-300 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200/80 text-brand-600 flex items-center justify-center shadow-2xs">
              <ClipboardPaste className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="import-modal-title"
                className="text-base font-bold text-slate-800 leading-tight"
              >
                {t.importModalTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {t.importModalSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-4 overflow-y-auto overscroll-contain flex-1">
          {/* Toast / Notification */}
          {toastMessage && (
            <div
              role="status"
              className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold shadow-xs border animate-in fade-in duration-150 ${
                toastMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : toastMessage.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}
            >
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : toastMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              )}
              <span className="flex-1">{toastMessage.text}</span>
            </div>
          )}

          {/* Quick Paste & Upload Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-brand-50 hover:bg-brand-100 active:bg-brand-200 text-brand-700 border border-brand-200/90 rounded-xl text-xs font-bold transition-all shadow-2xs"
            >
              <ClipboardPaste className="w-4 h-4 text-brand-600 shrink-0" />
              {t.pasteFromClipboard}
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all shadow-2xs"
            >
              <Upload className="w-4 h-4 text-slate-500 shrink-0" />
              {t.chooseBackupFile}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json,text/plain"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Textarea Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="pasted-json-input"
                className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                {t.pastedContentLabel}
              </label>
              {pastedText.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                >
                  {t.clearText}
                </button>
              )}
            </div>

            <div className="relative">
              <textarea
                id="pasted-json-input"
                ref={textareaRef}
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={t.pastedTextPlaceholder}
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-800 text-xs font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all resize-y min-h-[110px] max-h-[220px]"
              />
            </div>
          </div>

          {/* Live Validation & Preview Banner */}
          {pastedText.trim().length > 0 && (
            <div>
              {parseResult && parseResult.success ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-emerald-900">
                      {t.validDataDetected}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-emerald-200/60 text-center">
                    <div className="bg-white/80 rounded-lg p-1.5 border border-emerald-200/50">
                      <span className="block text-[10px] font-medium text-slate-500 uppercase">
                        {t.weeksCountLabel}
                      </span>
                      <span className="text-xs font-bold text-emerald-800">
                        {parseResult.summary.weekCount}
                      </span>
                    </div>

                    <div className="bg-white/80 rounded-lg p-1.5 border border-emerald-200/50">
                      <span className="block text-[10px] font-medium text-slate-500 uppercase">
                        {t.mealsCountLabel}
                      </span>
                      <span className="text-xs font-bold text-emerald-800">
                        {parseResult.summary.totalMealsPlanned} {t.plannedLabel}
                      </span>
                    </div>

                    <div className="bg-white/80 rounded-lg p-1.5 border border-emerald-200/50">
                      <span className="block text-[10px] font-medium text-slate-500 uppercase">
                        {t.totalCostLabel}
                      </span>
                      <span className="text-xs font-bold text-emerald-800">
                        {formatCost(parseResult.summary.totalCost)}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-700 font-medium">
                    {parseResult.summary.weekIds.join(', ')}
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="text-xs font-bold text-rose-900">
                      {t.invalidData}
                    </span>
                  </div>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    {parseResult && !parseResult.success
                      ? parseResult.error
                      : t.defaultInvalidDataMsg}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Import Strategy Options (only show when valid data detected) */}
          {parseResult && parseResult.success && (
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                {t.importStrategyLabel}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setImportMode('merge')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    importMode === 'merge'
                      ? 'bg-white border-brand-500 ring-2 ring-brand-500/20 shadow-xs'
                      : 'bg-white/60 border-slate-200 hover:bg-white text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-slate-800">
                      {t.smartMerge}
                    </span>
                    <span className="text-[10px] bg-brand-50 text-brand-700 font-bold px-1.5 py-0.2 rounded">
                      {t.recommended}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {t.smartMergeDesc}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setImportMode('replace')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    importMode === 'replace'
                      ? 'bg-white border-brand-500 ring-2 ring-brand-500/20 shadow-xs'
                      : 'bg-white/60 border-slate-200 hover:bg-white text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-slate-800">
                      {t.replaceAll}
                    </span>
                    <RefreshCw className="w-3 h-3 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {t.replaceAllDesc}
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Helpful Tip */}
          {pastedText.trim().length === 0 && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="font-semibold text-slate-700">{t.importTipTitle}</strong>{' '}
                {t.importTipDesc}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-2xs"
          >
            {t.cancel}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!parseResult || !parseResult.success}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs flex items-center gap-1.5 ${
              parseResult && parseResult.success
                ? 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 cursor-pointer'
                : 'bg-slate-300 cursor-not-allowed text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {t.confirmImportButton}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ImportModal;
