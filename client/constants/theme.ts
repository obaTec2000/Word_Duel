import { Platform } from "react-native";

export const AppColors = {
  primary: "#2C3E50",
  primaryDark: "#1A252F",
  accent: "#C0392B",
  accentLight: "#E74C3C",
  gold: "#F1C40F",
  goldDark: "#D4AC0D",
  success: "#27AE60",
  successLight: "#2ECC71",
  skyBlue: "#3498DB",
  neutral: "#ECF0F1",
  white: "#FFFFFF",
  black: "#000000",
};

export const Colors = {
  light: {
    text: "#2C3E50",
    textSecondary: "#7F8C8D",
    buttonText: "#FFFFFF",
    tabIconDefault: "#95A5A6",
    tabIconSelected: "#2C3E50",
    link: "#3498DB",
    backgroundRoot: "#FFFFFF",
    backgroundDefault: "#F8F9FA",
    backgroundSecondary: "#ECF0F1",
    backgroundTertiary: "#E0E0E0",
    primary: AppColors.primary,
    accent: AppColors.accent,
    gold: AppColors.gold,
    success: AppColors.success,
    border: "#E0E0E0",
  },
  dark: {
    text: "#ECF0F1",
    textSecondary: "#95A5A6",
    buttonText: "#FFFFFF",
    tabIconDefault: "#7F8C8D",
    tabIconSelected: "#F1C40F",
    link: "#3498DB",
    backgroundRoot: "#1A252F",
    backgroundDefault: "#2C3E50",
    backgroundSecondary: "#34495E",
    backgroundTertiary: "#3D566E",
    primary: AppColors.primary,
    accent: AppColors.accent,
    gold: AppColors.gold,
    success: AppColors.success,
    border: "#34495E",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
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

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
};
