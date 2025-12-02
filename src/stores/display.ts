import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export type State = {
  liveboards: {
    id: string;
    name: string;
    refreshInterval: number;
    displaySeconds: number;
    hideHeader: boolean;
  }[];
};

type Actions = {
  addLiveboard: (liveboard: State["liveboards"][number]) => void;
  removeLiveboard: (liveboardId: string) => void;
  updateDisplay: (liveboardId: string, display: number | undefined) => void;
  updateRefresh: (liveboardId: string, refresh: number | undefined) => void;
  updateHideHeader: (liveboardId: string, hideHeader: boolean) => void;
  reset: () => void;
};

const initState: State = {
  liveboards: [],
};

export const useDisplayStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      ...initState,
      addLiveboard: (liveboard) =>
        set((state) => {
          if (!state.liveboards.map((l) => l.id).includes(liveboard.id)) {
            state.liveboards.push(liveboard);
          }
        }),
      removeLiveboard: (liveboardId) =>
        set((state) => {
          const removeIdx = state.liveboards.findIndex(
            (l) => l.id === liveboardId
          );
          if (removeIdx !== -1) {
            state.liveboards.splice(removeIdx, 1);
          }
        }),
      updateDisplay: (liveboardId, display) =>
        set((state) => {
          const updateIdx = state.liveboards.findIndex(
            (l) => l.id === liveboardId
          );
          if (updateIdx !== -1) {
            state.liveboards[updateIdx].displaySeconds = display
              ? Math.max(display, 60)
              : 60;
          }
        }),
      updateRefresh: (liveboardId, refresh) =>
        set((state) => {
          const updateIdx = state.liveboards.findIndex(
            (l) => l.id === liveboardId
          );
          if (updateIdx !== -1) {
            state.liveboards[updateIdx].refreshInterval = refresh
              ? Math.max(refresh, 0)
              : 0;
          }
        }),
      updateHideHeader: (liveboardId, hideHeader) =>
        set((state) => {
          const updateIdx = state.liveboards.findIndex(
            (l) => l.id === liveboardId
          );
          if (updateIdx !== -1) {
            state.liveboards[updateIdx].hideHeader = hideHeader;
          }
        }),
      reset: () =>
        set((state) => {
          state.liveboards = initState.liveboards;
        }),
    })),
    { name: "livespot-display-store" }
  )
);
