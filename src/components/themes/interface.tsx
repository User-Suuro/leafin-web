"use client";

import { Button } from "@/shadcn/ui/button";
import { useTheme } from "./provider";
import { Check, Moon, Sun, Wallpaper, Settings } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shadcn/ui/sheet";

export function UserPrefsSettings() {
  const { theme, setTheme, colorTheme, setColorTheme } = useTheme();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full">
          <Settings />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Adjust your preferred themes</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-4">
          {/* Theme Dark / Light Selector */}
          <div className="grid gap-2">
            <div className="flex gap-2">
              <Button
                variant={useTheme().theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="flex-1 gap-4"
              >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </Button>
              <Button
                variant={useTheme().theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="flex-1 gap-4"
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </Button>
              <Button
                variant={useTheme().theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
                className="flex-1 gap-4"
              >
                <Wallpaper className="mr-2 h-4 w-4" />
                System
              </Button>
            </div>
          </div>
        </div>

        {/* Theme Color Selector */}
        <div className="grid gap-4 px-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setColorTheme("default")}
              className="flex-1 gap-4"
            >
              <div
                className={`size-4 rounded-full ${
                  theme === "light"
                    ? "bg-black"
                    : theme === "dark"
                    ? "bg-white"
                    : "block rounded-full bg-gradient-to-r from-black to-white"
                }`}
              />
              Default
              {colorTheme === "default" && <Check className="size-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setColorTheme("red")}
              className="flex-1 gap-4"
            >
              <div className="size-4 rounded-full bg-red-500" />
              Red
              {colorTheme === "red" && <Check className="size-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setColorTheme("yellow")}
              className="flex-1 gap-4"
            >
              <div className="size-4 rounded-full bg-yellow-500" />
              Yellow
              {colorTheme === "yellow" && <Check className="size-4" />}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}