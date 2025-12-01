import { Config } from "@/lib/config";
import { SchemaApiResponseEnvironmentGet } from "./schema";
import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

const config = new Config();

export const GET = () => {
  try {
    const env = config.env;

    const response: SchemaApiResponseEnvironmentGet = {
      success: true,
      data: {
        useEnvironmentVars: false,
        host: undefined,
      },
    };
    if (env.useEnvironmentVars) {
      response.data = {
        useEnvironmentVars: true,
        host: env.host,
      };
    }
    return NextResponse.json(response, { status: StatusCodes.OK });
  } catch (error) {
    console.log(`ERROR [GET api/environment] ${error}`);
    const response: SchemaApiResponseEnvironmentGet = {
      success: false,
      errorMessage:
        "An unknown error occurred while trying to fetch environment configuration",
    };
    return NextResponse.json(response, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
