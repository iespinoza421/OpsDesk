"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-card-foreground"
        disabled
      >
        <Sun size={16} />
        <span>Theme</span>
      </button>
    );
  }

  const current = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
    >
      {current === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span>{current === "dark" ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}