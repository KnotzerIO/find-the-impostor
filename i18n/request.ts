import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const locale = (await cookieStore).get("locale")?.value || "de";

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
