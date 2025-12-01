"use client";

import { SchemaApiResponseEnvironmentGet } from "@/app/api/environment/schema";
import { useQuery } from "@tanstack/react-query";

const fetcher = async () => {
  const reqEnv = await fetch(`/api/environment`);
  const dataEnv = (await reqEnv.json()) as SchemaApiResponseEnvironmentGet;
  if (!dataEnv.success) throw new Error(dataEnv.errorMessage);
  return dataEnv.data;
};

export const useEnvironment = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["environment"],
    queryFn: fetcher,
    refetchOnWindowFocus: false,
  });

  return { env: data, error, isLoading };
};
