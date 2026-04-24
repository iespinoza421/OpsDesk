"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type ChartItem = {
  name: string;
  value: number;
};

type DashboardChartsProps = {
  statusData: ChartItem[];
  priorityData: ChartItem[];
  assignedData: ChartItem[];
};

const COLORS = [
  "hsl(45 93% 47%)",
  "hsl(217 91% 60%)",
  "hsl(142 71% 45%)",
  "hsl(0 84% 60%)",
  "hsl(215 16% 47%)",
];

export default function DashboardCharts({
  statusData,
  priorityData,
  assignedData,
}: DashboardChartsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 2xl:grid-cols-3">
      <section className="rounded-2xl border border-border bg-card/80 p-4 shadow-lg backdrop-blur sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-card-foreground sm:text-xl">
          Tickets by Status
        </h2>

        <div className="h-72 min-h-[288px] sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  color: "var(--card-foreground)",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card/80 p-4 shadow-lg backdrop-blur sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-card-foreground sm:text-xl">
          Tickets by Priority
        </h2>

        <div className="h-72 min-h-[288px] sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {priorityData.map((entry, index) => (
                  <Cell
                    key={`priority-${entry.name}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  color: "var(--card-foreground)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card/80 p-4 shadow-lg backdrop-blur sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-card-foreground sm:text-xl">
          Tickets by Assignee
        </h2>

        <div className="h-72 min-h-[288px] sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assignedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  color: "var(--card-foreground)",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}