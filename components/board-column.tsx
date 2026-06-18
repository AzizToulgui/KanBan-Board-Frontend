"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTicket } from "@/components/sortable-tickets";
import { useBoard } from "@/components/board-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { BoardColumn, Ticket } from "@/lib/types";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

export function BoardColumnView({
  column,
  tickets,
  onAddTicket,
  onOpenTicket,
}: {
  column: BoardColumn;
  tickets: Ticket[];
  onAddTicket: (columnId: number) => void;
  onOpenTicket: (ticket: Ticket) => void;
}) {
  const { renameColumn, deleteColumn } = useBoard();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: { type: "column", columnId: column.id },
  });

  function commitRename() {
    const trimmed = title.trim();
    if (trimmed) renameColumn(column.id, trimmed);
    else setTitle(column.title);
    setEditing(false);
  }

  return (
    <div className="flex h-full w-72 shrink-0 flex-col rounded-xl border border-border bg-muted/40">
      {/* Column header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className="size-2 rounded-full bg-primary/70" />
        {editing ? (
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") {
                setTitle(column.title);
                setEditing(false);
              }
            }}
            className="h-7 py-0 text-sm font-semibold"
          />
        ) : (
          <h2 className="text-sm font-semibold text-foreground">
            {column.title}
          </h2>
        )}
        <span className="rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
          {tickets.length}
        </span>
        <div className="ml-auto flex items-center">
          <button
            onClick={() => onAddTicket(column.id)}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Add ticket"
          >
            <Plus className="size-4" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Column options"
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onSelect={() => setEditing(true)}>
                <Pencil className="size-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onAddTicket(column.id)}>
                <Plus className="size-4" />
                Add ticket
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => deleteColumn(column.id)}
              >
                <Trash2 className="size-4" />
                Delete column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Droppable ticket list */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2 transition-colors",
          isOver && "rounded-b-xl bg-primary/5",
        )}
      >
        <SortableContext
          items={tickets.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tickets.map((ticket) => (
            <SortableTicket
              key={ticket.id}
              ticket={ticket}
              onClick={() => onOpenTicket(ticket)}
            />
          ))}
        </SortableContext>

        {tickets.length === 0 && (
          <div
            className={cn(
              "flex flex-1 items-center justify-center rounded-lg border border-dashed border-border py-8 text-center text-xs text-muted-foreground transition-colors",
              isOver && "border-primary/40 text-primary",
            )}
          >
            Drop tickets here
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddTicket(column.id)}
          className="mt-0.5 w-full justify-start gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <Plus className="size-4" />
          Add ticket
        </Button>
      </div>
    </div>
  );
}
