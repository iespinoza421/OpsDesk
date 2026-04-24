"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Save, X, Type, FileText } from "lucide-react";

type EditTicketFormProps = {
  ticketId: string;
  initialTitle: string;
  initialDescription: string;
};

export default function EditTicketForm({
  ticketId,
  initialTitle,
  initialDescription,
}: EditTicketFormProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: ticketId,
          title,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update ticket");
        return;
      }

      toast.success("Ticket updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setIsEditing(false);
  }

  if (!isEditing) {
    return (
      <div className="mb-6 flex justify-start sm:justify-end">
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
        >
          <Pencil size={16} />
          <span>Edit Ticket</span>
        </button>
      </div>
    );
  }

  return (
    <section className="mb-6 rounded-2xl border border-border bg-card/80 p-4 shadow-lg backdrop-blur sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          <Pencil size={18} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground sm:text-2xl">
            Edit Ticket
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update the title and description of this ticket.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Type size={14} />
            <span>Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground outline-none transition focus:border-primary disabled:opacity-50"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <FileText size={14} />
            <span>Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            className="min-h-[140px] w-full rounded-xl border border-border bg-background p-3 text-foreground outline-none transition focus:border-primary disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            <Save size={16} />
            <span>{loading ? "Saving..." : "Save Changes"}</span>
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
          >
            <X size={16} />
            <span>Cancel</span>
          </button>
        </div>
      </form>
    </section>
  );
}