const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL;

async function getToken() {
  return localStorage.getItem("token");
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Login failed");
  return res.json();
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error((await res.json()).message || "Registration failed");
  return res.json();
}

export async function getProjects() {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function createProject(name: string, description?: string) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description }),
  });
  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
}

export async function getProjectColumns(projectId: number) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/board-columns/project/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch columns");
  return res.json();
}

export async function createColumn(projectId: number, title: string) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/board-columns/project/${projectId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create column");
  return res.json();
}

export async function updateColumn(columnId: number, title: string) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/board-columns/${columnId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to update column");
  return res.json();
}

export async function deleteColumn(columnId: number) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/board-columns/${columnId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete column");
}

export async function getColumnTickets(columnId: number) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/tickets/column/${columnId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch tickets");
  return res.json();
}

export async function createTicket(
  columnId: number,
  data: {
    title: string;
    description?: string;
    assigneeId?: number | null;
    priority?: "low" | "medium" | "high" | "urgent";
  },
) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/tickets/column/${columnId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create ticket");
  return res.json();
}

export async function updateTicket(ticketId: number, patch: any) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/tickets/${ticketId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update ticket");
  return res.json();
}

export async function deleteTicket(id: number) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/tickets/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete ticket");
}

export async function inviteMember(projectId: number, email: string) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/projects/${projectId}/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Failed to invite member");
  return res.json();
}

export async function getProjectMembers(projectId: number) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/projects/${projectId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch members");
  return res.json();
}
