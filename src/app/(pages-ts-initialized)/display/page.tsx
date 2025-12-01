"use client";

import { useDisplayStore } from "@/stores/display";
import styles from "./page.module.css";
import { useCallback, useEffect, useState } from "react";
import {
  HostEvent,
  LiveboardEmbed,
  useEmbedRef,
} from "@thoughtspot/visual-embed-sdk/react";
import { ActionIcon, Button, Kbd, Modal, Text, Title } from "@mantine/core";
import { Menu } from "lucide-react";
import { useDisclosure, useFullscreen } from "@mantine/hooks";
import { useRouter } from "next/navigation";

const PageDisplay = () => {
  const displayLiveboards = useDisplayStore((state) => state.liveboards);
  const [displayIndex, setDisplayIndex] = useState<number>(0);
  const embedRef = useEmbedRef<typeof LiveboardEmbed>();
  const [opened, { open, close }] = useDisclosure();
  const { fullscreen, toggle } = useFullscreen();
  const router = useRouter();

  const nextLiveboard = useCallback(() => {
    let newIndex = displayIndex + 1;
    if (newIndex >= displayLiveboards.length) newIndex = 0;
    if (embedRef.current) {
      embedRef.current.destroy();
    }
    setDisplayIndex(newIndex);
  }, [displayIndex, displayLiveboards.length, embedRef]);

  const refreshLiveboard = useCallback(() => {
    if (embedRef.current) {
      embedRef.current.trigger(HostEvent.Reload);
    }
  }, [embedRef]);

  // Effects to manage liveboard refresh
  useEffect(() => {
    let intervalId = undefined;
    const { refreshInterval, displaySeconds } = displayLiveboards[displayIndex];
    // If refresh interval is 0, don't refresh
    // If refresh interval is less than display, don't refresh
    if (refreshInterval > 0 && refreshInterval < displaySeconds)
      intervalId = setInterval(
        refreshLiveboard,
        displayLiveboards[displayIndex].refreshInterval * 1000
      );

    // Clean up effects
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [displayIndex, displayLiveboards, refreshLiveboard]);

  // Effects to manage liveboard display swapping
  useEffect(() => {
    let intervalId = undefined;
    // If only 1 liveboard is added, don't swap
    if (displayLiveboards.length > 1) {
      const { displaySeconds } = displayLiveboards[displayIndex];
      intervalId = setInterval(nextLiveboard, displaySeconds * 1000);
    }

    // Clean up effects
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [displayIndex, displayLiveboards, nextLiveboard]);

  const handleExitToConfig = async () => {
    console.log(fullscreen);
    if (fullscreen) void (await toggle());
    router.push("/configure");
  };

  return (
    <section className={styles.root}>
      <LiveboardEmbed
        liveboardId={displayLiveboards[displayIndex].id}
        fullHeight
        lazyLoadingForFullHeight
        frameParams={{
          width: "100%",
          height: "100%",
        }}
        ref={embedRef}
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
