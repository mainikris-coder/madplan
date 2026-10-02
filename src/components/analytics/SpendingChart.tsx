import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Cell,
} from 'recharts';
import { WeekPlan, AppSettings } from '../../types/planner';
import { formatWeekDateRange } from '../../utils/dateUtils';

interface SpendingChartProps {
  weeks: WeekPlan[];
  settings: AppSettings;
  selectedWeekId: string;
  onSelectWeek: (weekId: string) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      weekId: string;
      weekLabel: string;
      dateRange: string;
      totalSpent: number;
      budgetGoal: number;
      meals: Array<{ day: string; course: string; cost: number }>;
    };
  }>;
  currencySymbol: string;
  currencyPosition?: 'prefix' | 'suffix';
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  currencySymbol,
  currencyPosition = 'prefix',
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formattedSpent = currencyPosition === 'prefix'
      ? `${currencySymbol}${data.totalSpent.toFixed(2)}`
      : `${data.totalSpent.toFixed(2)} ${currencySymbol}`;

    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-3 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1 z-50 pointer-events-none">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1">
          <span className="font-bold text-slate-200">{data.weekLabel}</span>
          <span className="text-[10px] text-slate-400">{data.dateRange}</span>
        </div>
        <div className="flex items-center justify-between gap-3 pt-0.5">
          <span className="text-slate-400">Total Spent:</span>
          <span className="font-bold text-brand-400 text-sm">{formattedSpent}</span>
        </div>
        {data.meals && data.meals.filter((m) => m.course).length > 0 && (
          <div className="pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
            <span className="text-slate-300 font-medium">Planned: </span>
            {data.meals
              .filter((m) => m.course)
              .slice(0, 3)
              .map((m) => m.course)
              .join(', ')}
            {data.meals.filter((m) => m.course).length > 3 ? '…' : ''}
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const SpendingChart: React.FC<SpendingChartProps> = ({
  weeks,
  settings,
  selectedWeekId,
  onSelectWeek,
}) => {
  const [chartType, setChartType] = useState<'bar' | 'trend'>('bar');

  const chartData = weeks.map((w) => ({
    weekId: w.id,
    weekLabel: `W${w.weekNumber}`,
    dateRange: formatWeekDateRange(w.year, w.weekNumber),
    totalSpent: w.totalSpent,
    budgetGoal: w.budgetGoal || 150,
    meals: w.meals,
  }));

  const maxBudget = Math.max(...weeks.map((w) => w.budgetGoal || 150), 150);

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Spending Trends
          </h3>
          <p className="text-[11px] text-slate-400">
            Total weekly expenses over time
          </p>
        </div>

        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              chartType === 'bar'
                ? 'bg-white text-slate-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Bars
          </button>
          <button
            type="button"
            onClick={() => setChartType('trend')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              chartType === 'trend'
                ? 'bg-white text-slate-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pills
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-56 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onClick={(state) => {
              if (state && state.activePayload && state.activePayload.length) {
                const clickedWeekId = state.activePayload[0].payload.weekId;
                if (clickedWeekId) onSelectWeek(clickedWeekId);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="weekLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(241, 245, 249, 0.8)', radius: 8 }}
              content={
                <CustomTooltip
                  currencySymbol={settings.currencySymbol}
                  currencyPosition={settings.currencyPosition}
                />
              }
            />
            <ReferenceLine
              y={maxBudget}
              stroke="#fb7185"
              strokeDasharray="4 4"
              label={{
                value: 'Target Budget',
                fill: '#f43f5e',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />
            <Bar
              dataKey="totalSpent"
              radius={chartType === 'bar' ? [6, 6, 0, 0] : [99, 99, 99, 99]}
              barSize={20}
              className="cursor-pointer transition-all duration-200"
            >
              {chartData.map((entry) => {
                const isSelected = entry.weekId === selectedWeekId;
                const isOver = entry.totalSpent > entry.budgetGoal;
                const fillColor = isSelected
                  ? '#059669' // brand-600 active highlight
                  : isOver
                  ? '#f43f5e' // rose
                  : '#10b981'; // emerald
                return <Cell key={`cell-${entry.weekId}`} fill={fillColor} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & quick helper */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Within budget
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            Over budget
          </span>
        </div>
        <span className="italic text-[10px]">Tap bar to inspect week</span>
      </div>
    </div>
  );
};
