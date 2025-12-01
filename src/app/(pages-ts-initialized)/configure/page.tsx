"use client";

import styles from "./page.module.css";
import { useLiveboards } from "@/hooks/useLiveboards";
import { PageError } from "@/components/page-error/page-error";
import { PageLoading } from "@/components/page-loading/page-loading";
import { CardContent } from "@/components/card-content/card-content";
import { HeaderContent } from "@/components/header-content/header-content";
import { useDisplayStore } from "@/stores/display";
import { useShallow } from "zustand/shallow";
import { Button, Popover, Select, Text } from "@mantine/core";
import { useMemo, useState } from "react";
import { LiveboardDisplay } from "@/components/liveboard-display/liveboard-display";

const PageConfigure = () => {
  const [selectedLiveboard, setSelectedLiveboard] = useState<string | null>(
    null
  );
  const { liveboards, error, isLoading } = useLiveboards();
  const [displayLiveboards, addLiveboard, reset] = useDisplayStore(
    useShallow((state) => [state.liveboards, state.addLiveboard, state.reset])
  );
  const [confirmResetOpen, setConfirmResetOpen] = useState<boolean>(false);

  const sortedLiveboards = useMemo(() => {
    if (!liveboards) return [];
    const formattedLiveboards = liveboards
      .filter((lb) => !displayLiveboards.map((l) => l.id).includes(lb.id))
      .map((lb) => ({
        value: lb.id,
        label: lb.name || "Unnamed Liveboard",
      }));
    formattedLiveboards.sort((a, b) =>
      a.label > b.label ? 1 : a.label < b.label ? -1 : 0
    );
    return formattedLiveboards;
  }, [displayLiveboards, liveboards]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const toAdd = liveboards?.find((lb) => lb.id === selectedLiveboard);
    if (toAdd) {
      addLiveboard({
        id: toAdd.id,
        name: toAdd.name ?? "Unnamed Liveboard",
        refreshInterval: 0,
        displaySeconds: 60,
      });
      setSelectedLiveboard(null);
    }
  };

  const handleReset = () => setConfirmResetOpen(true);

  const handleConfirmReset = () => {
    reset();
    setConfirmResetOpen(false);
  };

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
        />
        <form className={styles.form} onSubmit={handleSubmit}>
          <Select
            label="Select a liveboard to add it"
            data={sortedLiveboards}
            searchable
            style={{ flex: 1 }}
            value={selectedLiveboard}
            onChange={(val) => setSelectedLiveboard(val ?? "")}
          />
          <Button variant="filled" type="submit">
            Add
          </Button>
        </form>
        <div style={{ width: "100%", height: "400px" }}>
          <LiveboardDisplay />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "0.5rem",
          }}
        >
          <Popover
            opened={confirmResetOpen}
            onChange={(opened) => setConfirmResetOpen(opened)}
            position="top"
            withArrow
          >
            <Popover.Target>
              <Button
                variant="outline"
                color="red"
                type="button"
                onClick={handleReset}
                disabled={displayLiveboards.length === 0}
              >
                Reset
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  maxWidth: "250px",
                }}
              >
                <Text size="sm">
                  Are you sure you want to reset and clear your selected
                  liveboards? This cannot be undone.
                </Text>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "0.5rem",
                  }}
                >
                  <Button
                    variant="filled"
                    color="green"
                    onClick={() => setConfirmResetOpen(false)}
                    size="xs"
                  >
                    No
                  </Button>
                  <Button
                    variant="filled"
                    color="red"
                    onClick={handleConfirmReset}
                    size="xs"
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </Popover.Dropdown>
          </Popover>
          <Button
            variant="filled"
            type="button"
            disabled={displayLiveboards.length === 0}
          >
            Go
          </Button>
        </div>
      </CardContent>
    </div>
  );
};

export default PageConfigure;
