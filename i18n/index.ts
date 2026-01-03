import { ru } from "./locales/ru";
import { be } from "./locales/be";
import { en } from "./locales/en";

export type Language = "ru" | "be" | "en";

export const translations = {
  ru,
  be,
  en,
};

export type TranslationKeys = typeof ru;

