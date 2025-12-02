import { useDisplayStore } from "@/stores/display";
import styles from "./liveboard-display.module.css";
import { useShallow } from "zustand/shallow";
import {
  ActionIcon,
  NumberInput,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { ChartColumnStacked, Eye, EyeClosed, X } from "lucide-react";

export const LiveboardDisplay = () => {
  const [
    liveboards,
    removeLiveboard,
    updateDisplay,
    updateRefresh,
    updateHideHeader,
  ] = useDisplayStore(
    useShallow((state) => [
      state.liveboards,
      state.removeLiveboard,
      state.updateDisplay,
      state.updateRefresh,
      state.updateHideHeader,
    ])
  );

  const handleRemoveLiveboard = (liveboardId: string) => {
    removeLiveboard(liveboardId);
  };

  const handleDisplayBlur = (liveboardId: string, value: string) => {
    updateDisplay(liveboardId, value === "" ? 0 : Number(value));
  };

  const handleRefreshBlur = (liveboardId: string, value: string) => {
    updateRefresh(liveboardId, value === "" ? 0 : Number(value));
  };

  const handleUpdateHideHeader = (liveboardId: string, hideHeader: boolean) => {
    updateHideHeader(liveboardId, hideHeader);
  };

  if (liveboards.length === 0)
    return (
      <div className={styles.root}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <ThemeIcon variant="white" color="gray.5" size="lg">
              <ChartColumnStacked className={styles.noDataIcon} />
            </ThemeIcon>
            <Text c="dimmed">No liveboards added</Text>
          </div>
        </div>
      </div>
    );

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div
          className={styles.row}
          style={{ marginBottom: "8px" }}
          data-header={true}
        >
          <Text
            size="xs"
            fw="bold"
            style={{ flex: 1, textAlign: "left", userSelect: "none" }}
          >
            Name
          </Text>
          <Tooltip label="Show/hide liveboard header. Note that hiding the header will remove filters and tabs.">
            <Text
              size="xs"
              fw="bold"
              style={{
                width: "80px",
                textAlign: "center",
                userSelect: "none",
                textDecoration: "underline dotted black",
              }}
            >
              Header
            </Text>
          </Tooltip>
          {liveboards.length > 1 && (
            <Tooltip label="Length of time, in seconds, that this liveboard is displayed">
              <Text
                size="xs"
                fw="bold"
                style={{
                  width: "80px",
                  textAlign: "center",
                  userSelect: "none",
                  textDecoration: "underline dotted black",
                }}
              >
                Display (secs)
              </Text>
            </Tooltip>
          )}
          <Tooltip label="Length of time, in seconds, until the liveboard is refreshed (use 0 for no refresh)">
            <Text
              size="xs"
              fw="bold"
              style={{
                width: "80px",
                textAlign: "center",
                userSelect: "none",
                textDecoration: "underline dotted black",
              }}
            >
              Refresh (secs)
            </Text>
          </Tooltip>
          <Text
            size="xs"
            fw="bold"
            style={{ width: "40px", textAlign: "center", userSelect: "none" }}
          >
            Delete
          </Text>
        </div>
        {liveboards.map((lb) => (
          <div key={lb.id} className={styles.row}>
            <Text
              size="sm"
              style={{
                flex: 1,
                lineClamp: 1,
                textAlign: "left",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {lb.name}
            </Text>
            <div style={{ width: "80px" }}>
              <ActionIcon
                variant="subtle"
                color={lb.hideHeader ? "gray.5" : "green"}
                radius="xl"
                onClick={() => handleUpdateHideHeader(lb.id, !lb.hideHeader)}
              >
                {lb.hideHeader ? <EyeClosed /> : <Eye />}
              </ActionIcon>
            </div>
            {liveboards.length > 1 && (
              <div style={{ width: "80px" }}>
                <NumberInput
                  size="xs"
                  value={lb.displaySeconds}
                  style={{ width: "100%" }}
                  hideControls
                  onBlur={({ target: { value } }) =>
                    handleDisplayBlur(lb.id, value)
                  }
                />
              </div>
            )}
            <div style={{ width: "80px" }}>
              <NumberInput
                size="xs"
                value={lb.refreshInterval}
                style={{ width: "100%" }}
                hideControls
                onBlur={({ target: { value } }) =>
                  handleRefreshBlur(lb.id, value)
                }
              />
            </div>
            <div style={{ width: "40px" }}>
              <ActionIcon
                color="red"
                variant="transparent"
                size="md"
                onClick={() => handleRemoveLiveboard(lb.id)}
              >
                <X className={styles.buttonIcon} />
              </ActionIcon>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
