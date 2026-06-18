"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/board-utils";
import type { User } from "@/lib/types";

const sizeMap = {
  xs: "size-5 text-[10px]",
  sm: "size-6 text-[11px]",
  md: "size-7 text-xs",
  lg: "size-9 text-sm",
} as const;

export function UserAvatar({
  user,
  size = "md",
  className,
  ring = false,
}: {
  user: User | null | undefined;
  size?: keyof typeof sizeMap;
  className?: string;
  ring?: boolean;
}) {
  if (!user) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-dashed border-border bg-muted text-muted-foreground",
          sizeMap[size],
          className,
        )}
        aria-label="Unassigned"
      >
        ?
      </span>
    );
  }

  return (
    <Avatar
      className={cn(sizeMap[size], ring && "ring-2 ring-background", className)}
    >
      <AvatarFallback
        className="font-semibold text-white! bg-primary"
        title={user.name ?? user.email}
      >
        {initials(user.name, user.email)}
      </AvatarFallback>
    </Avatar>
  );
}
