"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  updateUserName,
  changePasswordAction,
  deleteAccountAction,
} from "@/server/actions/user.action";
import { notify } from "@/lib/toast";
import { signOut } from "next-auth/react";
import { Mail, LogOut, Eye, EyeOff, AlertTriangle } from "lucide-react";
import AvatarUpload from "@/components/profile/AvatarUpload";

interface PreferencesFormProps {
  name: string;
  email: string;
  image?: string | null;
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/[0-9]/, "At least one number"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

const inputClass =
  "flex-1 rounded-lg border border-nordic/10 bg-clear-day px-4 py-3 text-sm text-nordic outline-none focus:border-mosque focus:ring-1 focus:ring-mosque dark:border-white/10 dark:bg-white/5 dark:text-clear-day dark:focus:border-hint-green dark:focus:ring-hint-green";

function PasswordInput({
  id,
  placeholder,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center">
      <input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className={`${inputClass} pr-10`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 text-nordic/40 hover:text-nordic dark:text-clear-day/40 dark:hover:text-clear-day"
        tabIndex={-1}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export default function PreferencesForm({ name, email, image }: PreferencesFormProps) {
  const [currentName, setCurrentName] = useState(name);
  const [draft, setDraft] = useState(name);
  const [isPending, startTransition] = useTransition();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

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

  async function onPasswordSubmit(values: PasswordFormValues) {
    const result = await changePasswordAction(values.currentPassword, values.newPassword);
    if (!result.success) {
      if (result.field === "currentPassword") {
        setError("currentPassword", { message: result.error });
      } else {
        setError("root", { message: result.error });
      }
      return;
    }
    notify.success("Password updated");
    reset();
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== "DELETE") return;
    setIsDeleting(true);
    const result = await deleteAccountAction();
    if (!result.success) {
      notify.error(result.error);
      setIsDeleting(false);
      return;
    }
    await signOut({ callbackUrl: "/" });
  }

  return (
    <section className="space-y-8">
      {/* Account Preferences */}
      <div className="rounded-2xl border border-nordic/5 bg-white p-8 dark:border-white/5 dark:bg-nordic-muted/10">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-nordic dark:text-clear-day">Account Preferences</h2>
          <p className="mt-1 text-sm text-nordic/50 dark:text-clear-day/50">
            Manage your account settings
          </p>
        </div>

        <div className="mb-8 flex items-center gap-6">
          <AvatarUpload name={name} email={email} image={image} size="sm" />
          <div>
            <p className="text-sm font-medium text-nordic dark:text-clear-day">Profile photo</p>
            <p className="mt-1 text-xs text-nordic/40 dark:text-clear-day/40">
              Click the camera icon to upload — JPG, PNG or WebP, max 5MB
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
                className={inputClass}
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
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl border border-nordic/5 bg-white p-8 dark:border-white/5 dark:bg-nordic-muted/10">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-nordic dark:text-clear-day">Change Password</h2>
          <p className="mt-1 text-sm text-nordic/50 dark:text-clear-day/50">
            Update your password. Minimum 8 characters, one uppercase, one number.
          </p>
        </div>

        <form onSubmit={handleSubmit(onPasswordSubmit)} className="max-w-md space-y-5">
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-nordic/40 dark:text-clear-day/40"
            >
              Current Password
            </label>
            <PasswordInput
              id="currentPassword"
              placeholder="Your current password"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-nordic/40 dark:text-clear-day/40"
            >
              New Password
            </label>
            <PasswordInput
              id="newPassword"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-nordic/40 dark:text-clear-day/40"
            >
              Confirm New Password
            </label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Repeat new password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {errors.root && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-mosque px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-nordic disabled:opacity-50 dark:bg-hint-green dark:text-nordic dark:hover:bg-white"
          >
            {isSubmitting ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 dark:border-red-900/50 dark:bg-red-950/10">
        <div className="mb-6 flex items-center gap-3">
          <AlertTriangle size={20} className="text-red-500" />
          <h2 className="text-xl font-bold text-red-700 dark:text-red-400">Danger Zone</h2>
        </div>
        <p className="mb-6 text-sm text-red-600/80 dark:text-red-400/80">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="rounded-lg border border-red-300 bg-white px-5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white dark:border-red-800 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
        >
          Delete Account
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-nordic-muted">
            <div className="mb-2 flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-500" />
              <h3 className="text-lg font-bold text-nordic dark:text-clear-day">Delete Account</h3>
            </div>
            <p className="mb-6 text-sm text-nordic/60 dark:text-clear-day/60">
              This will permanently delete your account, all your properties, saved properties, and
              visits. Type{" "}
              <span className="font-mono font-bold text-red-600 dark:text-red-400">DELETE</span> to
              confirm.
            </p>

            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE"
              className="mb-6 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-mono text-sm text-red-700 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}
                disabled={isDeleting}
                className="rounded-lg px-5 py-2.5 text-sm font-medium text-nordic/60 transition-colors hover:text-nordic disabled:opacity-50 dark:text-clear-day/60 dark:hover:text-clear-day"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== "DELETE" || isDeleting}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting…" : "Delete my account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
