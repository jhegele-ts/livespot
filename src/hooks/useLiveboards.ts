import { SchemaApiResponseThoughtSpotLiveboardsGet } from "@/app/api/thoughtspot/liveboards/schema";
import { useQuery } from "@tanstack/react-query";

const fetcher = async () => {
  const reqLiveboards = await fetch(`/api/thoughtspot/liveboards`);
  const dataLiveboards =
    (await reqLiveboards.json()) as SchemaApiResponseThoughtSpotLiveboardsGet;
  if (!dataLiveboards.success) throw new Error(dataLiveboards.errorMessage);
  return dataLiveboards.data;
};

export const useLiveboards = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["liveboards"],
    queryFn: fetcher,
  });

  if (error)
    return {
      liveboards: undefined,
      error,
      isLoading: false,
    };

  if (isLoading)
    return {
      liveboards: undefined,
      error: null,
      isLoading: true,
    };

  if (!data) throw new Error("Liveboard data is unexpectedly undefined");

  return {
    liveboards: data,
    error: null,
    isLoading: false,
  };
};
