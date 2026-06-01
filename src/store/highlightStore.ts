import { create } from 'zustand';

export interface HighlightPointData {
  id: string;
  element: HTMLElement;
}

interface HighlightStore {
  highlights: Record<string, HTMLElement>;
  addHighlight: (id: string, element: HTMLElement) => void;
  removeHighlight: (id: string) => void;
}

export const useHighlightStore = create<HighlightStore>((set) => ({
  highlights: {},
  addHighlight: (id, element) =>
    set((state) => ({
      highlights: { ...state.highlights, [id]: element },
    })),
  removeHighlight: (id) =>
    set((state) => {
      const newHighlights = { ...state.highlights };
      delete newHighlights[id];
      return { highlights: newHighlights };
    }),
}));
