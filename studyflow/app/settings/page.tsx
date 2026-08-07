import { SettingsForm } from "@/components/settings/SettingsForm";

export const metadata = {
  title: "Settings | StudyFlow",
  description: "Configure your StudyFlow study preferences",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Settings
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Customize your exam schedule, daily study goals, and AI preferences.
          </p>
        </header>
        <SettingsForm />
      </div>
    </div>
  );
}
