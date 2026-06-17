"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Palette, Monitor } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, toggleTheme, preset, setPreset } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          {theme === "light" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>

        <DropdownMenuItem onClick={toggleTheme}>
          {theme === "light" ? (
            <>
              <Moon className="mr-2 h-4 w-4" />
              Switch to Dark
            </>
          ) : (
            <>
              <Sun className="mr-2 h-4 w-4" />
              Switch to Light
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Color Preset</DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => setPreset("default")}
          className={preset === "default" ? "bg-accent" : ""}
        >
          <Monitor className="mr-2 h-4 w-4" />
          Default (Blue)
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setPreset("tangerine")}
          className={preset === "tangerine" ? "bg-accent" : ""}
        >
          <Palette className="mr-2 h-4 w-4" />
          Tangerine
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
