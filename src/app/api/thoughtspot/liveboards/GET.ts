import { Cookies } from "@/lib/cookies";
import { NextRequest, NextResponse } from "next/server";
import {
  SchemaApiResponseThoughtSpotLiveboardsGet,
  SchemaLiveboard,
} from "./schema";
import { StatusCodes } from "http-status-codes";
import {
  MetadataSearchResponse,
  SearchMetadataRequest,
} from "@thoughtspot/rest-api-sdk";

export const GET = async (request: NextRequest) => {
  const { tsToken, tsHost } = Cookies.getCookieValues(request.cookies);
  if (!tsToken || !tsHost) {
    const response: SchemaApiResponseThoughtSpotLiveboardsGet = {
      success: false,
      errorMessage:
        "Unauthorized: Your session may have expired. Try logging in again.",
    };
    return NextResponse.json(response, { status: StatusCodes.UNAUTHORIZED });
  }

  const url = new URL("/api/rest/2.0/metadata/search", tsHost);
  const body: SearchMetadataRequest = {
    include_auto_created_objects: true,
    include_headers: true,
    record_size: -1,
    metadata: [{ type: "LIVEBOARD" }],
  };
  try {
    const reqLiveboards = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${tsToken}`,
      },
      body: JSON.stringify(body),
    });
    const dataLiveboards =
      (await reqLiveboards.json()) as MetadataSearchResponse[];
    const liveboards: SchemaLiveboard[] = dataLiveboards
      .filter((lb) => lb.metadata_id !== null && lb.metadata_id !== undefined)
      .map((lb) => ({
        id: lb.metadata_id!,
        name: lb.metadata_name,
        author: lb.metadata_header.authorName,
        created: lb.metadata_header.created,
        modified: lb.metadata_header.modified,
      }));
    const response: SchemaApiResponseThoughtSpotLiveboardsGet = {
      success: true,
      data: liveboards,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error(`[GET api/thoughtspot/liveboards]: ${error}`);
    const response: SchemaApiResponseThoughtSpotLiveboardsGet = {
      success: false,
      errorMessage:
        "An unknown error occurred while trying to fetch liveboards",
    };
    return NextResponse.json(response, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
