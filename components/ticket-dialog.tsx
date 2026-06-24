"use client";

import { useEffect, useState } from "react";
import { useBoard } from "@/components/board-provider";
import { UserAvatar } from "@/components/user-avatar";
import { priorityConfig } from "@/lib/board-utils";
import type { Ticket, TicketPriority, TicketAttachment } from "@/lib/types";
import { cn } from "@/lib/utils";
import * as api from "@/lib/api";
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
import { Trash2, Upload, File, Eye, X } from "lucide-react";
import { AttachmentPreviewModal } from "./AttachmentPreviewModal";

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
    addTicket,
    updateTicket,
    deleteTicket,
  } = useBoard();

  const isEdit = Boolean(ticket);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [assignee, setAssignee] = useState<string>(UNASSIGNED);

  const [existingAttachments, setExistingAttachments] = useState<
    TicketAttachment[]
  >([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [previewAttachment, setPreviewAttachment] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (ticket?.id) {
      setTitle(ticket.title);
      setDescription(ticket.description ?? "");
      setPriority(ticket.priority);
      setAssignee(ticket.assigneeId ? String(ticket.assigneeId) : UNASSIGNED);

      api
        .getTicketAttachments(ticket.id)
        .then(setExistingAttachments)
        .catch(console.error);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setAssignee(UNASSIGNED);
      setExistingAttachments([]);
    }
    setPendingFiles([]);
  }, [open, ticket]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setPendingFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const assigneeId = assignee === UNASSIGNED ? null : Number(assignee);
    setIsSaving(true);

    try {
      let ticketId: number;

      if (isEdit && ticket) {
        await updateTicket(ticket.id, {
          title: trimmed,
          description: description.trim() || null,
          priority,
          assigneeId,
        });
        ticketId = ticket.id;
      } else if (columnId) {
        const newTicket = await addTicket({
          columnId,
          title: trimmed,
          description: description.trim() || undefined,
          priority,
          assigneeId,
        });
        ticketId = newTicket.id;
      } else {
        return;
      }

      // Upload pending files
      for (const file of pendingFiles) {
        await api.uploadAttachment(ticketId, file);
      }

      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save ticket or upload attachments");
    } finally {
      setIsSaving(false);
    }
  };

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
          {/* Title */}
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

          {/* Description */}
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

          {/* Priority & Assignee */}
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

          {/* Attachments */}
          <div className="flex flex-col gap-1.5">
            <Label>Attachments (Optional)</Label>

            <label className="cursor-pointer inline-block">
              <Button variant="outline" size="sm" disabled={isSaving} asChild>
                <span>
                  <Upload className="mr-2 size-4" />
                  Add Files
                </span>
              </Button>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.txt,.zip"
              />
            </label>

            {/* Pending Files */}
            {pendingFiles.length > 0 && (
              <div className="mt-2 space-y-2">
                <p className="text-xs text-muted-foreground">Pending upload:</p>
                {pendingFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border bg-muted/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <File className="size-5 text-muted-foreground" />
                      <span className="text-sm truncate max-w-60">
                        {file.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePendingFile(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Existing Attachments */}
            {isEdit && existingAttachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-muted-foreground">Existing files:</p>
                {existingAttachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between rounded-md border bg-muted/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <File className="size-5 text-muted-foreground" />
                      <span className="text-sm truncate max-w-60">
                        {att.fileName}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewAttachment(att)}
                    >
                      <Eye className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
            <Button onClick={handleSave} disabled={!title.trim() || isSaving}>
              {isSaving
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Create ticket"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      <AttachmentPreviewModal
        open={!!previewAttachment}
        onOpenChange={() => setPreviewAttachment(null)}
        attachment={previewAttachment}
      />
    </Dialog>
  );
}
