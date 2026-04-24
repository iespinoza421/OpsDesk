"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Search, Filter } from "lucide-react";
import { Mail, CalendarDays, Shield, Pencil, Users } from "lucide-react";

type UserRole = "ADMIN" | "MANAGER" | "USER";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  isActive: boolean;
};

type UserManagementTableProps = {
  users: UserItem[];
  currentUserId: string;
};

function roleBadge(role: UserRole) {
  switch (role) {
    case "ADMIN":
      return "border border-rose-500/30 bg-rose-500/12 text-rose-700 dark:text-rose-300";
    case "MANAGER":
      return "border border-sky-500/30 bg-sky-500/12 text-sky-700 dark:text-sky-300";
    case "USER":
    default:
      return "border border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300";
  }
}

export default function UserManagementTable({
  users,
  currentUserId,
}: UserManagementTableProps) {
  const router = useRouter();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  async function handleRoleChange(userId: string, newRole: UserRole) {
    setLoadingUserId(userId);

    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: newRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not update role");
        return;
      }

      toast.success("Role updated");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error");
    } finally {
      setLoadingUserId(null);
    }
  }

  async function handleActiveChange(userId: string, isActive: boolean) {
  setLoadingUserId(userId);

  try {
    const res = await fetch(`/api/users/${userId}/active`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Could not update user status");
      return;
    }

    toast.success(isActive ? "User reactivated" : "User deactivated");
    router.refresh();
  } catch (err) {
    console.error(err);
    toast.error("Unexpected error");
  } finally {
    setLoadingUserId(null);
  }
}


const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">(
  "ALL"
);

const filteredUsers = users.filter((user) => {
  const matchesSearch =
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "ALL" ||
    (statusFilter === "ACTIVE" && user.isActive) ||
    (statusFilter === "INACTIVE" && !user.isActive);

  return matchesSearch && matchesStatus;
});


  return (

    
  <div className="overflow-x-auto">
    <div className="mb-4 flex items-start gap-3">
      <div className="rounded-xl bg-primary/10 p-2 text-primary">
        <Users size={18} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          User Directory
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage team members and their access levels.
        </p>
      </div>
    </div>

    <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
  <div className="relative">
    <Search
      size={16}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
    />
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search by name or email..."
      className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-primary"
    />
  </div>

  <div className="relative">
    <Filter
      size={16}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
    />
    <select
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")
      }
      className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-primary"
    >
      <option value="ALL">All users</option>
      <option value="ACTIVE">Active only</option>
      <option value="INACTIVE">Inactive only</option>
    </select>
  </div>
</div>

<div className="min-w-full space-y-3">
  {filteredUsers.map((user) => {
        const isCurrentUser = user.id === currentUserId;
        const isLoading = loadingUserId === user.id;

        return (
          <div
            key={user.id}
            className="grid gap-4 rounded-2xl border border-border bg-background/70 p-4 shadow-sm md:grid-cols-[1.3fr_1.4fr_0.9fr_0.9fr_1.2fr_1fr] md:items-center"
          >
            {/* USER INFO */}
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground">{user.name}</p>
                {isCurrentUser && (
                  <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    You
                  </span>
                )}
              </div>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={14} />
                <span>{user.email}</span>
              </p>
            </div>

            {/* CREATED */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays size={14} />
              <span>
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* ROLE */}
            <div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${roleBadge(
                  user.role
                )}`}
              >
                {user.role}
              </span>
            </div>

            {/* STATUS */}
            <div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  user.isActive
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300"
                }`}
              >
                {user.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>

            {/* ROLE SELECT */}
            <div>
              <select
                defaultValue={user.role}
                disabled={isLoading || isCurrentUser}
                onChange={(e) =>
                  handleRoleChange(user.id, e.target.value as UserRole)
                }
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary disabled:opacity-50"
              >
                <option value="USER">USER</option>
                <option value="MANAGER">MANAGER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {/* ACTION BUTTON */}
            <div>
              <button
                disabled={isLoading || isCurrentUser}
                onClick={() =>
                  handleActiveChange(user.id, !user.isActive)
                }
                className={`w-full rounded-xl px-3 py-2 text-sm font-medium transition disabled:opacity-50 ${
                  user.isActive
                    ? "border border-rose-500/30 bg-rose-500/10 text-rose-700 hover:bg-rose-500/20 dark:text-rose-300"
                    : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
                }`}
              >
                {user.isActive ? "Deactivate" : "Reactivate"}
              </button>
            </div>
          </div>
        );
      })}
      
    </div>
  </div>
);
}