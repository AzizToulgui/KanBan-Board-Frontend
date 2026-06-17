"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  BoardColumn,
  Project,
  ProjectMember,
  Ticket,
  TicketPriority,
  User,
} from "@/lib/types";
import {
  boardColumns as seedColumns,
  currentUserId,
  projectMembers as seedMembers,
  projects as seedProjects,
  tickets as seedTickets,
  users as seedUsers,
} from "@/lib/data";

interface NewTicketInput {
  columnId: number;
  title: string;
  description?: string;
  assigneeId?: number | null;
  priority?: TicketPriority;
}

interface BoardContextValue {
  users: User[];
  projects: Project[];
  members: ProjectMember[];
  columns: BoardColumn[];
  tickets: Ticket[];
  currentUser: User;
  activeProjectId: number;
  setActiveProjectId: (id: number) => void;
  // derived
  projectColumns: BoardColumn[];
  projectMembersList: User[];
  getUser: (id: number | null | undefined) => User | undefined;
  ticketsByColumn: (columnId: number) => Ticket[];
  // mutations
  moveTicket: (ticketId: number, toColumnId: number, toIndex: number) => void;
  reorderColumns: (orderedIds: number[]) => void;
  addTicket: (input: NewTicketInput) => void;
  updateTicket: (id: number, patch: Partial<Ticket>) => void;
  deleteTicket: (id: number) => void;
  addColumn: (title: string) => void;
  renameColumn: (id: number, title: string) => void;
  deleteColumn: (id: number) => void;
  inviteMember: (
    email: string,
    name: string,
  ) => { ok: boolean; message: string };
  // New
  createProject: (name: string, description?: string) => void;
}

const BoardContext = createContext<BoardContextValue | null>(null);

let ticketSeq = 1000;
let columnSeq = 1000;
let userSeq = 1000;

export function BoardProvider({
  children,
  currentUser: initialUser,
}: {
  children: ReactNode;
  currentUser: User;
}) {
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [members, setMembers] = useState<ProjectMember[]>(seedMembers);
  const [columns, setColumns] = useState<BoardColumn[]>(seedColumns);
  const [tickets, setTickets] = useState<Ticket[]>(seedTickets);
  const [activeProjectId, setActiveProjectId] = useState<number>(
    seedProjects[0].id,
  );

  const currentUser = useMemo(
    () => initialUser || users.find((u) => u.id === currentUserId)!,
    [initialUser, users],
  );

  const projectColumns = useMemo(
    () =>
      columns
        .filter((c) => c.projectId === activeProjectId)
        .sort((a, b) => a.position - b.position),
    [columns, activeProjectId],
  );

  const projectMembersList = useMemo(() => {
    const ids = members
      .filter((m) => m.projectId === activeProjectId)
      .map((m) => m.userId);
    return users.filter((u) => ids.includes(u.id));
  }, [members, users, activeProjectId]);

  const getUser = (id: number | null | undefined) =>
    id == null ? undefined : users.find((u) => u.id === id);

  const ticketsByColumn = (columnId: number) =>
    tickets
      .filter((t) => t.columnId === columnId)
      .sort((a, b) => a.position - b.position);

  function normalizeColumn(list: Ticket[], columnId: number): Ticket[] {
    let pos = 0;
    return list.map((t) =>
      t.columnId === columnId ? { ...t, position: pos++ } : t,
    );
  }

  const moveTicket = (
    ticketId: number,
    toColumnId: number,
    toIndex: number,
  ) => {
    setTickets((prev) => {
      const moving = prev.find((t) => t.id === ticketId);
      if (!moving) return prev;
      const fromColumnId = moving.columnId;

      const dest = prev
        .filter((t) => t.columnId === toColumnId && t.id !== ticketId)
        .sort((a, b) => a.position - b.position);

      const insertIndex = Math.max(0, Math.min(toIndex, dest.length));
      const reorderedDestIds = [
        ...dest.slice(0, insertIndex).map((t) => t.id),
        ticketId,
        ...dest.slice(insertIndex).map((t) => t.id),
      ];

      let next = prev.map((t) =>
        t.id === ticketId
          ? { ...t, columnId: toColumnId, updatedAt: today() }
          : t,
      );

      next = next.map((t) => {
        const idx = reorderedDestIds.indexOf(t.id);
        if (t.columnId === toColumnId && idx !== -1) {
          return { ...t, position: idx };
        }
        return t;
      });

      if (fromColumnId !== toColumnId) {
        const sourceSorted = next
          .filter((t) => t.columnId === fromColumnId)
          .sort((a, b) => a.position - b.position)
          .map((t) => t.id);
        next = next.map((t) =>
          t.columnId === fromColumnId
            ? { ...t, position: sourceSorted.indexOf(t.id) }
            : t,
        );
      }

      return next;
    });
  };

  const reorderColumns = (orderedIds: number[]) => {
    setColumns((prev) =>
      prev.map((c) => {
        const idx = orderedIds.indexOf(c.id);
        return idx === -1 ? c : { ...c, position: idx };
      }),
    );
  };

  const addTicket = (input: NewTicketInput) => {
    setTickets((prev) => {
      const count = prev.filter((t) => t.columnId === input.columnId).length;
      const id = ++ticketSeq;
      const newTicket: Ticket = {
        id,
        columnId: input.columnId,
        title: input.title,
        description: input.description ?? null,
        assigneeId: input.assigneeId ?? null,
        position: count,
        priority: input.priority ?? "medium",
        key: `ATL-${200 + (id % 800)}`,
        createdAt: today(),
        updatedAt: today(),
      };
      return [...prev, newTicket];
    });
  };

  const updateTicket = (id: number, patch: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...patch, updatedAt: today() } : t,
      ),
    );
  };

  const deleteTicket = (id: number) => {
    setTickets((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target) return prev;
      const filtered = prev.filter((t) => t.id !== id);
      return normalizeColumn(filtered, target.columnId);
    });
  };

  const addColumn = (title: string) => {
    setColumns((prev) => {
      const projectCols = prev.filter((c) => c.projectId === activeProjectId);
      const id = ++columnSeq;
      return [
        ...prev,
        {
          id,
          projectId: activeProjectId,
          title,
          position: projectCols.length,
          createdAt: today(),
          updatedAt: today(),
        },
      ];
    });
  };

  const renameColumn = (id: number, title: string) => {
    setColumns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title, updatedAt: today() } : c)),
    );
  };

  const deleteColumn = (id: number) => {
    setColumns((prev) => prev.filter((c) => c.id !== id));
    setTickets((prev) => prev.filter((t) => t.columnId !== id));
  };

  const inviteMember = (email: string, name: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
      return { ok: false, message: "Enter a valid email address." };
    }
    let user = users.find((u) => u.email.toLowerCase() === trimmed);
    if (user) {
      const already = members.some(
        (m) => m.projectId === activeProjectId && m.userId === user!.id,
      );
      if (already) {
        return { ok: false, message: "This person is already a member." };
      }
    } else {
      const id = ++userSeq;
      user = {
        id,
        email: trimmed,
        name: name.trim() || null,
        createdAt: today(),
      };
      setUsers((prev) => [...prev, user!]);
    }
    setMembers((prev) => [
      ...prev,
      { projectId: activeProjectId, userId: user!.id, role: "Member" },
    ]);
    return { ok: true, message: `Invitation sent to ${trimmed}.` };
  };

  const createProject = (name: string, description?: string) => {
    const id = Date.now();
    const newProject: Project = {
      id,
      name: name.trim(),
      description: description?.trim() || null,
      ownerId: currentUser.id,
      createdAt: today(),
    };

    setProjects((prev) => [...prev, newProject]);
    setActiveProjectId(id);

    // Create default columns
    const defaultColumns: BoardColumn[] = [
      {
        id: ++columnSeq,
        projectId: id,
        title: "To Do",
        position: 0,
        createdAt: today(),
        updatedAt: today(),
      },
      {
        id: ++columnSeq,
        projectId: id,
        title: "In Progress",
        position: 1,
        createdAt: today(),
        updatedAt: today(),
      },
      {
        id: ++columnSeq,
        projectId: id,
        title: "Review",
        position: 2,
        createdAt: today(),
        updatedAt: today(),
      },
      {
        id: ++columnSeq,
        projectId: id,
        title: "Done",
        position: 3,
        createdAt: today(),
        updatedAt: today(),
      },
    ];

    setColumns((prev) => [...prev, ...defaultColumns]);
  };

  const value: BoardContextValue = {
    users,
    projects,
    members,
    columns,
    tickets,
    currentUser,
    activeProjectId,
    setActiveProjectId,
    projectColumns,
    projectMembersList,
    getUser,
    ticketsByColumn,
    moveTicket,
    reorderColumns,
    addTicket,
    updateTicket,
    deleteTicket,
    addColumn,
    renameColumn,
    deleteColumn,
    inviteMember,
    createProject,
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

function today() {
  return new Date().toISOString().slice(0, 10);
}
