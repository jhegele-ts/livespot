"use client";

import { useDisplayStore } from "@/stores/display";
import styles from "./page.module.css";
import { useShallow } from "zustand/shallow";
import { useCallback, useEffect, useState } from "react";
import { LiveboardEmbed } from "@thoughtspot/visual-embed-sdk/react";

const PageDisplay = () => {
  const [liveboardIds, displaySeconds] = useDisplayStore(
    useShallow((state) => [state.liveboardIds, state.displaySeconds])
  );
  const [currentlyDisplayedLiveboardId, setCurrentlyDisplayedLiveboardId] =
    useState<string>(liveboardIds[0]);

  const rotateLiveboard = useCallback(() => {
    if (currentlyDisplayedLiveboardId === "")
      setCurrentlyDisplayedLiveboardId(liveboardIds[0]);
    if (liveboardIds.length > 1) {
      const currIdx = liveboardIds.findIndex(
        (i) => i === currentlyDisplayedLiveboardId
      );
      let nextIdx = currIdx + 1;
      if (nextIdx === liveboardIds.length) nextIdx = 0;
      setCurrentlyDisplayedLiveboardId(liveboardIds[nextIdx]);
    }
  }, [currentlyDisplayedLiveboardId, liveboardIds]);

  useEffect(() => {
    let timerId = undefined;
    if (liveboardIds.length > 1 && displaySeconds) {
      timerId = setInterval(rotateLiveboard, displaySeconds * 1000);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [displaySeconds, liveboardIds.length, rotateLiveboard]);

  return (
    <section className={styles.root}>
      <LiveboardEmbed
        liveboardId={currentlyDisplayedLiveboardId}
        fullHeight
        lazyLoadingForFullHeight
        frameParams={{
          width: "100%",
          height: "100%",
        }}
      />
    </section>
  );
};

export default PageDisplay;
