"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, BadgeCheck } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create account");
        return;
      }

      toast.success("Account created successfully");
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-card/80 p-8 shadow-2xl backdrop-blur">
      <div className="mb-8">
        <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
          <BadgeCheck size={26} />
        </div>
        <h1 className="text-3xl font-bold text-card-foreground">
          Create account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Set up your OpsDesk access and start managing ticket workflows.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <User size={14} />
            <span>Name</span>
          </label>
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary disabled:opacity-50"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Mail size={14} />
            <span>Email</span>
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary disabled:opacity-50"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Lock size={14} />
            <span>Password</span>
          </label>
          <input
            type="password"
            placeholder="Create a secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          <UserPlus size={16} />
          <span>{loading ? "Creating..." : "Create Account"}</span>
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary transition hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}