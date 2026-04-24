import {
  MessageSquare,
  History,
  UserCircle2,
  Clock3,
  ArrowRight,
} from "lucide-react";

type TimelineComment = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

type TimelineActivity = {
  id: string;
  action: string;
  field: string | null;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
  actor: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

type TicketTimelineProps = {
  comments: TimelineComment[];
  activities: TimelineActivity[];
};

type TimelineItem =
  | {
      type: "comment";
      id: string;
      createdAt: string;
      data: TimelineComment;
    }
  | {
      type: "activity";
      id: string;
      createdAt: string;
      data: TimelineActivity;
    };

function formatValue(value: string | null) {
  if (!value) return "Unassigned";
  if (value === "IN_PROGRESS") return "IN PROGRESS";
  return value;
}

function formatAction(activity: TimelineActivity) {
  switch (activity.action) {
    case "UPDATED_STATUS":
      return `${activity.actor.name} changed status`;
    case "UPDATED_PRIORITY":
      return `${activity.actor.name} changed priority`;
    case "UPDATED_ASSIGNEE":
      return `${activity.actor.name} changed assignee`;
    case "UPDATED_TITLE":
      return `${activity.actor.name} updated the title`;
    case "UPDATED_DESCRIPTION":
      return `${activity.actor.name} updated the description`;
    default:
      return `${activity.actor.name} updated the ticket`;
  }
}

export default function TicketTimeline({
  comments,
  activities,
}: TicketTimelineProps) {
  const timeline: TimelineItem[] = [
    ...comments.map((comment) => ({
      type: "comment" as const,
      id: `comment-${comment.id}`,
      createdAt: comment.createdAt,
      data: comment,
    })),
    ...activities.map((activity) => ({
      type: "activity" as const,
      id: `activity-${activity.id}`,
      createdAt: activity.createdAt,
      data: activity,
    })),
  ].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          <History size={18} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-card-foreground">
            Timeline
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review comments and system activity for this ticket.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {timeline.length === 0 ? (
          <p className="text-muted-foreground">No activity yet.</p>
        ) : (
          timeline.map((item) => {
            if (item.type === "comment") {
              const comment = item.data;

              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm"
                >
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-primary/10 p-2 text-primary">
                        <MessageSquare size={16} />
                      </div>

                      <div>
                        <p className="font-medium text-foreground">
                          {comment.author.name}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <UserCircle2 size={13} />
                          <span>
                            {comment.author.email} • {comment.author.role}
                          </span>
                        </p>
                      </div>
                    </div>

                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock3 size={13} />
                      <span>{new Date(comment.createdAt).toLocaleString()}</span>
                    </p>
                  </div>

                  <div className="mb-2 inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    COMMENT
                  </div>

                  <p className="whitespace-pre-wrap text-sm text-foreground">
                    {comment.content}
                  </p>
                </article>
              );
            }

            const activity = item.data;

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                      ACTIVITY
                    </div>

                    <p className="text-sm font-medium text-foreground">
                      {formatAction(activity)}
                    </p>

                    {(activity.oldValue || activity.newValue) && (
                      <div className="mt-2 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                        <span>{formatValue(activity.oldValue)}</span>
                        <ArrowRight size={12} />
                        <span>{formatValue(activity.newValue)}</span>
                      </div>
                    )}

                    <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <UserCircle2 size={13} />
                      <span>
                        {activity.actor.email} • {activity.actor.role}
                      </span>
                    </p>
                  </div>

                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock3 size={13} />
                    <span>{new Date(activity.createdAt).toLocaleString()}</span>
                  </p>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}