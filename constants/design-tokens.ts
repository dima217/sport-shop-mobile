import { Platform } from "react-native";

export const Colors = {
  primary: "#4CAF50", // Красивый зеленый primary
  primaryDark: "#388E3C", // Темнее для акцентов
  primaryLight: "#81C784", // Светлее для hover состояний
  text: "#212121", // Темный текст на светлом фоне
  textSecondary: "#757575", // Вторичный текст
  secondary: "#9E9E9E",
  inactive: "#E0E0E0", // Светло-серый для неактивных элементов
  background: "#FFFFFF", // Белый фон
  backgroundSecondary: "#F5F5F5", // Светло-серый фон
  tab: "#FAFAFA", // Светлый для табов
  border: "#E0E0E0", // Светлая граница
  gradient: ["#E8F5E9", "#C8E6C9"] as const, // Светлый зеленый градиент
  reject: "#F44336", // Красный для ошибок
  // Константы для TextInput
  GREY: "#757575",
  INPUT_LINE: "#E0E0E0",
  REJECT: "#F44336",
  LIGHT_GREY: "#F5F5F5",
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const FONT_SIZES = {
  SMALL: 12,
  DEFAULT: 14,
  MEDIUM: 16,
  LARGE: 18,
};

export const FONT_FAMILIES = {
  MONTSERRAT_REGULAR: "Montserrat-Regular",
  MONTSERRAT_SEMIBOLD: "Montserrat-SemiBold",
  MONTSERRAT_BOLD: "Montserrat-Bold",
};
