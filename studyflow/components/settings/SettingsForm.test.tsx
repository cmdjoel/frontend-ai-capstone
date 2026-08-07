import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { SETTINGS_STORAGE_KEY } from "@/lib/settings/storage";
import * as storageModule from "@/lib/settings/storage";
import type { SettingsFormValues } from "@/lib/settings/schema";

const savedSettings: SettingsFormValues = {
  examDate: "2026-08-10",
  studyHoursPerDay: 5,
  quizDifficulty: "Hard",
  aiExplanationDetail: "Detailed",
};

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getFutureDateString(daysFromNow = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(0, 0, 0, 0);
  return formatLocalDate(date);
}

function getPastDateString(daysAgo = 1): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(0, 0, 0, 0);
  return formatLocalDate(date);
}

describe("SettingsForm", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all fields with visible labels", () => {
    render(<SettingsForm />);

    expect(screen.getByLabelText("Exam Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Study Hours Per Day")).toBeInTheDocument();
    expect(screen.getByLabelText("Preferred Quiz Difficulty")).toBeInTheDocument();
    expect(screen.getByLabelText("AI Explanation Detail")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Settings" })).toBeInTheDocument();
  });

  it("loads saved settings from localStorage on mount", async () => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(savedSettings));

    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByLabelText("Exam Date")).toHaveValue(savedSettings.examDate);
      expect(screen.getByLabelText("Study Hours Per Day")).toHaveValue(
        savedSettings.studyHoursPerDay,
      );
      expect(screen.getByLabelText("Preferred Quiz Difficulty")).toHaveValue(
        savedSettings.quizDifficulty,
      );
      expect(screen.getByLabelText("AI Explanation Detail")).toHaveValue(
        savedSettings.aiExplanationDetail,
      );
    });
  });

  it("shows validation messages below fields", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SettingsForm />);

    await user.clear(screen.getByLabelText("Exam Date"));
    await user.clear(screen.getByLabelText("Study Hours Per Day"));
    await user.selectOptions(screen.getByLabelText("Preferred Quiz Difficulty"), "");
    await user.selectOptions(screen.getByLabelText("AI Explanation Detail"), "");
    await user.click(screen.getByRole("button", { name: "Save Settings" }));

    expect(await screen.findByText("Exam date is required")).toBeInTheDocument();
    expect(screen.getByText("Study hours per day is required")).toBeInTheDocument();
    expect(screen.getByText("Preferred quiz difficulty is required")).toBeInTheDocument();
    expect(screen.getByText("AI explanation detail is required")).toBeInTheDocument();
  });

  it("rejects an exam date before today", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SettingsForm />);

    await user.clear(screen.getByLabelText("Exam Date"));
    await user.type(screen.getByLabelText("Exam Date"), getPastDateString());
    await user.click(screen.getByRole("button", { name: "Save Settings" }));

    expect(
      await screen.findByText("Exam date cannot be before today"),
    ).toBeInTheDocument();
  });

  it("rejects study hours outside the allowed range", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SettingsForm />);

    await user.clear(screen.getByLabelText("Study Hours Per Day"));
    await user.type(screen.getByLabelText("Study Hours Per Day"), "15");
    await user.click(screen.getByRole("button", { name: "Save Settings" }));

    expect(await screen.findByText("Study hours cannot exceed 12")).toBeInTheDocument();
  });

  it("saves valid settings and shows a success toast", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SettingsForm />);

    const futureDate = getFutureDateString();

    await user.clear(screen.getByLabelText("Exam Date"));
    await user.type(screen.getByLabelText("Exam Date"), futureDate);
    await user.clear(screen.getByLabelText("Study Hours Per Day"));
    await user.type(screen.getByLabelText("Study Hours Per Day"), "6");
    await user.selectOptions(screen.getByLabelText("Preferred Quiz Difficulty"), "Easy");
    await user.selectOptions(screen.getByLabelText("AI Explanation Detail"), "Brief");
    await user.click(screen.getByRole("button", { name: "Save Settings" }));

    await waitFor(() => {
      expect(window.localStorage.getItem(SETTINGS_STORAGE_KEY)).toContain(futureDate);
    });

    expect(await screen.findByRole("status")).toHaveTextContent("Settings saved successfully.");
  });

  it("disables the save button while submitting", async () => {
    let resolveSave: () => void = () => undefined;
    const savePromise = new Promise<void>((resolve) => {
      resolveSave = resolve;
    });

    vi.spyOn(storageModule, "persistSettings").mockImplementation(() => savePromise);

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SettingsForm />);

    await user.clear(screen.getByLabelText("Exam Date"));
    await user.type(screen.getByLabelText("Exam Date"), getFutureDateString());
    await user.clear(screen.getByLabelText("Study Hours Per Day"));
    await user.type(screen.getByLabelText("Study Hours Per Day"), "2");

    const saveButton = screen.getByRole("button", { name: "Save Settings" });
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveTextContent("Saving...");

    resolveSave();
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });
  });
});
