"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import ThemeToggle from "@/components/ThemeToggle";
import { LogOut, ShieldCheck } from "lucide-react";

type AppTopActionsProps = {
  role?: string | null;
};

export default function AppTopActions({ role }: AppTopActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />

      {role === "ADMIN" && (
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
        >
          <ShieldCheck size={16} />
          <span>Admin Panel</span>
        </Link>
      )}

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="inline-flex items-center gap-2 rounded-xl bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition hover:opacity-90"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  );
}