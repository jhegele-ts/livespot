import { type GetTokenResponse } from "@thoughtspot/rest-api-sdk";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import he from "he";

export class Cookies {
  public static names = {
    token: "tsToken",
    host: "tsHost",
    username: "tsUsername",
    userId: "tsUserId",
  } as const;

  public static getCookies = (host: string, tokenData: GetTokenResponse) => {
    return {
      token: {
        name: Cookies.names.token,
        value: tokenData.token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV !== "development",
        expires: tokenData.expiration_time_in_millis,
      },
      host: {
        name: Cookies.names.host,
        value: host,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV !== "development",
        expires: tokenData.expiration_time_in_millis,
      },
      user: {
        name: Cookies.names.username,
        value: tokenData.valid_for_username,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV !== "development",
        expires: tokenData.expiration_time_in_millis,
      },
      userId: {
        name: Cookies.names.userId,
        value: tokenData.valid_for_user_id,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV !== "development",
        expires: tokenData.expiration_time_in_millis,
      },
    };
  };

  public static getCookieValues = (cookies: RequestCookies) => {
    const token = cookies.get(Cookies.names.token)?.value;
    const host = cookies.get(Cookies.names.host)?.value;
    const username = cookies.get(Cookies.names.username)?.value;
    const userId = cookies.get(Cookies.names.userId)?.value;
    return {
      [Cookies.names.token]: token ? he.decode(token) : undefined,
      [Cookies.names.host]: host ? he.decode(host) : undefined,
      [Cookies.names.username]: username ? he.decode(username) : undefined,
      [Cookies.names.userId]: userId ? he.decode(userId) : undefined,
    };
  };
}
