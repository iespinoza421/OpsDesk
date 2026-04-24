import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import UserManagementTable from "../../../components/UserManagementTable";
import AppShell from "@/components/AppShell";
import AppTopActions from "@/components/AppTopActions";
import EmptyState from "@/components/EmptyState";
import { Users } from "lucide-react";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    isActive: true,
    createdAt: true,
  },
  orderBy: {
    createdAt: "desc",
  },
});

  return (
  <AppShell user={session.user}>
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            User Administration
          </h1>
          <p className="text-muted-foreground">
            Manage team access, roles, and permissions across OpsDesk.
          </p>
        </div>

        {/* <AppTopActions role={session.user.role} /> */}
      </div>

      <section className="rounded-3xl border border-border bg-card/70 p-6 shadow-xl backdrop-blur">
        <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
  <div>
    <h2 className="text-2xl font-semibold text-card-foreground">
      Team Members
    </h2>
    <p className="mt-1 text-sm text-muted-foreground">
      Update user roles and monitor access levels.
    </p>
  </div>

  <div className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground">
    {users.length} user(s)
  </div>
</div>

{users.length === 0 ? (
  <EmptyState
    icon="users"
    title="No users found"
    description="There are no registered users to manage yet."
  />
) : (
  <UserManagementTable
    currentUserId={session.user.id}
    users={users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    }))}
  />
)}
      </section>
    </div>
  </AppShell>
);
}