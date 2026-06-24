"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  BoardColumn,
  Project,
  Ticket,
  TicketPriority,
  User,
} from "@/lib/types";
import * as api from "@/lib/api";

interface NewTicketInput {
  columnId: number;
  title: string;
  description?: string;
  assigneeId?: number | null;
  priority?: TicketPriority;
}

interface InviteResponse {
  ok: boolean;
  message: string;
  user: User;
}

interface BoardContextValue {
  projects: Project[];
  projectColumns: BoardColumn[];
  tickets: Ticket[];
  projectMembersList: User[];
  currentUser: User;
  activeProjectId: number;
  setActiveProjectId: (id: number) => void;
  isLoading: boolean;

  getUser: (id: number | null | undefined) => User | undefined;
  ticketsByColumn: (columnId: number) => Ticket[];

  createProject: (name: string, description?: string) => void;
  addTicket: (input: NewTicketInput) => Promise<Ticket>;
  updateTicket: (id: number, patch: Partial<Ticket>) => Promise<any>;
  deleteTicket: (id: number) => void;
  moveTicket: (ticketId: number, toColumnId: number, toIndex: number) => void;
  addColumn: (title: string) => void;
  renameColumn: (id: number, title: string) => void;
  deleteColumn: (id: number) => void;
  inviteMember: (id: number, email: string) => Promise<InviteResponse>;
}

const BoardContext = createContext<BoardContextValue | null>(null);

export function BoardProvider({
  children,
  currentUser,
}: {
  children: ReactNode;
  currentUser: User;
}) {
  const queryClient = useQueryClient();
  const [activeProjectId, setActiveProjectId] = useState<number>(1);

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: api.getProjects,
  });

  const { data: projectColumns = [] } = useQuery({
    queryKey: ["columns", activeProjectId],
    queryFn: () => api.getProjectColumns(activeProjectId),
    enabled: !!activeProjectId,
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ["tickets", activeProjectId],
    queryFn: async () => {
      const columns = await api.getProjectColumns(activeProjectId);
      const promises = columns.map((c: BoardColumn) =>
        api.getColumnTickets(c.id),
      );
      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: !!activeProjectId,
  });

  const { data: projectMembersList = [] } = useQuery({
    queryKey: ["members", activeProjectId],
    queryFn: () => api.getProjectMembers(activeProjectId),
    enabled: !!activeProjectId,
  });

  // Mutations
  const createProjectMutation = useMutation({
    mutationFn: ({
      name,
      description,
    }: {
      name: string;
      description?: string;
    }) => api.createProject(name, description),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const addColumnMutation = useMutation({
    mutationFn: (title: string) => api.createColumn(activeProjectId, title),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["columns", activeProjectId] }),
  });

  const renameColumnMutation = useMutation({
    mutationFn: ({ id, title }: { id: number; title: string }) =>
      api.updateColumn(id, title),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["columns", activeProjectId] }),
  });

  const deleteColumnMutation = useMutation({
    mutationFn: api.deleteColumn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns", activeProjectId] });
      queryClient.invalidateQueries({ queryKey: ["tickets", activeProjectId] });
    },
  });

  const addTicketMutation = useMutation({
    mutationFn: (input: NewTicketInput) =>
      api.createTicket(input.columnId, {
        title: input.title,
        description: input.description,
        assigneeId: input.assigneeId,
        priority: input.priority,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tickets", activeProjectId] }),
  });

  const updateTicketMutation = useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: Partial<Ticket> }) =>
      api.updateTicket(id, patch),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tickets", activeProjectId] }),
  });

  const moveTicketMutation = useMutation({
    mutationFn: ({
      ticketId,
      toColumnId,
      toIndex,
    }: {
      ticketId: number;
      toColumnId: number;
      toIndex: number;
    }) =>
      api.updateTicket(ticketId, { columnId: toColumnId, position: toIndex }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tickets", activeProjectId] }),
  });

  const deleteTicketMutation = useMutation({
    mutationFn: api.deleteTicket,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tickets", activeProjectId] }),
    onError: (err) => {
      console.error("Delete column failed:", err);
    },
  });

  const inviteMemberMutation = useMutation({
    mutationFn: ({
      activeProjectId,
      email,
    }: {
      activeProjectId: number;
      email: string;
    }) => api.inviteMember(activeProjectId, email),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["members", activeProjectId],
      });
    },
  });

  const value: BoardContextValue = {
    projects,
    projectColumns,
    tickets,
    projectMembersList,
    currentUser,
    activeProjectId,
    setActiveProjectId,
    isLoading: false,

    getUser: (id) => projectMembersList.find((u) => u.id === id),
    ticketsByColumn: (columnId) =>
      tickets
        .filter((t) => t.columnId === columnId)
        .sort((a, b) => a.position - b.position),

    createProject: (name, description) =>
      createProjectMutation.mutate({ name, description }),

    addColumn: (title) => addColumnMutation.mutate(title),
    renameColumn: (id, title) => renameColumnMutation.mutate({ id, title }),
    deleteColumn: (id) => deleteColumnMutation.mutate(id),
    addTicket: (input) => addTicketMutation.mutateAsync(input),
    updateTicket: (id, patch) =>
      updateTicketMutation.mutateAsync({ id, patch }),

    deleteTicket: (id) => deleteTicketMutation.mutate(id),
    moveTicket: (ticketId, toColumnId, toIndex) =>
      moveTicketMutation.mutate({ ticketId, toColumnId, toIndex }),

    inviteMember: (id, email) =>
      inviteMemberMutation.mutateAsync({ activeProjectId: id, email }),
  };

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
}

export function useBoard() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoard must be used within BoardProvider");
  return ctx;
}
