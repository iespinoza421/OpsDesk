type Activity = {
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

type TicketActivityProps = {
  activities: Activity[];
};

function formatValue(value: string | null) {
  if (!value) return "Unassigned";
  if (value === "IN_PROGRESS") return "IN PROGRESS";
  return value;
}

function formatAction(activity: Activity) {
  switch (activity.action) {
    case "UPDATED_STATUS":
      return `${activity.actor.name} changed status from ${formatValue(
        activity.oldValue
      )} to ${formatValue(activity.newValue)}`;
    case "UPDATED_PRIORITY":
      return `${activity.actor.name} changed priority from ${formatValue(
        activity.oldValue
      )} to ${formatValue(activity.newValue)}`;
    case "UPDATED_ASSIGNEE":
      return `${activity.actor.name} changed assignee`;
    default:
      return `${activity.actor.name} updated the ticket`;
  }
}

export default function TicketActivity({
  activities,
}: TicketActivityProps) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow">
      <h2 className="mb-4 text-2xl font-semibold text-white">Activity</h2>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-slate-400">No activity yet.</p>
        ) : (
          activities.map((activity) => (
            <article
              key={activity.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-200">
                    {formatAction(activity)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {activity.actor.email} • {activity.actor.role}
                  </p>
                </div>

                <p className="text-xs text-slate-500">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}