import { useCallback } from "react";
import { useUIStore } from "../../store/uiStore";

export const useDarkMode = () => {
  const { settings, updateSettings } = useUIStore();

  const toggleTheme = useCallback(() => {
    const newTheme = settings.theme === "light" ? "dark" : "light";

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    updateSettings({ theme: newTheme });
  }, [settings.theme, updateSettings]);

  return {
    toggleTheme,
    isDarkMode: settings.theme === "dark",
  };
};
