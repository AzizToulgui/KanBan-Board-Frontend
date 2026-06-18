"use client";

import { useBoard } from "@/components/board-provider";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { displayName } from "@/lib/board-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  KanbanSquare,
  LayoutGrid,
  Plus,
  Settings,
  Users,
  Inbox,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";
import { NewProjectDialog } from "./new-project-dialog";

export function AppSidebar() {
  const { projects, activeProjectId, setActiveProjectId, currentUser } =
    useBoard();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <KanbanSquare className="size-4" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
          Northwind
        </span>
        <span className="ml-auto rounded-md border border-sidebar-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          Pro
        </span>
      </div>

      {/* Quick nav */}
      <nav className="flex flex-col gap-0.5 p-3">
        <SidebarLink
          icon={<LayoutGrid className="size-4" />}
          label="Overview"
        />
        <SidebarLink
          icon={<KanbanSquare className="size-4" />}
          label="Boards"
          active
        />
        <SidebarLink
          icon={<Inbox className="size-4" />}
          label="Inbox"
          badge="3"
        />
        <SidebarLink icon={<Users className="size-4" />} label="People" />
      </nav>

      {/* Projects */}
      <div className="flex items-center justify-between px-4 pb-1.5 pt-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Projects
        </span>
        <NewProjectDialog />
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        <ul className="flex flex-col gap-0.5">
          {projects.map((p) => {
            const active = p.id === activeProjectId;
            return (
              <li key={p.id}>
                <button
                  onClick={() => setActiveProjectId(p.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60",
                  )}
                >
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-[3px]",
                      active ? "bg-primary" : "bg-muted-foreground/40",
                    )}
                  />
                  <span className="truncate">{p.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* User */}
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-md p-1.5 text-left transition-colors hover:bg-sidebar-accent">
            <UserAvatar user={currentUser} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {displayName(currentUser)}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {currentUser.email}
              </p>
            </div>
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuItem>
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="size-4" />
                Manage team
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

function SidebarLink({
  icon,
  label,
  active,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <button
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
        active
          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60",
      )}
    >
      <span className={active ? "text-primary" : "text-muted-foreground"}>
        {icon}
      </span>
      {label}
      {badge && (
        <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
          {badge}
        </span>
      )}
    </button>
  );
}
