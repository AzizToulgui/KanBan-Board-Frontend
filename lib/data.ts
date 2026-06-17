import type {
  User,
  Project,
  ProjectMember,
  BoardColumn,
  Ticket,
} from "./types";

export const users: User[] = [
  {
    id: 1,
    email: "sarah.chen@northwind.io",
    name: "Sarah Chen",
    createdAt: "2024-01-12",
  },
  {
    id: 2,
    email: "marcus.webb@northwind.io",
    name: "Marcus Webb",
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    email: "priya.nair@northwind.io",
    name: "Priya Nair",
    createdAt: "2024-02-02",
  },
  {
    id: 4,
    email: "diego.ramos@northwind.io",
    name: "Diego Ramos",
    createdAt: "2024-02-15",
  },
  {
    id: 5,
    email: "hannah.kim@northwind.io",
    name: "Hannah Kim",
    createdAt: "2024-03-01",
  },
  {
    id: 6,
    email: "tom.alvarez@northwind.io",
    name: "Tom Alvarez",
    createdAt: "2024-03-10",
  },
  {
    id: 7,
    email: "lena.müller@northwind.io",
    name: "Lena Müller",
    createdAt: "2024-03-22",
  },
];

// Current signed-in user
export const currentUserId = 1;

export const projects: Project[] = [
  {
    id: 1,
    name: "Atlas Web Platform",
    description: "Customer-facing web application and marketing site rebuild.",
    ownerId: 1,
    createdAt: "2024-04-01",
  },
  {
    id: 2,
    name: "Mobile App v2",
    description: "Native iOS and Android experience with offline support.",
    ownerId: 1,
    createdAt: "2024-04-18",
  },
  {
    id: 3,
    name: "Billing & Payments",
    description: "Subscription engine, invoicing, and dunning workflows.",
    ownerId: 2,
    createdAt: "2024-05-02",
  },
  {
    id: 4,
    name: "Design System",
    description: "Shared component library and design tokens.",
    ownerId: 3,
    createdAt: "2024-05-20",
  },
];

export const projectMembers: ProjectMember[] = [
  { projectId: 1, userId: 1, role: "Owner" },
  { projectId: 1, userId: 2, role: "Admin" },
  { projectId: 1, userId: 3, role: "Member" },
  { projectId: 1, userId: 4, role: "Member" },
  { projectId: 1, userId: 5, role: "Member" },
  { projectId: 2, userId: 1, role: "Owner" },
  { projectId: 2, userId: 6, role: "Member" },
  { projectId: 3, userId: 2, role: "Owner" },
  { projectId: 3, userId: 1, role: "Admin" },
  { projectId: 4, userId: 3, role: "Owner" },
];

export const boardColumns: BoardColumn[] = [
  {
    id: 1,
    projectId: 1,
    title: "Backlog",
    position: 0,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: 2,
    projectId: 1,
    title: "To Do",
    position: 1,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: 3,
    projectId: 1,
    title: "In Progress",
    position: 2,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: 4,
    projectId: 1,
    title: "In Review",
    position: 3,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: 5,
    projectId: 1,
    title: "Done",
    position: 4,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
];

export const tickets: Ticket[] = [
  {
    id: 1,
    columnId: 1,
    key: "ATL-118",
    title: "Audit current marketing site for accessibility gaps",
    description:
      "Run automated and manual a11y audits across all top-level pages and document WCAG AA issues.",
    assigneeId: 3,
    position: 0,
    priority: "medium",
    createdAt: "2024-05-10",
    updatedAt: "2024-05-12",
  },
  {
    id: 2,
    columnId: 1,
    key: "ATL-121",
    title: "Research headless CMS options",
    description:
      "Compare Sanity, Contentful, and Payload for editorial workflows and pricing.",
    assigneeId: null,
    position: 1,
    priority: "low",
    createdAt: "2024-05-11",
    updatedAt: "2024-05-11",
  },
  {
    id: 3,
    columnId: 1,
    key: "ATL-130",
    title: "Define analytics event taxonomy",
    description:
      "Establish naming conventions for product analytics events before instrumentation.",
    assigneeId: 5,
    position: 2,
    priority: "low",
    createdAt: "2024-05-13",
    updatedAt: "2024-05-13",
  },
  {
    id: 4,
    columnId: 2,
    key: "ATL-104",
    title: "Build responsive navigation header",
    description:
      "Implement the new global navigation with mega-menu and mobile drawer.",
    assigneeId: 2,
    position: 0,
    priority: "high",
    createdAt: "2024-05-08",
    updatedAt: "2024-05-14",
  },
  {
    id: 5,
    columnId: 2,
    key: "ATL-109",
    title: "Set up design tokens pipeline",
    description:
      "Sync Figma variables to CSS custom properties via Style Dictionary.",
    assigneeId: 3,
    position: 1,
    priority: "medium",
    createdAt: "2024-05-09",
    updatedAt: "2024-05-09",
  },
  {
    id: 6,
    columnId: 3,
    key: "ATL-097",
    title: "Implement authentication flow",
    description:
      "Email + password login, session handling, and protected routes.",
    assigneeId: 1,
    position: 0,
    priority: "urgent",
    createdAt: "2024-05-05",
    updatedAt: "2024-05-15",
  },
  {
    id: 7,
    columnId: 3,
    key: "ATL-101",
    title: "Hero section animation polish",
    description:
      "Refine entrance animations and reduce layout shift on first paint.",
    assigneeId: 4,
    position: 1,
    priority: "medium",
    createdAt: "2024-05-06",
    updatedAt: "2024-05-15",
  },
  {
    id: 8,
    columnId: 4,
    key: "ATL-088",
    title: "Code review: pricing page revamp",
    description:
      "Review PR #342 covering the new tiered pricing layout and toggle.",
    assigneeId: 2,
    position: 0,
    priority: "high",
    createdAt: "2024-05-03",
    updatedAt: "2024-05-16",
  },
  {
    id: 9,
    columnId: 5,
    key: "ATL-072",
    title: "Migrate landing page to new stack",
    description:
      "Completed migration from legacy templates to the component library.",
    assigneeId: 5,
    position: 0,
    priority: "medium",
    createdAt: "2024-04-28",
    updatedAt: "2024-05-10",
  },
  {
    id: 10,
    columnId: 5,
    key: "ATL-079",
    title: "Set up CI/CD preview deployments",
    description:
      "Preview environments now spin up per pull request automatically.",
    assigneeId: 1,
    position: 1,
    priority: "high",
    createdAt: "2024-04-30",
    updatedAt: "2024-05-09",
  },
];
