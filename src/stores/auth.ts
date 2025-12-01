import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

export type State = {
  token: string | undefined;
  host: string | undefined;
  username: string | undefined;
  userId: string | undefined;
  expiry: number | undefined;
  useEnvVars: boolean | undefined;
  validityTimeInSec: number | undefined;
};

export type Actions = {
  setAuth: (authState: Required<State>) => void;
  clearAuth: () => void;
};

const initState: State = {
  token: undefined,
  host: undefined,
  username: undefined,
  userId: undefined,
  expiry: undefined,
  useEnvVars: undefined,
  validityTimeInSec: undefined,
};

export const useAuthStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      ...initState,
      setAuth: (authState) =>
        set((state) => {
          state.token = authState.token;
          state.host = authState.host;
          state.username = authState.username;
          state.userId = authState.userId;
          state.expiry = authState.expiry;
          state.useEnvVars = authState.useEnvVars;
          state.validityTimeInSec = authState.validityTimeInSec;
        }),
      clearAuth: () =>
        set((state) => {
          state.token = initState.token;
          state.host = initState.host;
          state.username = initState.username;
          state.userId = initState.userId;
          state.expiry = initState.expiry;
          state.useEnvVars = initState.useEnvVars;
          state.validityTimeInSec = initState.validityTimeInSec;
        }),
    })),
    {
      name: "livespot-auth-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
