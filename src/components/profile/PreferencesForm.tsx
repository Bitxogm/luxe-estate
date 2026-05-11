"use client";

import { useState, useTransition } from "react";
import { updateUserName } from "@/server/actions/user.action";
import { notify } from "@/lib/toast";
import { signOut } from "next-auth/react";
import { Mail, LogOut } from "lucide-react";

interface PreferencesFormProps {
  name: string;
  email: string;
}

export default function PreferencesForm({ name, email }: PreferencesFormProps) {
  const [currentName, setCurrentName] = useState(name);
  const [draft, setDraft] = useState(name);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    if (draft === currentName) return;
    startTransition(async () => {
      const result = await updateUserName(draft);
      if (result.success) {
        setCurrentName(result.name);
        notify.success("Name updated");
      } else {
        notify.error(result.error);
      }
    });
  }

  function handleSignOut() {
    signOut({ callbackUrl: "/" });
  }

  return (
    <section className="rounded-2xl border border-nordic/5 bg-white p-8 dark:border-white/5 dark:bg-nordic-muted/10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold text-nordic dark:text-clear-day">Account Preferences</h2>
          <p className="mt-1 text-sm text-nordic/50 dark:text-clear-day/50">
            Manage your account settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-nordic/40 dark:text-clear-day/40">
            Display Name
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex-1 rounded-lg border border-nordic/10 bg-clear-day px-4 py-3 text-sm text-nordic outline-none focus:border-mosque focus:ring-1 focus:ring-mosque dark:border-white/10 dark:bg-white/5 dark:text-clear-day dark:focus:border-hint-green dark:focus:ring-hint-green"
            />
            <button
              onClick={handleSave}
              disabled={isPending || draft === currentName}
              className="rounded-lg bg-mosque px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-nordic disabled:opacity-50 dark:bg-hint-green dark:text-nordic dark:hover:bg-white"
            >
              {isPending ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-nordic/40 dark:text-clear-day/40">
            Email Address
          </label>
          <div className="flex items-center gap-3 rounded-lg border border-nordic/10 bg-clear-day px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <Mail size={16} className="text-nordic/40 dark:text-clear-day/40" />
            <span className="flex-1 text-sm text-nordic dark:text-clear-day">{email}</span>
            <span className="text-xs text-nordic/40 dark:text-clear-day/40">Read only</span>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-nordic/5 pt-8 dark:border-white/5">
        <h3 className="mb-4 text-sm font-semibold text-nordic/70 dark:text-clear-day/70">
          Session
        </h3>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </section>
  );
}
