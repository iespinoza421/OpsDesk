"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Rows3 } from "lucide-react";

type PageSizeSelectorProps = {
  currentPageSize: number;
};

export default function PageSizeSelector({
  currentPageSize,
}: PageSizeSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "10") {
      params.delete("pageSize");
    } else {
      params.set("pageSize", value);
    }

    params.delete("page");
    router.push(`/tickets?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
      <Rows3 size={15} className="text-muted-foreground" />
      <label className="text-sm text-muted-foreground">Show</label>
      <select
        value={String(currentPageSize)}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-transparent text-sm font-medium text-foreground outline-none"
      >
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
    </div>
  );
}