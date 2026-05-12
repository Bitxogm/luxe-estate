"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { ChevronDown, Shield, User } from "lucide-react";
import { changeUserRoleAction } from "@/server/actions/user.action";
import { notify } from "@/lib/toast";

interface ChangeRoleButtonProps {
  userId: string;
  currentRole: string;
  userName: string;
}

const ROLES = [
  { value: "admin", label: "Admin", icon: Shield },
  { value: "user", label: "User", icon: User },
] as const;

export default function ChangeRoleButton({ userId, currentRole, userName }: ChangeRoleButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(role: string) {
    if (role === currentRole) {
      setOpen(false);
      return;
    }
    startTransition(async () => {
      const result = await changeUserRoleAction(userId, role);
      if (result.error) {
        notify.error(result.error);
      } else {
        notify.success(`${userName} is now ${role}`);
      }
      setOpen(false);
    });
  }

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-nordic/10 bg-white px-4 py-2 text-xs font-medium text-nordic transition-colors hover:border-nordic/30 hover:bg-nordic hover:text-white disabled:opacity-50 dark:border-white/10 dark:bg-transparent dark:text-clear-day dark:hover:bg-white/10"
      >
        {isPending ? "Saving…" : "Change Role"}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-40 overflow-hidden rounded-lg border border-nordic/10 bg-white shadow-lg dark:border-white/10 dark:bg-nordic">
          {ROLES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-xs transition-colors ${
                value === currentRole
                  ? "bg-mosque/10 font-semibold text-mosque dark:bg-hint-green/10 dark:text-hint-green"
                  : "text-nordic/70 hover:bg-nordic/5 dark:text-clear-day/70 dark:hover:bg-white/10"
              }`}
            >
              <Icon size={13} />
              {label}
              {value === currentRole && (
                <span className="ml-auto text-[10px] font-normal opacity-60">current</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
