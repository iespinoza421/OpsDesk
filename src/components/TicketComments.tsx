"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MessageSquare, Send } from "lucide-react";

type TicketCommentsProps = {
  ticketId: string;
};

export default function TicketComments({ ticketId }: TicketCommentsProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to add comment");
        return;
      }

      setContent("");
      toast.success("Comment added");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card/80 p-4 shadow-lg backdrop-blur sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          <MessageSquare size={18} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground sm:text-2xl">
            Add Comment
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add context or updates to this ticket.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          disabled={loading}
          className="mb-3 min-h-[120px] w-full rounded-xl border border-border bg-background p-3 text-foreground outline-none transition focus:border-primary disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50 sm:w-auto"
        >
          <Send size={16} />
          <span>{loading ? "Posting..." : "Add Comment"}</span>
        </button>
      </form>
    </section>
  );
}