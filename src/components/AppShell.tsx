"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import NotificationsButton from "@/components/NotificationsButton";
import ThemeToggle from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  Ticket,
  Users,
  LogOut,
  Briefcase,
  Menu,
  X,
} from "lucide-react";

type AppShellProps = {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
};

function navItemClass(isActive: boolean) {
  return [
    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
    isActive
      ? "bg-primary text-primary-foreground shadow"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  ].join(" ");
}

export default function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDashboardActive = pathname === "/";
  const isTicketsActive =
    pathname === "/tickets" || pathname.startsWith("/tickets/");
  const isAdminActive =
    pathname === "/admin/users" || pathname.startsWith("/admin/users");

  const NavLinks = () => (
    <nav className="flex flex-col gap-2">
      <Link
        href="/"
        className={navItemClass(isDashboardActive)}
        onClick={() => setMobileOpen(false)}
      >
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </Link>

      <Link
        href="/tickets"
        className={navItemClass(isTicketsActive)}
        onClick={() => setMobileOpen(false)}
      >
        <Ticket size={18} />
        <span>Tickets</span>
      </Link>

      {user.role === "ADMIN" && (
        <Link
          href="/admin/users"
          className={navItemClass(isAdminActive)}
          onClick={() => setMobileOpen(false)}
        >
          <Users size={18} />
          <span>Admin Users</span>
        </Link>
      )}
    </nav>
  );

  const UserCard = () => (
  <div className="rounded-2xl border border-border bg-background/80 p-4 shadow-sm">
    <p className="font-semibold text-foreground">{user.name || "User"}</p>

    <p className="mt-1 break-words text-sm text-muted-foreground">
      {user.email || "No email"}
    </p>

    <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
      {user.role || "USER"}
    </p>

    <div className="mt-4 grid gap-2">
      <ThemeToggle />

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition hover:opacity-90"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  </div>
);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-border bg-card/80 p-6 backdrop-blur lg:block">
          <div className="flex h-full min-h-screen flex-col">
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      OpsDesk
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Operations management
                    </p>
                  </div>
                </div>
              </div>

              <NavLinks />
            </div>

            <div className="mt-auto pt-6">
              <UserCard />
            </div>
          </div>
        </aside>

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] border-r border-border bg-card p-6 shadow-2xl lg:hidden">
              <div className="flex h-full flex-col">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                      <Briefcase size={22} />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-foreground">
                        OpsDesk
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        Operations management
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl border border-border bg-background p-2 text-foreground transition hover:bg-muted"
                  >
                    <X size={18} />
                  </button>
                </div>

                <NavLinks />

                <div className="mt-auto pt-6">
                  <UserCard />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-border bg-background/80 px-4 py-4 backdrop-blur sm:px-6">
  <div className="flex items-center justify-between gap-3">
    <div className="flex min-w-0 items-center gap-3">
      <button
        onClick={() => setMobileOpen(true)}
        className="rounded-xl border border-border bg-card p-2 text-foreground transition hover:bg-muted lg:hidden"
      >
        <Menu size={18} />
      </button>

      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold text-foreground sm:text-lg">
          OpsDesk
        </h2>
        <p className="hidden text-sm text-muted-foreground sm:block">
          Ticketing and workflow dashboard
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <NotificationsButton />

      <div className="hidden sm:block">
        <ThemeToggle />
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="inline-flex items-center gap-2 rounded-xl bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground transition hover:opacity-90 sm:px-4"
      >
        <LogOut size={16} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  </div>

  <div className="mt-3 flex items-center justify-between gap-3 sm:hidden">
    <p className="truncate text-xs text-muted-foreground">
      {user.name} • {user.role}
    </p>

    <ThemeToggle />
  </div>
</header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}