import { GetTokenResponse } from "@thoughtspot/rest-api-sdk";
import z from "zod";

const authBase = z.object({
  host: z.url({ error: "Invalid URL format" }).min(1, { error: "Required" }),
  username: z.string().min(1, { error: "Required" }),
  validityTimeInSeconds: z.coerce
    .number<number>()
    .min(60, { error: "Minimum 1 minute (60 seconds)" })
    .max(86400, { error: "Maximum 1 day (86,400 seconds)" }),
});

export const schemaApiRequestThoughtSpotTokenPost = z.discriminatedUnion(
  "useEnvVars",
  [
    authBase
      .pick({
        username: true,
        validityTimeInSeconds: true,
      })
      .extend({
        useEnvVars: z.literal(true),
      }),
    z.discriminatedUnion("authType", [
      authBase.extend({
        authType: z.literal("password"),
        password: z.string().min(1, { error: "Required" }),
        useEnvVars: z.literal(false),
      }),
      authBase.extend({
        authType: z.literal("secretKey"),
        secretKey: z.string().min(1, { error: "Required" }),
        useEnvVars: z.literal(false),
      }),
    ]),
  ]
);

export type SchemaApiRequestThoughtSpotTokenPost = z.infer<
  typeof schemaApiRequestThoughtSpotTokenPost
>;

export type SchemaApiResponseThoughtSpotTokenPost = ApiResponse<
  GetTokenResponse & {
    host: string;
    useEnvVars: boolean;
    validityTimeInSec: number;
  }
>;
