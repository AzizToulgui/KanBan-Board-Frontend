"use client"

import { useState } from "react"
import { useBoard } from "@/components/board-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Plus, X } from "lucide-react"

export function AddColumn() {
  const { addColumn } = useBoard()
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState("")

  function commit() {
    const trimmed = title.trim()
    if (trimmed) addColumn(trimmed)
    setTitle("")
    setAdding(false)
  }

  if (!adding) {
    return (
      <button
        type="button"
        onClick={() => setAdding(true)}
        className={cn(
          "flex h-fit w-72 shrink-0 items-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors",
          "hover:border-primary/40 hover:bg-muted/40 hover:text-foreground",
        )}
      >
        <Plus className="size-4" />
        Add column
      </button>
    )
  }

  return (
    <div className="flex h-fit w-72 shrink-0 flex-col gap-2 rounded-xl border border-border bg-muted/40 p-2">
      <Input
        autoFocus
        value={title}
        placeholder="Column name"
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit()
          if (e.key === "Escape") {
            setTitle("")
            setAdding(false)
          }
        }}
        className="h-8 text-sm"
      />
      <div className="flex items-center gap-1.5">
        <Button size="sm" className="h-7" onClick={commit}>
          Add column
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-7"
          onClick={() => {
            setTitle("")
            setAdding(false)
          }}
          aria-label="Cancel"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
