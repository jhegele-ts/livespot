import z from "zod";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export const schemaState = z.object({
  liveboards: z.array(
    z.object({
      id: z.string().min(1, { error: "Required" }),
      name: z.string().min(1, { error: "Required" }),
      refreshInterval: z.coerce
        .number<number>()
        .min(0, { error: "Must be positive" }),
      displaySeconds: z.coerce
        .number<number>()
        .min(60, { error: "Minimum 60 seconds" }),
    })
  ),
});

export type State = z.infer<typeof schemaState>;

type Actions = {
  addLiveboard: (liveboard: State["liveboards"][number]) => void;
  removeLiveboard: (liveboardId: string) => void;
  updateDisplay: (liveboardId: string, display: number | undefined) => void;
  updateRefresh: (liveboardId: string, refresh: number | undefined) => void;
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
      reset: () =>
        set((state) => {
          state.liveboards = initState.liveboards;
        }),
    })),
    { name: "livespot-display-store" }
  )
);
