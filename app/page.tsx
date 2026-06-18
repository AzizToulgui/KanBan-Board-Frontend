"use client";

import { useEffect, useState } from "react";
import { BoardProvider } from "@/components/board-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { BoardHeader } from "@/components/board-header";
import { KanbanBoard } from "@/components/kanban-board";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      window.location.href = "/sign-in";
      return;
    }
    setCurrentUser(JSON.parse(stored));
  }, []);

  if (!currentUser)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  return (
    <QueryClientProvider client={queryClient}>
      <BoardProvider currentUser={currentUser}>
        <TooltipProvider>
          <div className="flex h-svh overflow-hidden bg-background text-foreground">
            <AppSidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <BoardHeader search={search} onSearchChange={setSearch} />
              <main className="min-h-0 flex-1 overflow-hidden">
                <KanbanBoard search={search} />
              </main>
            </div>
          </div>
        </TooltipProvider>
      </BoardProvider>
    </QueryClientProvider>
  );
}
