import { beforeEach, describe, expect, it } from "vitest";
import {
  SETTINGS_STORAGE_KEY,
  loadSettingsFromStorage,
  saveSettingsToStorage,
} from "@/lib/settings/storage";
import type { SettingsFormValues } from "@/lib/settings/schema";

const validSettings: SettingsFormValues = {
  examDate: "2026-08-07",
  studyHoursPerDay: 3,
  quizDifficulty: "Hard",
  aiExplanationDetail: "Detailed",
};

describe("settings storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when no settings are saved", () => {
    expect(loadSettingsFromStorage()).toBeNull();
  });

  it("saves and loads valid settings", () => {
    saveSettingsToStorage(validSettings);

    expect(window.localStorage.getItem(SETTINGS_STORAGE_KEY)).not.toBeNull();
    expect(loadSettingsFromStorage()).toEqual(validSettings);
  });

  it("returns null for invalid stored settings", () => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ examDate: "bad" }));
    expect(loadSettingsFromStorage()).toBeNull();
  });
});
