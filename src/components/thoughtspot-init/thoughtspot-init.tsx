"use client";

import { useAuth } from "@/hooks/useAuth";
import { AuthType, init } from "@thoughtspot/visual-embed-sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PageError } from "../page-error/page-error";

export type ThoughtSpotInitProps = {
  children?: React.ReactNode;
};

const ThoughtSpotInit: React.FC<ThoughtSpotInitProps> = ({
  children,
}: ThoughtSpotInitProps) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const {
    isValid,
    token,
    host,
    username,
    useEnvVars,
    validityTimeInSec,
    getToken,
    setAuth,
    validateToken,
  } = useAuth();

  const error = useMemo(() => {
    if (isInitialized && !validateToken())
      return "No valid session with ThoughtSpot. Please login.";
    return undefined;
  }, [isInitialized, validateToken]);

  const getAuthToken = useCallback(async () => {
    if (!useEnvVars) {
      if (!token)
        throw new Error(
          "Attempted to use getAuthToken prior to token being set in storage"
        );
      return token;
    } else {
      if (token && validateToken()) return token;
      // if our stored token is invalid, we generate a new token
      const newToken = await getToken({
        useEnvVars: true,
        username,
        validityTimeInSeconds: validityTimeInSec,
      });
      // store the updated auth data in session storage
      setAuth({
        host: newToken.host,
        token: newToken.token,
        username: newToken.valid_for_username,
        userId: newToken.valid_for_user_id,
        useEnvVars: newToken.useEnvVars,
        validityTimeInSec: newToken.validityTimeInSec,
        expiry: newToken.expiration_time_in_millis,
      });
      return newToken.token;
    }
  }, [
    getToken,
    setAuth,
    token,
    useEnvVars,
    username,
    validityTimeInSec,
    validateToken,
  ]);

  useEffect(() => {
    if (!error && isValid) {
      if (!isInitialized) {
        init({
          thoughtSpotHost: host!,
          authType: AuthType.TrustedAuthTokenCookieless,
          getAuthToken,
          // if using env vars, enable auto login, otherwise disable it since we
          // cannot generate a new token without env vars
          autoLogin: useEnvVars,
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsInitialized(true);
      }
    }
  }, [error, getAuthToken, host, isInitialized, isValid, token, useEnvVars]);

  if (error) return <PageError>{error}</PageError>;

  if (!isInitialized) return null;

  return <>{children}</>;
};

export default ThoughtSpotInit;
