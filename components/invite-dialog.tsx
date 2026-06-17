"use client";

import { useState } from "react";
import { useBoard } from "@/components/board-provider";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { displayName } from "@/lib/board-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, UserPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function InviteDialog() {
  const {
    projectMembersList,
    inviteMember,
    getUser,
    projects,
    activeProjectId,
  } = useBoard();
  const project = projects.find((p) => p.id === activeProjectId)!;
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  function handleInvite() {
    const result = inviteMember(email, name);
    setFeedback(result);
    if (result.ok) {
      setEmail("");
      setName("");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setFeedback(null);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 gap-1.5">
          <UserPlus className="size-4" />
          <span className="hidden sm:inline">Invite</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite to {project.name}</DialogTitle>
          <DialogDescription>
            Add teammates to collaborate on this project board.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          <div className="grid gap-2">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="teammate@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFeedback(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="invite-name">
              Full name{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="invite-name"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            />
          </div>

          {feedback && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                feedback.ok
                  ? "bg-chart-3/10 text-chart-3"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {feedback.ok ? (
                <Check className="size-4 shrink-0" />
              ) : (
                <X className="size-4 shrink-0" />
              )}
              {feedback.message}
            </div>
          )}

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {projectMembersList.length} member
              {projectMembersList.length === 1 ? "" : "s"}
            </p>
            <ul className="flex max-h-44 flex-col gap-1 overflow-y-auto">
              {projectMembersList.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-2.5 rounded-md px-1 py-1.5"
                >
                  <UserAvatar user={m} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {displayName(m)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {m.email}
                    </p>
                  </div>
                  <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {m.id === project.ownerId ? "Owner" : "Member"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Done
          </Button>
          <Button onClick={handleInvite} disabled={!email.trim()}>
            Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
