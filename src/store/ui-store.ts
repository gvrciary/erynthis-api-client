import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Settings } from "@/types/data";

export interface UIStore {
  dragScale: number;
  sidebarExpanded: boolean;
  setDragScale: (scale: number) => void;
  settings: Settings;
  toggleSidebar: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      dragScale: 55,
      sidebarExpanded: true,
      settings: {
        theme: "light" as "light" | "dark",
      },
      setDragScale: (scale) => set({ dragScale: scale }),
      toggleSidebar: () =>
        set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
    }),
    {
      name: "ui-store",
      partialize: (state) => ({
        dragScale: state.dragScale,
        sidebarExpanded: state.sidebarExpanded,
        settings: state.settings,
      }),
    },
  ),
);
