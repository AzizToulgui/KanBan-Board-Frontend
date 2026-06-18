"use client";

import { useEffect, useState } from "react";
import { useBoard } from "@/components/board-provider";
import { UserAvatar } from "@/components/user-avatar";
import { priorityConfig } from "@/lib/board-utils";
import type { Ticket, TicketPriority } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

const priorities: TicketPriority[] = ["low", "medium", "high", "urgent"];
const UNASSIGNED = "unassigned";

export function TicketDialog({
  open,
  onOpenChange,
  ticket,
  columnId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket?: Ticket | null;
  columnId?: number;
}) {
  const {
    projectMembersList,
    projectColumns,
    getUser,
    addTicket,
    updateTicket,
    deleteTicket,
  } = useBoard();

  const isEdit = Boolean(ticket);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [assignee, setAssignee] = useState<string>(UNASSIGNED);

  useEffect(() => {
    if (!open) return;
    if (ticket) {
      setTitle(ticket.title);
      setDescription(ticket.description ?? "");
      setPriority(ticket.priority);
      setAssignee(ticket.assigneeId ? String(ticket.assigneeId) : UNASSIGNED);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setAssignee(UNASSIGNED);
    }
  }, [open, ticket]);

  function handleSave() {
    const trimmed = title.trim();
    if (!trimmed) return;
    const assigneeId = assignee === UNASSIGNED ? null : Number(assignee);

    if (ticket) {
      updateTicket(ticket.id, {
        title: trimmed,
        description: description.trim() || null,
        priority,
        assigneeId,
      });
    } else if (columnId != null) {
      addTicket({
        columnId,
        title: trimmed,
        description: description.trim() || undefined,
        priority,
        assigneeId,
      });
    }
    onOpenChange(false);
  }

  const column = ticket
    ? projectColumns.find((c) => c.id === ticket.columnId)
    : projectColumns.find((c) => c.id === columnId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isEdit && ticket && (
              <span className="font-mono text-xs text-muted-foreground">
                {ticket.key}
              </span>
            )}
            {column && (
              <span className="rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground">
                {column.title}
              </span>
            )}
          </div>
          <DialogTitle>{isEdit ? "Edit ticket" : "Create ticket"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details, priority, and assignee of this ticket."
              : "Add a new ticket with a title, priority, and assignee."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ticket-title">Title</Label>
            <Input
              id="ticket-title"
              value={title}
              autoFocus
              placeholder="e.g. Implement OAuth login flow"
              onChange={(e) => setTitle(e.target.value)}
              className="min-w-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ticket-desc">Description</Label>
            <Textarea
              id="ticket-desc"
              value={description}
              placeholder="Add more detail to this ticket..."
              rows={4}
              onChange={(e) => setDescription(e.target.value)}
              className="max-h-40 resize-none wrap-break-word"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as TicketPriority)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => {
                    const cfg = priorityConfig[p];
                    return (
                      <SelectItem key={p} value={p}>
                        <span className="flex items-center gap-2">
                          <span
                            className={cn("size-2 rounded-full", cfg.dot)}
                          />
                          {cfg.label}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Assignee</Label>
              <Select
                value={assignee}
                onValueChange={(v) => setAssignee(v ?? UNASSIGNED)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNASSIGNED}>
                    <span className="flex items-center gap-2">
                      <UserAvatar user={null} size="xs" />
                      Unassigned
                    </span>
                  </SelectItem>
                  {projectMembersList.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      <span className="flex items-center gap-2">
                        <UserAvatar user={u} size="xs" />
                        {u.name ?? u.email}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          {isEdit && ticket ? (
            <Button
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                deleteTicket(ticket.id);
                onOpenChange(false);
              }}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              {isEdit ? "Save changes" : "Create ticket"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
