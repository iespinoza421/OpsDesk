import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-6xl grid-cols-2 gap-10 lg:grid">
        <div className="hidden flex-col justify-center lg:flex">
          <div className="max-w-md">
            <div className="mb-6 inline-flex rounded-2xl bg-primary/10 p-4 text-primary">
              <Briefcase size={32} />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-foreground">
              OpsDesk
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A modern ticketing and workflow platform for managing operations,
              priorities, assignments, and team collaboration.
            </p>

            <div className="mt-8 space-y-3 text-sm text-muted-foreground">
              <p>• Track tickets with priorities and status updates</p>
              <p>• Manage teams with roles and permissions</p>
              <p>• Review activity logs and comments in one place</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}