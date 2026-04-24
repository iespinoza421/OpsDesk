"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreateTicketForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create ticket");
        return;
      }

      setTitle("");
      setDescription("");
      toast.success("Ticket created successfully");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-border bg-card/80 p-5 shadow-lg backdrop-blur"
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-card-foreground">
          Create Ticket
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new issue to the workflow.
        </p>
      </div>

      <div className="grid gap-3">
        <input
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary disabled:opacity-50"
          placeholder="Ticket title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />

        <textarea
          className="min-h-[120px] w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary disabled:opacity-50"
          placeholder="Describe the issue"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Ticket"}
        </button>
      </div>
    </form>
  );
}