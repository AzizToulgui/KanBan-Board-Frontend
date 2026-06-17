"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useBoard } from "@/components/board-provider";
import { BoardColumnView } from "@/components/board-column";
import { TicketCard } from "@/components/ticket-card";
import { AddColumn } from "@/components/add-column";
import { TicketDialog } from "@/components/ticket-dialog";
import type { Ticket } from "@/lib/types";

export function KanbanBoard({ search = "" }: { search?: string }) {
  const { projectColumns, tickets, ticketsByColumn, moveTicket } = useBoard();
  const query = search.trim().toLowerCase();

  function visibleTickets(columnId: number) {
    const list = ticketsByColumn(columnId);
    if (!query) return list;
    return list.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.key.toLowerCase().includes(query) ||
        (t.description ?? "").toLowerCase().includes(query),
    );
  }
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [openTicket, setOpenTicket] = useState<Ticket | null>(null);
  const [createInColumn, setCreateInColumn] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const ticketById = useMemo(() => {
    const map = new Map<number, Ticket>();
    for (const t of tickets) map.set(t.id, t);
    return map;
  }, [tickets]);

  function resolveColumnId(overId: string | number): number | null {
    if (typeof overId === "string" && overId.startsWith("column-")) {
      return Number(overId.slice("column-".length));
    }
    const t = ticketById.get(Number(overId));
    return t ? t.columnId : null;
  }

  function resolveIndex(overId: string | number, columnId: number): number {
    const list = ticketsByColumn(columnId);
    if (typeof overId === "string" && overId.startsWith("column-")) {
      return list.length;
    }
    const idx = list.findIndex((t) => t.id === Number(overId));
    return idx === -1 ? list.length : idx;
  }

  function handleDragStart(event: DragStartEvent) {
    const t = ticketById.get(Number(event.active.id));
    if (t) setActiveTicket(t);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeTicketObj = ticketById.get(Number(active.id));
    if (!activeTicketObj) return;

    const overColumnId = resolveColumnId(over.id);
    if (overColumnId == null) return;

    if (activeTicketObj.columnId !== overColumnId) {
      const index = resolveIndex(over.id, overColumnId);
      moveTicket(activeTicketObj.id, overColumnId, index);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTicket(null);
    if (!over) return;
    const activeId = Number(active.id);
    const overColumnId = resolveColumnId(over.id);
    if (overColumnId == null) return;
    const index = resolveIndex(over.id, overColumnId);
    moveTicket(activeId, overColumnId, index);
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTicket(null)}
      >
        <div className="flex h-full items-stretch gap-4 overflow-x-auto p-4 md:p-6">
          {projectColumns.map((column) => (
            <BoardColumnView
              key={column.id}
              column={column}
              tickets={visibleTickets(column.id)}
              onAddTicket={(columnId) => setCreateInColumn(columnId)}
              onOpenTicket={(ticket) => setOpenTicket(ticket)}
            />
          ))}
          <AddColumn />
        </div>

        <DragOverlay
          dropAnimation={{
            duration: 200,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
        >
          {activeTicket ? (
            <div className="w-72">
              <TicketCard ticket={activeTicket} overlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Edit existing ticket */}
      <TicketDialog
        open={openTicket !== null}
        onOpenChange={(o) => !o && setOpenTicket(null)}
        ticket={openTicket}
      />

      {/* Create new ticket */}
      <TicketDialog
        open={createInColumn !== null}
        onOpenChange={(o) => !o && setCreateInColumn(null)}
        columnId={createInColumn ?? undefined}
      />
    </>
  );
}
