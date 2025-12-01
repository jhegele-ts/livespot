"use client";

import type {
  SchemaApiRequestThoughtSpotTokenPost,
  SchemaApiResponseThoughtSpotTokenPost,
} from "@/app/api/thoughtspot/token/schema";
import { useAuthStore } from "@/stores/auth";
import { useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { DateTime } from "luxon";

export type GetTokenOptions =
  | {
      useEnvVars: false;
      tokenRequest: SchemaApiRequestThoughtSpotTokenPost;
    }
  | {
      useEnvVars: true;
      tokenRequest: string;
    };

export const useAuth = () => {
  const [
    token,
    host,
    username,
    userId,
    expiry,
    useEnvVars,
    validityTimeInSec,
    setAuth,
  ] = useAuthStore(
    useShallow((state) => [
      state.token,
      state.host,
      state.username,
      state.userId,
      state.expiry,
      state.useEnvVars,
      state.validityTimeInSec,
      state.setAuth,
    ])
  );

  const validateToken = useCallback(() => {
    if (token === undefined) return false;
    if (host === undefined) return false;
    if (username === undefined) return false;
    if (userId === undefined) return false;
    if (expiry === undefined) return false;
    if (useEnvVars === undefined) return false;
    if (validityTimeInSec === undefined) return false;
    const currTime = DateTime.now().toMillis();
    if (currTime > expiry) return false;
    return true;
  }, [expiry, host, token, useEnvVars, userId, username, validityTimeInSec]);

  const getToken = useCallback(
    async (tokenRequest: SchemaApiRequestThoughtSpotTokenPost) => {
      const reqToken = await fetch("/api/thoughtspot/token", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(tokenRequest),
      });
      const dataToken =
        (await reqToken.json()) as SchemaApiResponseThoughtSpotTokenPost;
      if (!dataToken.success) throw new Error(dataToken.errorMessage);
      setAuth({
        token: dataToken.data.token,
        host: dataToken.data.host,
        username: dataToken.data.valid_for_username,
        userId: dataToken.data.valid_for_user_id,
        expiry: dataToken.data.expiration_time_in_millis,
        useEnvVars: dataToken.data.useEnvVars,
        validityTimeInSec: dataToken.data.validityTimeInSec,
      });
      return dataToken.data;
    },
    [setAuth]
  );

  if (
    !validateToken() ||
    token === undefined ||
    host === undefined ||
    username === undefined ||
    userId === undefined ||
    expiry === undefined ||
    useEnvVars === undefined ||
    validityTimeInSec === undefined
  )
    return {
      isValid: false,
      token: undefined,
      host: undefined,
      username: undefined,
      userId: undefined,
      expiry: undefined,
      useEnvVars: undefined,
      validityTimeInSec: undefined,
      setAuth,
      getToken,
      validateToken,
    };

  return {
    isValid: true,
    token,
    host,
    username,
    userId,
    expiry,
    useEnvVars,
    validityTimeInSec,
    getToken,
    setAuth,
    validateToken,
  };
};
