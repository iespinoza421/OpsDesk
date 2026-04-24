import RegisterForm from "@/components/RegisterForm";
import { Briefcase } from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-6xl grid-cols-2 gap-10 lg:grid">
        <div className="hidden flex-col justify-center lg:flex">
          <div className="max-w-md">
            <div className="mb-6 inline-flex rounded-2xl bg-primary/10 p-4 text-primary">
              <Briefcase size={32} />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-foreground">
              Join OpsDesk
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Create your account and get access to a modern operations platform
              for ticket management, collaboration, and workflow visibility.
            </p>

            <div className="mt-8 space-y-3 text-sm text-muted-foreground">
              <p>• Organize issues and assign responsibilities</p>
              <p>• Collaborate through comments and activity tracking</p>
              <p>• Monitor operations with charts, filters, and dashboards</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}