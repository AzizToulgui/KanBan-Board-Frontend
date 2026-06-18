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
  const { projectMembersList, inviteMember, projects, activeProjectId } =
    useBoard();

  const project = projects.find((p) => p.id === activeProjectId)!;

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  async function handleInvite() {
    if (!email.trim()) return;

    try {
      setLoading(true);

      const { user } = await inviteMember(activeProjectId, email);

      setFeedback({
        ok: true,
        message: `${user.name} invited successfully`,
      });
      setEmail("");
    } catch (err) {
      setFeedback({
        ok: false,
        message: "Failed to invite user",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setFeedback(null);
          setEmail("");
        }
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
              onKeyDown={(e) => {
                if (e.key === "Enter") handleInvite();
              }}
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

          <div className="flex items-center -space-x-2">
            {projectMembersList.slice(0, 5).map((m) => (
              <UserAvatar
                key={m.id}
                user={m}
                size="lg"
                className="ring-2 ring-background"
              />
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Done
          </Button>

          <Button onClick={handleInvite} disabled={!email.trim() || loading}>
            {loading ? "Sending..." : "Send invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
