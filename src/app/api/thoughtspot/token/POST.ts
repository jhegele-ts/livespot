import { NextRequest, NextResponse } from "next/server";
import {
  SchemaApiRequestThoughtSpotTokenPost,
  schemaApiRequestThoughtSpotTokenPost,
  type SchemaApiResponseThoughtSpotTokenPost,
} from "./schema";
import z from "zod";
import { StatusCodes } from "http-status-codes";
import type {
  GetFullAccessTokenRequest,
  GetTokenResponse,
} from "@thoughtspot/rest-api-sdk";
import { Cookies } from "@/lib/cookies";
import { Config } from "@/lib/config";

const config = new Config();

const getToken = async (request: SchemaApiRequestThoughtSpotTokenPost) => {
  if (request.useEnvVars !== config.env.useEnvironmentVars)
    throw new Error(
      "Token request specified environment vars should be used but auth.useEnvironmentVars is set to false"
    );
  const host = request.useEnvVars ? config.env.host : request.host;
  const url = new URL(`/api/rest/2.0/auth/token/full`, host);
  const body: GetFullAccessTokenRequest = request.useEnvVars
    ? {
        username: request.username,
        secret_key: config.env.secretKey,
        validity_time_in_sec: request.validityTimeInSeconds,
      }
    : {
        username: request.username,
        password:
          request.authType === "password" ? request.password : undefined,
        secret_key:
          request.authType === "secretKey" ? request.secretKey : undefined,
        validity_time_in_sec: request.validityTimeInSeconds,
      };
  const reqToken = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await reqToken.json()) as GetTokenResponse;
};

export const POST = async (request: NextRequest) => {
  const payload = await request.json();

  const { data, error } =
    schemaApiRequestThoughtSpotTokenPost.safeParse(payload);

  if (error) {
    const response: SchemaApiResponseThoughtSpotTokenPost = {
      success: false,
      errorMessage: z.prettifyError(error),
    };
    return NextResponse.json(response, { status: StatusCodes.BAD_REQUEST });
  }

  if (data.useEnvVars !== config.env.useEnvironmentVars) {
    const response: SchemaApiResponseThoughtSpotTokenPost = {
      success: false,
      errorMessage:
        "Value assigned to useEnvVars in token request must match value assigned to auth.useEnvironmentVars",
    };
    return NextResponse.json(response, { status: StatusCodes.BAD_REQUEST });
  }

  try {
    const token = await getToken(data);
    const host = data.useEnvVars ? config.env.host! : data.host;
    const cookies = Cookies.getCookies(host, token);
    const responseToken: SchemaApiResponseThoughtSpotTokenPost = {
      success: true,
      data: {
        ...token,
        host,
        useEnvVars: config.env.useEnvironmentVars,
        validityTimeInSec: data.validityTimeInSeconds,
      },
    };
    const response = new NextResponse(JSON.stringify(responseToken), {
      headers: { "content-type": "application/json" },
      status: StatusCodes.OK,
    });
    response.cookies.set(cookies.host);
    response.cookies.set(cookies.token);
    response.cookies.set(cookies.user);
    response.cookies.set(cookies.userId);
    return response;
  } catch (error) {
    console.log(`ERROR [POST api/thoughtspot/token]: ${error}`);
    const response: SchemaApiResponseThoughtSpotTokenPost = {
      success: false,
      errorMessage:
        "An unknown error occurred while attempting to generate an auth token",
    };
    return NextResponse.json(response, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
