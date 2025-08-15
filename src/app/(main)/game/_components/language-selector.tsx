import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Locale, SUPPORTED_LANGUAGES } from "@/src/config/language";
import { setUserLocale } from "@/src/lib/locale";
import { useLocale } from "next-intl";

interface LanguageSelectorProps {
  triggerClassName?: string;
  contentClassName?: string;
  onLanguageChange?: (locale: Locale) => void;
}

export default function LanguageSelector({
  triggerClassName,
  contentClassName,
  onLanguageChange,
}: LanguageSelectorProps) {
  const locale = useLocale() as Locale;

  const handleLanguageChange = (value: string) => {
    const newLocale = value as Locale;
    setUserLocale(newLocale);
    onLanguageChange?.(newLocale);
  };

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className={`w-full ${triggerClassName}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className={` ${contentClassName}`}>
        {SUPPORTED_LANGUAGES.map(lang => (
          <SelectItem key={lang.value} value={lang.value}>
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
