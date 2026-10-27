import { useCallback, useEffect, useState } from "react";
import { getContent } from "../content";
import type { Locale } from "../content/types";

export const SUPPORTED_LOCALES: Locale[] = ["pt", "en"];
export const LOCALE_STORAGE_KEY = "curriculo-locale";

const normalize = (value: string): Locale | null => {
  const base = value.trim().toLowerCase().split(/[-_;]/)[0];
  return base === "pt" || base === "en" ? base : null;
};

const fromQuery = (search: string): Locale | null => {
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  const value = params.get("lang");
  return value ? normalize(value) : null;
};

export const resolveLocale = (
  search: string,
  stored: string | null,
  browserLanguage: string,
): Locale => {
  return (
    fromQuery(search) ??
    (stored ? normalize(stored) : null) ??
    (browserLanguage ? normalize(browserLanguage) : null) ??
    "pt"
  );
};

const initialLocale = (): Locale =>
  resolveLocale(
    window.location.search,
    window.localStorage.getItem(LOCALE_STORAGE_KEY),
    typeof navigator === "undefined" ? "" : navigator.language,
  );

export const useLocale = (): [Locale, (locale: Locale) => void] => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const content = getContent(locale);
    const description = document.querySelector('meta[name="description"]');

    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
    document.title = content.meta.title;
    description?.setAttribute("content", content.meta.description);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  return [locale, setLocale];
};
