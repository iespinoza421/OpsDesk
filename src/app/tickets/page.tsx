import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
//import AppTopActions from "@/components/AppTopActions";
import CreateTicketForm from "@/components/CreateTicketForm";
import TicketItem from "@/components/TicketItem";
import TicketFilters from "@/components/TicketFilters";
import PageSizeSelector from "@/components/PageSizeSelector";
import EmptyState from "@/components/EmptyState";
import { SearchX, PlusCircle } from "lucide-react";
import { Prisma } from "@prisma/client";

type TicketsPageProps = {
  searchParams: Promise<{
    status?: "OPEN" | "IN_PROGRESS" | "CLOSED";
    priority?: "LOW" | "MEDIUM" | "HIGH";
    search?: string;
    assignedTo?: string;
    page?: string;
    sort?: string;
    pageSize?: string;
  }>;
};

export default async function TicketsPage({
  searchParams,
}: TicketsPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const params = await searchParams;
  const currentUserRole = session.user.role as "ADMIN" | "MANAGER" | "USER";

  const pageSize = [10, 15, 25, 50].includes(Number(params.pageSize))
    ? Number(params.pageSize)
    : 10;

  const currentPage = Math.max(1, Number(params.page) || 1);
  const skip = (currentPage - 1) * pageSize;

  const where: Prisma.TicketWhereInput = {};

  if (params.status) {
    where.status = params.status;
  }

  if (params.priority) {
    where.priority = params.priority;
  }

  if (params.search?.trim()) {
    where.OR = [
      {
        title: {
          contains: params.search.trim(),
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: params.search.trim(),
          mode: "insensitive",
        },
      },
    ];
  }

  if (params.assignedTo) {
    where.assignedToId = params.assignedTo;
  }

  if (session.user.role === "USER") {
    const userVisibility: Prisma.TicketWhereInput = {
      OR: [
        { createdById: session.user.id },
        { assignedToId: session.user.id },
      ],
    };

    if (Object.keys(where).length > 0) {
      const existingWhere = { ...where };
      Object.keys(where).forEach(
        (key) => delete where[key as keyof typeof where]
      );
      where.AND = [existingWhere, userVisibility];
    } else {
      where.OR = userVisibility.OR;
    }
  }

  let orderBy: Prisma.TicketOrderByWithRelationInput[] = [
    { createdAt: "desc" },
  ];

  switch (params.sort) {
    case "oldest":
      orderBy = [{ createdAt: "asc" }];
      break;
    case "priority_high":
      orderBy = [{ priority: "desc" }, { createdAt: "desc" }];
      break;
    case "priority_low":
      orderBy = [{ priority: "asc" }, { createdAt: "desc" }];
      break;
    case "status":
      orderBy = [{ status: "asc" }, { createdAt: "desc" }];
      break;
    case "newest":
    default:
      orderBy = [{ createdAt: "desc" }];
      break;
  }

  const [tickets, users, totalTickets] = await Promise.all([
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
      orderBy,
      skip,
      take: pageSize,
    }),

    prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.ticket.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalTickets / pageSize));

  const createPageHref = (page: number) => {
    const query = new URLSearchParams();

    if (params.status) query.set("status", params.status);
    if (params.priority) query.set("priority", params.priority);
    if (params.search?.trim()) query.set("search", params.search.trim());
    if (params.assignedTo) query.set("assignedTo", params.assignedTo);
    if (params.sort) query.set("sort", params.sort);
    query.set("pageSize", String(pageSize));
    query.set("page", String(page));

    return `/tickets?${query.toString()}`;
  };

  return (
    <AppShell user={session.user}>
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold sm:text-4xl">Tickets</h1>
            <p className="text-muted-foreground">
              Search, filter, create, and manage all tickets.
            </p>
          </div>

          {/* <AppTopActions role={currentUserRole} /> */}
        </div>

        <TicketFilters
          users={users}
          currentFilters={{
            status: params.status ?? "",
            priority: params.priority ?? "",
            search: params.search ?? "",
            assignedTo: params.assignedTo ?? "",
            sort: params.sort ?? "newest",
          }}
        />

        <CreateTicketForm />

        <section className="rounded-3xl border border-border bg-card/70 p-6 shadow-xl backdrop-blur">
  <div className="mb-6 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-2xl font-semibold text-card-foreground">
        All Tickets
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Browse and manage all matching tickets.
      </p>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground">
        {totalTickets} result(s)
      </div>

      <PageSizeSelector currentPageSize={pageSize} />
    </div>
  </div>

  {tickets.length === 0 ? (
    <EmptyState
  icon="search"
  title="No tickets found"
  description="Try changing your filters, search text, or create a new ticket to get started."
  action={
    <a
      href="#create-ticket"
      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
    >
      Create Ticket
    </a>
  }
/>
  ) : (
    <>
      <div className="space-y-4">
        {tickets.map((ticket) => (
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

      {totalPages > 1 && (
        <nav className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row" aria-label="Pagination">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={createPageHref(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage === 1}
              className={`rounded-xl border border-border px-4 py-2 text-sm transition ${
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-accent"
              }`}
            >
              Previous
            </Link>

            <Link
              href={createPageHref(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage === totalPages}
              className={`rounded-xl border border-border px-4 py-2 text-sm transition ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-accent"
              }`}
            >
              Next
            </Link>
          </div>
        </nav>
      )}
    </>
  )}
</section>
      </div>
    </AppShell>
  );
}