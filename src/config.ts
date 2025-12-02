/**
 * GLOBAL APPLICATION CONFIGURATION
 *
 * This file provides settings that are used across the application. The values
 * here are used in the publicly available version of this application but can
 * be modified when deploying in your own, secure infrastructure.
 *
 * SETTINGS
 *
 * auth.useEnvironmentVariables [default: false] - When false, authentication
 * requires passing the ThoughtSpot host, username, and either the password
 * or the secret key. Additionally, when the session expires, the user is
 * automatically logged out. When true, you MUST define TS_HOST and
 * TS_SECRET_KEY environment variables. Authentication requires only a
 * username and you can optionally enable automatic refreshing of sessions on
 * expiry.
 *
 */

export const appConfiguration = {
  auth: {
    useEnvironmentVariables: false,
  },
};
