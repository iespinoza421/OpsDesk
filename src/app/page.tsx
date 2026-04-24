import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import AppTopActions from "@/components/AppTopActions";
import MetricCard from "@/components/MetricCard";
import DashboardCharts from "@/components/DashboardCharts";
import TicketItem from "@/components/TicketItem";
import Link from "next/link";
import { ArrowRight, Tickets, ShieldCheck, TicketPlus } from "lucide-react";
import EmptyState from "@/components/EmptyState";


export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const currentUserRole = session.user.role as "ADMIN" | "MANAGER" | "USER";

  const where: any = {};

  if (session.user.role === "USER") {
    where.OR = [
      { createdById: session.user.id },
      { assignedToId: session.user.id },
    ];
  }

  const [
    total,
    open,
    inProgress,
    closed,
    highPriority,
    myTickets,
    priorityLow,
    priorityMedium,
    priorityHigh,
    assignedTickets,
    recentTickets,
  ] = await Promise.all([
    prisma.ticket.count({ where }),

    prisma.ticket.count({
      where: { ...where, status: "OPEN" },
    }),

    prisma.ticket.count({
      where: { ...where, status: "IN_PROGRESS" },
    }),

    prisma.ticket.count({
      where: { ...where, status: "CLOSED" },
    }),

    prisma.ticket.count({
      where: { ...where, priority: "HIGH" },
    }),

    prisma.ticket.count({
      where: {
        OR: [
          { createdById: session.user.id },
          { assignedToId: session.user.id },
        ],
      },
    }),

    prisma.ticket.count({
      where: { ...where, priority: "LOW" },
    }),

    prisma.ticket.count({
      where: { ...where, priority: "MEDIUM" },
    }),

    prisma.ticket.count({
      where: { ...where, priority: "HIGH" },
    }),

    prisma.ticket.groupBy({
      by: ["assignedToId"],
      _count: {
        assignedToId: true,
      },
      where: {
        ...where,
        assignedToId: {
          not: null,
        },
      },
    }),

    prisma.ticket.findMany({
  where,
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
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 2,
}),
  ]);

  const assignedUserIds = assignedTickets
    .map((item) => item.assignedToId)
    .filter((id): id is string => id !== null);

  const assignedUsers = assignedUserIds.length
    ? await prisma.user.findMany({
        where: {
          id: {
            in: assignedUserIds,
          },
        },
        select: {
          id: true,
          name: true,
        },
      })
    : [];

  const statusData = [
    { name: "OPEN", value: open },
    { name: "IN_PROGRESS", value: inProgress },
    { name: "CLOSED", value: closed },
  ];

  const priorityData = [
    { name: "LOW", value: priorityLow },
    { name: "MEDIUM", value: priorityMedium },
    { name: "HIGH", value: priorityHigh },
  ];

  const assignedData = assignedTickets.map((item) => {
    const user = assignedUsers.find((u) => u.id === item.assignedToId);

    return {
      name: user?.name ?? "Unknown",
      value: item._count.assignedToId,
    };
  });

  return (
    <AppShell user={session.user}>
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold sm:text-4xl">Dashboard</h1>
            <p className="text-slate-400">
              Monitor tickets, assignments, and activity across OpsDesk.
            </p>
          </div>

          {/* <AppTopActions role={currentUserRole} /> */}
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard title="Total" value={total} />
          <MetricCard title="Open" value={open} />
          <MetricCard title="In Progress" value={inProgress} />
          <MetricCard title="Closed" value={closed} />
          <MetricCard title="High Priority" value={highPriority} />
          <MetricCard title="My Tickets" value={myTickets} />
        </div>

        <DashboardCharts
          statusData={statusData}
          priorityData={priorityData}
          assignedData={assignedData}
        />

        <div className="space-y-6">
          

          <section className="rounded-3xl border border-border bg-card/70 p-6 shadow-xl backdrop-blur">
  <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
    <div>
      <h2 className="text-2xl font-semibold text-card-foreground">
        Recent Tickets
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Latest ticket activity in OpsDesk.
      </p>
    </div>

    <Link
      href="/tickets"
      className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      View all →
    </Link>
  </div>

  {recentTickets.length === 0 ? (
    <EmptyState
      icon="ticket"
      title="No recent tickets"
      description="Your dashboard is clean for now. Create a ticket to start tracking work."
      action={
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <TicketPlus size={16} />
          <span>Go to Tickets</span>
        </Link>
      }
    />
  ) : (
    <div className="space-y-5">
      {recentTickets.map((ticket) => (
        <TicketItem
          key={ticket.id}
          currentUserRole={currentUserRole}
          ticket={{
            ...ticket,
            createdAt: ticket.createdAt.toISOString(),
          }}
        />
      ))}
    </div>
  )}
</section>

        </div>
      </div>
    </AppShell>
  );
}