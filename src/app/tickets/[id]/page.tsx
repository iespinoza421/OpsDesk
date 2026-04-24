import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import AppShell from "@/components/AppShell";
import AppTopActions from "@/components/AppTopActions";
import EditTicketForm from "@/components/EditTicketForm";
import TicketActivity from "@/components/TicketActivity";
import TicketTimeline from "@/components/TicketTimeline";
import TicketComments from "@/components/TicketComments";

type TicketDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TicketDetailPage({
  params,
}: TicketDetailPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
  where: { id },
  include: {
    createdBy: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    },
    assignedTo: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    },
    comments: {
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    },

    // 👇 ESTA PARTE ES LA QUE FALTA
    activities: {
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    },
  },
});

  if (!ticket) {
    notFound();
  }

  const canView =
    session.user.role === "ADMIN" ||
    session.user.role === "MANAGER" ||
    ticket.createdById === session.user.id ||
    ticket.assignedToId === session.user.id;

  if (!canView) {
    redirect("/");
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "OPEN":
        return "bg-yellow-500/20 text-yellow-300";
      case "IN_PROGRESS":
        return "bg-blue-500/20 text-blue-300";
      case "CLOSED":
        return "bg-green-500/20 text-green-300";
      default:
        return "bg-slate-700 text-slate-300";
    }
  }

  function getPriorityBadge(priority: string) {
    switch (priority) {
      case "LOW":
        return "bg-slate-500/20 text-slate-300";
      case "MEDIUM":
        return "bg-orange-500/20 text-orange-300";
      case "HIGH":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-slate-700 text-slate-300";
    }
  }

  function formatStatus(status: string) {
    return status === "IN_PROGRESS" ? "IN PROGRESS" : status;
  }

  return (
  <AppShell user={session.user}>
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <Link
            href="/tickets"
            className="mb-3 inline-flex items-center rounded-lg px-2 py-1 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            ← Back to tickets
          </Link>
          <h1 className="text-2xl font-bold sm:text-3xl">Ticket Details</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Review ticket information, comments, and activity.
          </p>
        </div>

        <div className="w-full md:w-auto">
          <AppTopActions role={session.user.role} />
        </div>
      </div>

      <EditTicketForm
        ticketId={ticket.id}
        initialTitle={ticket.title}
        initialDescription={ticket.description}
      />

      <section className="rounded-2xl border border-border bg-card/80 p-4 shadow-lg backdrop-blur sm:p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-card-foreground sm:text-2xl">
              {ticket.title}
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground sm:text-base">
              {ticket.description}
            </p>
          </div>

          <div className="flex flex-row flex-wrap items-center gap-2 lg:flex-col lg:items-end">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${getStatusBadge(
                ticket.status
              )}`}
            >
              {formatStatus(ticket.status)}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${getPriorityBadge(
                ticket.priority
              )}`}
            >
              {ticket.priority}
            </span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Ticket Info
            </h3>

            <div className="space-y-2 text-sm">
              <p className="break-all">
                <span className="text-muted-foreground">ID:</span> {ticket.id}
              </p>
              <p>
                <span className="text-muted-foreground">Created:</span>{" "}
                {new Date(ticket.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="text-muted-foreground">Updated:</span>{" "}
                {new Date(ticket.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              People
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <p>
                  <span className="text-muted-foreground">Created by:</span>{" "}
                  {ticket.createdBy.name} ({ticket.createdBy.role})
                </p>
                <p className="break-all text-muted-foreground">
                  {ticket.createdBy.email}
                </p>
              </div>

              <div>
                <p>
                  <span className="text-muted-foreground">Assigned to:</span>{" "}
                  {ticket.assignedTo
                    ? `${ticket.assignedTo.name} (${ticket.assignedTo.role})`
                    : "Unassigned"}
                </p>
                {ticket.assignedTo && (
                  <p className="break-all text-muted-foreground">
                    {ticket.assignedTo.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <TicketComments ticketId={ticket.id} />

      <TicketTimeline
        comments={ticket.comments.map((comment) => ({
          ...comment,
          createdAt: comment.createdAt.toISOString(),
        }))}
        activities={(ticket.activities ?? []).map((activity) => ({
          ...activity,
          createdAt: activity.createdAt.toISOString(),
        }))}
      />
    </div>
  </AppShell>
);
}