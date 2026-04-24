import MotionCard from "@/components/MotionCard";
import {
  ClipboardList,
  FolderOpen,
  LoaderCircle,
  CheckCircle2,
  AlertTriangle,
  UserCircle2,
} from "lucide-react";

type MetricCardProps = {
  title: string;
  value: number;
};

function getIcon(title: string) {
  switch (title) {
    case "Total":
      return <ClipboardList size={22} />;
    case "Open":
      return <FolderOpen size={22} />;
    case "In Progress":
      return <LoaderCircle size={22} />;
    case "Closed":
      return <CheckCircle2 size={22} />;
    case "High Priority":
      return <AlertTriangle size={22} />;
    case "My Tickets":
      return <UserCircle2 size={22} />;
    default:
      return <ClipboardList size={22} />;
  }
}

export default function MetricCard({ title, value }: MetricCardProps) {
  return (
    <MotionCard className="rounded-2xl border border-border bg-card/80 p-5 shadow-lg backdrop-blur transition hover:border-primary/40 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          {getIcon(title)}
        </div>
      </div>
    </MotionCard>
  );
}