import { TranslationKeys, translations } from "@/i18n";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type TranslationPath = NestedKeyOf<TranslationKeys>;

export function useTranslation() {
  const currentLanguage = useSelector(
    (state: RootState) => state.language.currentLanguage
  );

  const t = (path: TranslationPath): string => {
    const keys = path.split(".") as (keyof TranslationKeys)[];
    let value: any = translations[currentLanguage];

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key as keyof typeof value];
      } else {
        // Fallback to Russian if key not found
        value = translations.ru;
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey as keyof typeof value];
          } else {
            return path; // Return path if translation not found
          }
        }
        break;
      }
    }

    return typeof value === "string" ? value : path;
  };

  return { t, currentLanguage };
}
