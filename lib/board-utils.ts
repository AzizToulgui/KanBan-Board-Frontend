import type { TicketPriority, User } from "./types";

export function initials(name: string | null, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

export function displayName(user: User | undefined | null): string {
  if (!user) return "Unassigned";
  return user.name ?? user.email;
}

// Deterministic avatar background color from a user id (uses chart tokens)
const avatarTokens = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];
export function avatarColor(id: number): string {
  return avatarTokens[id % avatarTokens.length];
}

export const priorityConfig: Record<
  TicketPriority,
  { label: string; dot: string; text: string; bg: string }
> = {
  low: {
    label: "Low",
    dot: "bg-muted-foreground/50",
    text: "text-muted-foreground",
    bg: "bg-muted",
  },
  medium: {
    label: "Medium",
    dot: "bg-chart-2",
    text: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  high: {
    label: "High",
    dot: "bg-chart-4",
    text: "text-chart-4",
    bg: "bg-chart-4/10",
  },
  urgent: {
    label: "Urgent",
    dot: "bg-destructive",
    text: "text-destructive",
    bg: "bg-destructive/10",
  },
};
