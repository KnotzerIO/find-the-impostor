import { Locale, SUPPORTED_LANGUAGES } from "@/src/config/language";
import { getUserLocale } from "@/src/lib/locale";
import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

const supportedLocales = SUPPORTED_LANGUAGES.map(lang => lang.value);

async function getPreferredLocale(): Promise<Locale> {
  try {
    const headersList = await headers();
    const acceptLanguage = headersList.get("accept-language");

    if (acceptLanguage) {
      // Parse Accept-Language header (z.B. "en-US,en;q=0.9,de;q=0.8")
      const languages = acceptLanguage
        .split(",")
        .map(lang => {
          const [code, quality] = lang.split(";q=");
          return {
            code: code.trim().split("-")[0], // "en-US" -> "en"
            quality: quality ? parseFloat(quality) : 1.0,
          };
        })
        .sort((a, b) => b.quality - a.quality);

      for (const lang of languages) {
        if (supportedLocales.includes(lang.code as Locale)) {
          return lang.code as Locale;
        }
      }
    }
  } catch (error) {
    console.log("Could not detect browser language:", error);
  }

  return "en";
}

export default getRequestConfig(async () => {
  const locale = (await getUserLocale()) || (await getPreferredLocale());

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
