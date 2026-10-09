import React from 'react';
import { usePlanner } from '../../context/PlannerContext';
import { SpendingChart } from './SpendingChart';
import { HistoricalWeekList } from './HistoricalWeekList';
import { Wallet, TrendingUp, TrendingDown, Utensils } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const AnalyticsView: React.FC = () => {
  const {
    allWeeks,
    settings,
    selectedWeekId,
    selectWeek,
    setActiveTab,
  } = usePlanner();

  const { t } = useTranslation();

  // Compute Analytics Metrics
  const activeWeeks = allWeeks.filter((w) => w.totalSpent > 0);
  const totalSpendSum = allWeeks.reduce((sum, w) => sum + w.totalSpent, 0);
  const avgWeekly = activeWeeks.length > 0 ? totalSpendSum / activeWeeks.length : 0;

  // Highest spending week
  const highestWeek = allWeeks.length > 0
    ? [...allWeeks].sort((a, b) => b.totalSpent - a.totalSpent)[0]
    : null;

  // Lowest non-zero spending week
  const lowestWeek = activeWeeks.length > 0
    ? [...activeWeeks].sort((a, b) => a.totalSpent - b.totalSpent)[0]
    : null;

  // Total meals planned across history
  const totalMealsPlanned = allWeeks.reduce(
    (count, w) => count + w.meals.filter((m) => m.course.trim().length > 0).length,
    0
  );

  const formatAmount = (amt: number) => {
    return settings.currencyPosition === 'prefix'
      ? `${settings.currencySymbol}${amt.toFixed(2)}`
      : `${amt.toFixed(2)} ${settings.currencySymbol}`;
  };

  const handleOpenPlanner = (weekId: string) => {
    selectWeek(weekId);
    setActiveTab('planner');
  };

  return (
    <div className="space-y-4">
      {/* Title & context */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {t.analyticsTitle}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {t.analyticsSubtitle}
        </p>
      </div>

      {/* KPI Summary Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Average Weekly Spend */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Wallet className="w-3.5 h-3.5 text-brand-600" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {t.avgWeekly}
            </span>
          </div>
          <div>
            <p className="text-lg font-black text-slate-800 tracking-tight leading-none">
              {formatAmount(avgWeekly)}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{t.acrossRecordedWeeks}</p>
          </div>
        </div>

        {/* Highest Spend Week */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {t.highestWeek}
            </span>
          </div>
          <div>
            <p className="text-lg font-black text-slate-800 tracking-tight leading-none">
              {highestWeek ? formatAmount(highestWeek.totalSpent) : '–'}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              {highestWeek ? t.weekNumberLabel(highestWeek.weekNumber, highestWeek.year) : t.noData}
            </p>
          </div>
        </div>

        {/* Lowest Spend Week */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {t.lowestWeek}
            </span>
          </div>
          <div>
            <p className="text-lg font-black text-slate-800 tracking-tight leading-none">
              {lowestWeek ? formatAmount(lowestWeek.totalSpent) : '–'}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              {lowestWeek ? t.weekNumberLabel(lowestWeek.weekNumber, lowestWeek.year) : t.noData}
            </p>
          </div>
        </div>

        {/* Total Planned Meals */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Utensils className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {t.totalDinners}
            </span>
          </div>
          <div>
            <p className="text-lg font-black text-slate-800 tracking-tight leading-none">
              {totalMealsPlanned}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{t.plannedFamilyMeals}</p>
          </div>
        </div>
      </div>

      {/* Interactive Spending Chart */}
      <SpendingChart
        weeks={allWeeks}
        settings={settings}
        selectedWeekId={selectedWeekId}
        onSelectWeek={selectWeek}
      />

      {/* Historical Breakdown List */}
      <HistoricalWeekList
        weeks={allWeeks}
        settings={settings}
        currentSelectedWeekId={selectedWeekId}
        onSelectAndOpenPlanner={handleOpenPlanner}
      />
    </div>
  );
};

export default AnalyticsView;
