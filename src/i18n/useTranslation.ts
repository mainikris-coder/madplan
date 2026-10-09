import { usePlanner } from '../context/PlannerContext';
import { translations, Language, TranslationStrings } from './translations';

export function useTranslation(): {
  t: TranslationStrings;
  language: Language;
  setLanguage: (lang: Language) => void;
} {
  const { settings, updateSettings } = usePlanner();
  const language: Language = settings.language === 'en' ? 'en' : 'da';
  const t = translations[language];

  const setLanguage = (lang: Language) => {
    updateSettings({ language: lang });
  };

  return { t, language, setLanguage };
}

