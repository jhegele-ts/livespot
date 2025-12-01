"use client";

import { MultiSelect, Input, NumberInput, Button } from "@mantine/core";
import { useFullscreen } from "@mantine/hooks";
import styles from "./page.module.css";
import { useLiveboards } from "@/hooks/useLiveboards";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  schemaState as schemaStateDisplay,
  State as StateDisplay,
  useDisplayStore,
} from "@/stores/display";
import { useShallow } from "zustand/shallow";
import { useRouter } from "next/navigation";
import { PageError } from "@/components/page-error/page-error";
import { PageLoading } from "@/components/page-loading/page-loading";
import { CardContent } from "@/components/card-content/card-content";
import { HeaderContent } from "@/components/header-content/header-content";

const PageConfigure = () => {
  const { liveboards, error, isLoading } = useLiveboards();
  const [searchValue, setSearchValue] = useState<string>("");
  // Debounce search value to prevent searching with every
  // typed letter
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [liveboardIds, displaySeconds, setDisplay] = useDisplayStore(
    useShallow((state) => [
      state.liveboardIds,
      state.displaySeconds,
      state.setDisplay,
    ])
  );
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StateDisplay>({
    resolver: zodResolver(schemaStateDisplay),
    defaultValues: {
      liveboardIds,
      displaySeconds,
    },
  });
  const watchedLiveboardIds = useWatch({
    control,
    name: "liveboardIds",
    defaultValue: [],
  });
  const router = useRouter();
  const { fullscreen, toggle } = useFullscreen();

  const sortedLiveboards = useMemo(() => {
    // Memoize and sort liveboards by name
    if (!liveboards) return [];
    liveboards.sort((a, b) => {
      if (!a.name) return 0;
      if (!b.name) return 0;
      return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
    });
    return liveboards.map((lb) => ({
      value: lb.id,
      label: lb.name ?? "Unnamed liveboard",
    }));
  }, [liveboards]);

  const searchableLiveboards = useMemo(() => {
    // Memoize searchable set of liveboards based on
    // entered search value
    if (debouncedSearchValue === "") return sortedLiveboards;
    return sortedLiveboards.filter((lb) =>
      lb.label?.toLowerCase().includes(debouncedSearchValue)
    );
  }, [debouncedSearchValue, sortedLiveboards]);

  useEffect(() => {
    // Ensure that displaySeconds is not set when less than 2 liveboards
    // are actively selected
    if (watchedLiveboardIds.length <= 1) setValue("displaySeconds", undefined);
  }, [setValue, watchedLiveboardIds]);

  const onSubmit = handleSubmit((formData) => {
    setDisplay(formData);
    if (!fullscreen) toggle();
    router.push("/display");
  });

  if (error)
    return (
      <PageError>
        An error occurred while trying to fetch liveboards from your ThoughtSpot
        cluster
      </PageError>
    );

  if (isLoading)
    return <PageLoading>Fetching liveboards from ThoughtSpot</PageLoading>;

  return (
    <div className={styles.root}>
      <CardContent>
        <HeaderContent
          title="LiveSpot"
          description="Configure your full-screen display"
        ></HeaderContent>
        <form className={styles.form} onSubmit={onSubmit}>
          <Controller
            control={control}
            name="liveboardIds"
            render={({ field: { value, onChange } }) => (
              <Input.Wrapper
                label="Select liveboards to display"
                error={errors.liveboardIds?.message}
              >
                <MultiSelect
                  placeholder="Search for liveboards"
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                  data={searchableLiveboards}
                  value={value}
                  onChange={onChange}
                  searchable
                />
              </Input.Wrapper>
            )}
          />
          {watchedLiveboardIds.length > 1 && (
            <Input.Wrapper
              label="Display seconds"
              description="Number of seconds to display each liveboard. Minimum 1."
              error={errors.displaySeconds?.message}
            >
              <Controller
                control={control}
                name="displaySeconds"
                render={({ field: { value, onChange } }) => (
                  <NumberInput value={value} onChange={(e) => onChange(e)} />
                )}
              />
            </Input.Wrapper>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="filled" type="submit" loading={isSubmitting}>
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </div>
  );
};

export default PageConfigure;
