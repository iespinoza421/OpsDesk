"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Search,
  Funnel,
  CircleDot,
  AlertTriangle,
  UserCheck,
  ArrowDownWideNarrow,
  RotateCcw,
} from "lucide-react";

type UserOption = {
  id: string;
  name: string;
};

type TicketFiltersProps = {
  users: UserOption[];
  currentFilters: {
    status: string;
    priority: string;
    search: string;
    assignedTo: string;
    sort: string;
  };
};

export default function TicketFilters({
  users,
  currentFilters,
}: TicketFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentFilters.search);
  const [status, setStatus] = useState(currentFilters.status);
  const [priority, setPriority] = useState(currentFilters.priority);
  const [assignedTo, setAssignedTo] = useState(currentFilters.assignedTo);
  const [sort, setSort] = useState(currentFilters.sort || "newest");

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    if (priority) {
      params.set("priority", priority);
    } else {
      params.delete("priority");
    }

    if (assignedTo) {
      params.set("assignedTo", assignedTo);
    } else {
      params.delete("assignedTo");
    }

    if (sort && sort !== "newest") {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    params.delete("page");

    router.push(`/tickets?${params.toString()}`);
  }

  function clearFilters() {
    setSearch("");
    setStatus("");
    setPriority("");
    setAssignedTo("");
    setSort("newest");
    router.push("/tickets");
  }

  return (
    <section className="mb-6 rounded-2xl border border-border bg-card/80 p-5 shadow-lg backdrop-blur">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          <Funnel size={18} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">Filters</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Refine tickets by text, state, assignee, and sorting.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Search size={14} />
            <span>Search</span>
          </label>
          <input
            type="text"
            placeholder="Search title or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-foreground outline-none transition focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CircleDot size={14} />
            <span>Status</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-foreground outline-none transition focus:border-primary"
          >
            <option value="">All</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <AlertTriangle size={14} />
            <span>Priority</span>
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-foreground outline-none transition focus:border-primary"
          >
            <option value="">All</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <UserCheck size={14} />
            <span>Assigned To</span>
          </label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-foreground outline-none transition focus:border-primary"
          >
            <option value="">Anyone</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ArrowDownWideNarrow size={14} />
            <span>Sort By</span>
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-foreground outline-none transition focus:border-primary"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority_high">Priority: High first</option>
            <option value="priority_low">Priority: Low first</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={applyFilters}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Funnel size={16} />
          <span>Apply Filters</span>
        </button>

        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          <RotateCcw size={16} />
          <span>Clear</span>
        </button>
      </div>
    </section>
  );
}