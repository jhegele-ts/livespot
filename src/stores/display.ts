import z from "zod";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export const schemaState = z
  .object({
    liveboardIds: z
      .string()
      .array()
      .min(1, { error: "Must select at least 1 liveboard" }),
    displaySeconds: z
      .number()
      .min(60, { error: "Minimum of 60 seconds" })
      .optional(),
  })
  .refine(
    (vals) => {
      if (vals.liveboardIds.length > 1 && vals.displaySeconds === undefined)
        return false;
      return true;
    },
    {
      error: "Display timing is required when adding multiple liveboards",
      path: ["displaySeconds"],
    }
  );

export type State = z.infer<typeof schemaState>;

type Actions = {
  setDisplay: (display: State) => void;
  clearDisplay: () => void;
  validate: () => boolean;
};

const initState: State = {
  liveboardIds: [],
  displaySeconds: undefined,
};

export const useDisplayStore = create<State & Actions>()(
  persist(
    immer((set, get) => ({
      ...initState,
      setDisplay: (display) =>
        set((state) => {
          state.liveboardIds = display.liveboardIds;
          state.displaySeconds = display.displaySeconds;
        }),
      clearDisplay: () =>
        set((state) => {
          state.liveboardIds = initState.liveboardIds;
          state.displaySeconds = initState.displaySeconds;
        }),
      validate: () => {
        const { success } = schemaState.safeParse({
          liveboardIds: get().liveboardIds,
          displaySeconds: get().displaySeconds,
        });
        return success;
      },
    })),
    { name: "livespot-display-store" }
  )
);
