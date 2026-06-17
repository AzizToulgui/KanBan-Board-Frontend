// Types mirror the NestJS/Drizzle backend schema

export interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface ProjectMember {
  projectId: number;
  userId: number;
  role: "Owner" | "Admin" | "Member";
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  ownerId: number;
  createdAt: string;
}

export interface BoardColumn {
  id: number;
  projectId: number;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface Ticket {
  id: number;
  columnId: number;
  title: string;
  description: string | null;
  assigneeId: number | null;
  position: number;
  priority: TicketPriority;
  // synthetic display field, not in DB
  key: string;
  createdAt: string;
  updatedAt: string;
}
