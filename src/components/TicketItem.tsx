"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import MotionCard from "@/components/MotionCard";

import {
  User,
  UserCheck,
  CalendarDays,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";


type UserOption = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "USER";
};

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
};

type TicketItemProps = {
  ticket: Ticket;
  currentUserRole: "ADMIN" | "MANAGER" | "USER";
};

export default function TicketItem({
  ticket,
  currentUserRole,
}: TicketItemProps) {
  const router = useRouter();

  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [assignedToId, setAssignedToId] = useState(ticket.assignedTo?.id ?? "");

  const [users, setUsers] = useState<UserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingPriority, setLoadingPriority] = useState(false);
  const [loadingAssigned, setLoadingAssigned] = useState(false);

  const canAssign =
    currentUserRole === "ADMIN" || currentUserRole === "MANAGER";

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load users");
        }

        setUsers(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load users");
      } finally {
        setLoadingUsers(false);
      }
    }

    loadUsers();
  }, []);

  async function updateTicket(data: {
    status?: Ticket["status"];
    priority?: Ticket["priority"];
    assignedToId?: string;
  }) {
    const res = await fetch("/api/tickets", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: ticket.id,
        ...data,
      }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.error || "Could not update the ticket");
    }

    router.refresh();
  }

  async function handleStatusChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newStatus = e.target.value as Ticket["status"];
    const previousStatus = status;

    setStatus(newStatus);
    setLoadingStatus(true);

    try {
      await updateTicket({ status: newStatus });
      toast.success("Status updated");
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
      setStatus(previousStatus);
    } finally {
      setLoadingStatus(false);
    }
  }

  async function handlePriorityChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newPriority = e.target.value as Ticket["priority"];
    const previousPriority = priority;

    setPriority(newPriority);
    setLoadingPriority(true);

    try {
      await updateTicket({ priority: newPriority });
      toast.success("Priority updated");
    } catch (err) {
      console.error(err);
      toast.error("Error updating priority");
      setPriority(previousPriority);
    } finally {
      setLoadingPriority(false);
    }
  }

  async function handleAssignedChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newAssignedToId = e.target.value;
    const previousAssignedToId = assignedToId;

    setAssignedToId(newAssignedToId);
    setLoadingAssigned(true);

    try {
      await updateTicket({
        assignedToId: newAssignedToId,
      });
      toast.success("Assignee updated");
    } catch (err) {
      console.error(err);
      toast.error("Error assigning ticket");
      setAssignedToId(previousAssignedToId);
    } finally {
      setLoadingAssigned(false);
    }
  }

  function getStatusBadge(status: Ticket["status"]) {
    switch (status) {
      case "OPEN":
        return "border border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-300";
      case "IN_PROGRESS":
        return "border border-sky-500/30 bg-sky-500/12 text-sky-700 dark:text-sky-300";
      case "CLOSED":
        return "border border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300";
      default:
        return "border border-border bg-muted text-muted-foreground";
    }
  }

  function getPriorityBadge(priority: Ticket["priority"]) {
    switch (priority) {
      case "LOW":
        return "border border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300";
      case "MEDIUM":
        return "border border-orange-500/30 bg-orange-500/12 text-orange-700 dark:text-orange-300";
      case "HIGH":
        return "border border-rose-500/30 bg-rose-500/12 text-rose-700 dark:text-rose-300";
      default:
        return "border border-border bg-muted text-muted-foreground";
    }
  }

  function formatStatus(status: Ticket["status"]) {
    return status === "IN_PROGRESS" ? "IN PROGRESS" : status;
  }

  return (
    <MotionCard className="rounded-3xl border border-border bg-card/75 p-4 shadow-md backdrop-blur transition hover:border-primary/30 hover:shadow-xl sm:p-5">

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-card-foreground sm:text-xl">
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="transition hover:text-primary"
                >
                  {ticket.title}
                </Link>
              </h3>

              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {ticket.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${getPriorityBadge(
                  priority
                )}`}
              >
                {priority}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${getStatusBadge(
                  status
                )}`}
              >
                {formatStatus(status)}
              </span>
            </div>
          </div>

          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <User size={15} />
              <span>
                <span className="font-medium text-foreground">Created by:</span>{" "}
                {ticket.createdBy?.name ?? "N/A"}
              </span>
            </p>

            <p className="flex items-center gap-2">
              <UserCheck size={15} />
              <span>
                <span className="font-medium text-foreground">Assigned to:</span>{" "}
                {ticket.assignedTo?.name ?? "Unassigned"}
              </span>
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays size={14} />
              <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
            </p>

            <Link
              href={`/tickets/${ticket.id}`}
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-primary transition hover:bg-primary/10 hover:text-primary"
            >
              <span>View details</span>
              <ExternalLink size={15} />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <SlidersHorizontal size={15} />
            <span>Quick Actions</span>
          </h4>

          <div className="grid gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </label>
              <select
                value={status}
                onChange={handleStatusChange}
                disabled={loadingStatus}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary disabled:opacity-50"
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Priority
              </label>
              <select
                value={priority}
                onChange={handlePriorityChange}
                disabled={loadingPriority}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary disabled:opacity-50"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>

            {canAssign && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Assign
                </label>
                <select
                  value={assignedToId}
                  onChange={handleAssignedChange}
                  disabled={loadingAssigned || loadingUsers}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary disabled:opacity-50"
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </MotionCard>
  );
}