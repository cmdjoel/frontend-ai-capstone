import { settingsSchema, type SettingsFormValues } from "./schema";

export const SETTINGS_STORAGE_KEY = "studyflow-settings";

export function loadSettingsFromStorage(): SettingsFormValues | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    const result = settingsSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function saveSettingsToStorage(values: SettingsFormValues): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(values));
}

export async function persistSettings(values: SettingsFormValues): Promise<void> {
  saveSettingsToStorage(values);
}
