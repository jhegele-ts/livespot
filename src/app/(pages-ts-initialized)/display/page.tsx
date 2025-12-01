"use client";

import { useDisplayStore } from "@/stores/display";
import styles from "./page.module.css";
import { useShallow } from "zustand/shallow";
import { useCallback, useEffect, useState } from "react";
import { LiveboardEmbed } from "@thoughtspot/visual-embed-sdk/react";
import { ActionIcon, Button, Kbd, Modal, Text, Title } from "@mantine/core";
import { Menu } from "lucide-react";
import { useDisclosure, useFullscreen } from "@mantine/hooks";
import { useRouter } from "next/navigation";

const PageDisplay = () => {
  const [liveboardIds, displaySeconds] = useDisplayStore(
    useShallow((state) => [state.liveboardIds, state.displaySeconds])
  );
  const [currentlyDisplayedLiveboardId, setCurrentlyDisplayedLiveboardId] =
    useState<string>(liveboardIds[0]);
  const [opened, { open, close }] = useDisclosure(false);
  const { fullscreen, toggle } = useFullscreen();
  const router = useRouter();

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

  const handleExitToConfig = async () => {
    console.log(fullscreen);
    if (fullscreen) void (await toggle());
    router.push("/configure");
  };

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
      <ActionIcon
        variant="outline"
        radius="xl"
        aria-label="Menu"
        className={styles.menuButton}
        size="lg"
        onClick={open}
      >
        <Menu className={styles.menuButtonIcon} />
      </ActionIcon>
      <Modal.Root opened={opened} onClose={close} size="lg" centered>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Title>LiveSpot</Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            <span style={{ flex: 1, width: "100%", textAlign: "center" }}>
              <Text size="xs">
                Press <Kbd>Esc</Kbd> or <Kbd>F11</Kbd> to exit full screen or
                use the button below
              </Text>
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <Button variant="filled" onClick={async () => await toggle()}>
                Toggle fullscreen
              </Button>
              <Button
                variant="outline"
                color="red"
                style={{ outline: "none" }}
                onClick={handleExitToConfig}
              >
                &larr; Exit to config
              </Button>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </section>
  );
};

export default PageDisplay;
