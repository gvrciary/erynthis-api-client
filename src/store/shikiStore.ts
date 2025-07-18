import { createHighlighter, type Highlighter } from "shiki";
import { create } from "zustand";

interface ShikiStore {
  highlighter: Highlighter | null;
  isLoading: boolean;
  isInitialized: boolean;
  initHighlighter: () => Promise<void>;
  dispose: () => void;
}

export const useShikiStore = create<ShikiStore>((set, get) => ({
  highlighter: null,
  isLoading: false,
  isInitialized: false,

  initHighlighter: async () => {
    const state = get();
    if (state.isInitialized || state.isLoading) return;

    set({ isLoading: true });

    try {
      const hl = await createHighlighter({
        themes: ["github-dark", "github-light"],
        langs: ["json", "html", "text"],
      });

      set({
        highlighter: hl,
        isLoading: false,
        isInitialized: true,
      });
    } catch {
      set({
        isLoading: false,
        isInitialized: false,
      });
    }
  },

  dispose: () => {
    const state = get();
    if (state.highlighter) {
      state.highlighter.dispose();
      set({
        highlighter: null,
        isInitialized: false,
        isLoading: false,
      });
    }
  },
}));
