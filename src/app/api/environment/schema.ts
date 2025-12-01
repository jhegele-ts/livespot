export type SchemaApiResponseEnvironmentGet = ApiResponse<
  | {
      useEnvironmentVars: false;
      host: undefined;
    }
  | {
      useEnvironmentVars: true;
      host: string;
    }
>;
