"use client";

import { useBoard } from "@/components/board-provider";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InviteDialog } from "@/components/invite-dialog";
import { displayName } from "@/lib/board-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function BoardHeader({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const { projects, activeProjectId, projectMembersList, getUser } = useBoard();
  const project = projects.find((p) => p.id === activeProjectId)!;
  const owner = getUser(project.ownerId);

  const visibleMembers = projectMembersList.slice(0, 5);
  const overflow = projectMembersList.length - visibleMembers.length;

  return (
    <header className="border-b border-border bg-card">
      <div className="flex flex-col gap-3 px-4 py-4 md:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
                {project.name}
              </h1>
              <button
                className="text-muted-foreground transition-colors hover:text-chart-4"
                aria-label="Star project"
              >
                <Star className="size-4" />
              </button>
            </div>
            {project.description && (
              <p className="mt-0.5 max-w-2xl truncate text-sm text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {/* Member stack */}
            <div className="flex items-center -space-x-2">
              {visibleMembers.map((m) => (
                <Tooltip key={m.id}>
                  <TooltipTrigger asChild>
                    <span>
                      <UserAvatar user={m} size="md" ring />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {displayName(m)}
                    {m.id === owner?.id ? " · Owner" : ""}
                  </TooltipContent>
                </Tooltip>
              ))}
              {overflow > 0 && (
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground ring-2 ring-background">
                  +{overflow}
                </span>
              )}
            </div>
            <InviteDialog />
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tickets..."
              className="h-9 pl-8"
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <SlidersHorizontal className="size-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
