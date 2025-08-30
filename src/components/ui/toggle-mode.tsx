import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { cn } from "@/utils";

export default function ToggleMode() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-1.5 rounded-md bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
      title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
    >
      <div className="relative w-3.5 h-3.5">
        <Sun
          className={cn(
            "absolute inset-0 w-3.5 h-3.5 transition-all duration-200",
            isDarkMode
              ? "opacity-0 rotate-90 scale-75"
              : "opacity-100 rotate-0 scale-100",
          )}
        />
        <Moon
          className={cn(
            "absolute inset-0 w-3.5 h-3.5 transition-all duration-200",
            isDarkMode
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-75",
          )}
        />
      </div>
    </button>
  );
}
