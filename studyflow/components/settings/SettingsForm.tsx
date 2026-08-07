"use client";

import { useEffect, useState } from "react";
import {
  applyTheme,
  DEFAULT_SETTINGS,
  loadSettings,
  resetSettings,
  saveSettings,
  type StudySettings,
  type ThemePreference,
} from "@/lib/settings";

type SettingsSectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

type FieldProps = {
  label: string;
  hint?: string;
  children: React.ReactNode;
};

function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-1.5 block text-xs text-zinc-500 dark:text-zinc-400">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

const inputClassName =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-800";

const selectClassName =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-800";

type ToggleProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </p>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-300 dark:bg-zinc-700"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform dark:bg-zinc-900 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsForm() {
  const [settings, setSettings] = useState<StudySettings>(DEFAULT_SETTINGS);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const stored = loadSettings();
    setSettings(stored);
    applyTheme(stored.theme);
  }, []);

  function updateSettings(partial: Partial<StudySettings>) {
    setSettings((current) => {
      const next = { ...current, ...partial };
      saveSettings(next);

      if (partial.theme) {
        applyTheme(partial.theme);
      }

      setSavedMessage("Settings saved");
      window.setTimeout(() => setSavedMessage(""), 2000);
      return next;
    });
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Reset all settings to defaults? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    const defaults = resetSettings();
    setSettings(defaults);
    applyTheme(defaults.theme);
    setSavedMessage("Settings reset");
    window.setTimeout(() => setSavedMessage(""), 2000);
  }

  return (
    <div className="space-y-6">
      {savedMessage ? (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          {savedMessage}
        </div>
      ) : null}

      <SettingsSection
        title="Profile"
        description="How you appear across StudyFlow."
      >
        <Field label="Display name">
          <input
            type="text"
            value={settings.displayName}
            onChange={(event) =>
              updateSettings({ displayName: event.target.value })
            }
            placeholder="Your name"
            className={inputClassName}
          />
        </Field>

        <Field label="Email" hint="Optional. Used for reminders and sync later.">
          <input
            type="email"
            value={settings.email}
            onChange={(event) => updateSettings({ email: event.target.value })}
            placeholder="you@example.com"
            className={inputClassName}
          />
        </Field>
      </SettingsSection>

      <SettingsSection
        title="Study preferences"
        description="Customize your focus sessions and daily goals."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Focus session">
            <select
              value={settings.focusMinutes}
              onChange={(event) =>
                updateSettings({ focusMinutes: Number(event.target.value) })
              }
              className={selectClassName}
            >
              <option value={25}>25 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </Field>

          <Field label="Short break">
            <select
              value={settings.shortBreakMinutes}
              onChange={(event) =>
                updateSettings({
                  shortBreakMinutes: Number(event.target.value),
                })
              }
              className={selectClassName}
            >
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
            </select>
          </Field>

          <Field label="Long break">
            <select
              value={settings.longBreakMinutes}
              onChange={(event) =>
                updateSettings({ longBreakMinutes: Number(event.target.value) })
              }
              className={selectClassName}
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
            </select>
          </Field>

          <Field label="Daily study goal">
            <select
              value={settings.dailyGoalHours}
              onChange={(event) =>
                updateSettings({ dailyGoalHours: Number(event.target.value) })
              }
              className={selectClassName}
            >
              <option value={1}>1 hour</option>
              <option value={2}>2 hours</option>
              <option value={3}>3 hours</option>
              <option value={4}>4 hours</option>
            </select>
          </Field>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Notifications"
        description="Control reminders during study sessions."
      >
        <Toggle
          label="Session reminders"
          description="Notify you when a focus session starts."
          checked={settings.sessionReminders}
          onChange={(checked) => updateSettings({ sessionReminders: checked })}
        />
        <Toggle
          label="Break reminders"
          description="Notify you when it is time for a break."
          checked={settings.breakReminders}
          onChange={(checked) => updateSettings({ breakReminders: checked })}
        />
        <Toggle
          label="Sound effects"
          description="Play sounds when sessions begin or end."
          checked={settings.soundEffects}
          onChange={(checked) => updateSettings({ soundEffects: checked })}
        />
      </SettingsSection>

      <SettingsSection
        title="Appearance"
        description="Choose how StudyFlow looks on your device."
      >
        <Field label="Theme">
          <select
            value={settings.theme}
            onChange={(event) =>
              updateSettings({ theme: event.target.value as ThemePreference })
            }
            className={selectClassName}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </Field>
      </SettingsSection>

      <SettingsSection
        title="Data"
        description="Manage your local StudyFlow preferences."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Reset settings
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Restore all options to their default values.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
          >
            Reset all
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}
