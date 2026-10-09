import React from 'react';
import { CalendarDays, BarChart3, Settings } from 'lucide-react';
import { NavigationTab } from '../../types/planner';
import { useTranslation } from '../../i18n';

interface BottomNavProps {
  activeTab: NavigationTab;
  onChangeTab: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
}) => {
  const { t } = useTranslation();

  const navItems = [
    {
      id: 'planner' as NavigationTab,
      label: t.navPlanner,
      icon: CalendarDays,
    },
    {
      id: 'analytics' as NavigationTab,
      label: t.navAnalytics,
      icon: BarChart3,
    },
    {
      id: 'settings' as NavigationTab,
      label: t.navSettings,
      icon: Settings,
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 pb-safe shadow-lg"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                isActive
                  ? 'text-brand-600 font-semibold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-brand-500 rounded-full" />
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[11px] leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
