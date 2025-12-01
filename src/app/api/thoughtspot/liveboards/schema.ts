export type SchemaLiveboard = {
  id: string;
  name?: string | null;
  author?: string | null;
  created?: number | null;
  modified?: number | null;
};

export type SchemaApiResponseThoughtSpotLiveboardsGet = ApiResponse<
  SchemaLiveboard[]
>;
