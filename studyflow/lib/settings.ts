export type ThemePreference = "system" | "light" | "dark";

export type StudySettings = {
  displayName: string;
  email: string;
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  dailyGoalHours: number;
  sessionReminders: boolean;
  breakReminders: boolean;
  soundEffects: boolean;
  theme: ThemePreference;
};

export const DEFAULT_SETTINGS: StudySettings = {
  displayName: "",
  email: "",
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  dailyGoalHours: 2,
  sessionReminders: true,
  breakReminders: true,
  soundEffects: false,
  theme: "system",
};

const STORAGE_KEY = "studyflow-settings";

export function loadSettings(): StudySettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: StudySettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function resetSettings(): StudySettings {
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_SETTINGS;
}

export function applyTheme(theme: ThemePreference): void {
  const root = document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.add(prefersDark ? "dark" : "light");
    return;
  }

  root.classList.add(theme);
}
