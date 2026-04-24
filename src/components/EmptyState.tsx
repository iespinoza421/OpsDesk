import { Inbox, SearchX, TicketPlus, Users } from "lucide-react";

type EmptyStateIcon = "inbox" | "search" | "ticket" | "users";

type EmptyStateProps = {
  icon: EmptyStateIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
};

function getIcon(icon: EmptyStateIcon) {
  switch (icon) {
    case "search":
      return <SearchX size={28} />;
    case "ticket":
      return <TicketPlus size={28} />;
    case "users":
      return <Users size={28} />;
    case "inbox":
    default:
      return <Inbox size={28} />;
  }
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-background/60 px-6 py-14 text-center">
      <div className="mb-4 rounded-2xl bg-primary/10 p-4 text-primary">
        {getIcon(icon)}
      </div>

      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}