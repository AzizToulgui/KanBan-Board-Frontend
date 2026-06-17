"use client";

import { useBoard } from "@/components/board-provider";
import { UserAvatar } from "@/components/user-avatar";
import { priorityConfig } from "@/lib/board-utils";
import { cn } from "@/lib/utils";
import type { Ticket } from "@/lib/types";
import { MessageSquare, Paperclip } from "lucide-react";

export function TicketCard({
  ticket,
  onClick,
  dragging,
  overlay,
}: {
  ticket: Ticket;
  onClick?: () => void;
  dragging?: boolean;
  overlay?: boolean;
}) {
  const { getUser } = useBoard();
  const assignee = getUser(ticket.assigneeId);
  const priority = priorityConfig[ticket.priority];

  const comments = ticket.id % 4;
  const attachments = ticket.id % 3 === 0 ? (ticket.id % 2) + 1 : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-full select-none rounded-lg border border-border bg-card p-3 text-left shadow-sm transition-all",
        "hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        dragging && "opacity-40",
        overlay && "rotate-2 cursor-grabbing border-primary/50 shadow-lg",
      )}
    >
      <div className="mb-2 flex items-center gap-1.5">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
            priority.bg,
            priority.text,
          )}
        >
          <span className={cn("size-1.5 rounded-full", priority.dot)} />
          {priority.label}
        </span>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">
          {ticket.key}
        </span>
      </div>

      <p className="text-sm font-medium leading-snug text-card-foreground text-pretty">
        {ticket.title}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-muted-foreground">
          {comments > 0 && (
            <span className="flex items-center gap-1 text-xs">
              <MessageSquare className="size-3.5" />
              {comments}
            </span>
          )}
          {attachments > 0 && (
            <span className="flex items-center gap-1 text-xs">
              <Paperclip className="size-3.5" />
              {attachments}
            </span>
          )}
        </div>
        <UserAvatar user={assignee} size="sm" />
      </div>
    </button>
  );
}
