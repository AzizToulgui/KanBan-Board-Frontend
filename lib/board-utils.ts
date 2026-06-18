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

export const priorityConfig: Record<
  TicketPriority,
  { label: string; dot: string; text: string; bg: string }
> = {
  low: {
    label: "Low",
    dot: "bg-muted-foreground/60",
    text: "text-muted-foreground",
    bg: "bg-muted",
  },
  medium: {
    label: "Medium",
    dot: "bg-sky-500",
    text: "text-sky-700 dark:text-sky-300",
    bg: "bg-sky-500/10",
  },
  high: {
    label: "High",
    dot: "bg-orange-500",
    text: "text-orange-700 dark:text-orange-300",
    bg: "bg-orange-500/10",
  },
  urgent: {
    label: "Urgent",
    dot: "bg-red-600",
    text: "text-red-700 dark:text-red-400",
    bg: "bg-red-500/10",
  },
};
