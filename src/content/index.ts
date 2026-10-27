import { en } from "./en";
import { pt } from "./pt";
import type { Content, Locale } from "./types";

export const getContent = (locale: Locale): Content => (locale === "en" ? en : pt);
export type { Content, Locale } from "./types";
