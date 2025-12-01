import { Loader, Text } from "@mantine/core";
import styles from "./page-loading.module.css";
import { CardContent } from "../card-content/card-content";

export interface PageLoadingProps {
  children?: string;
}

export const PageLoading = ({ children }: PageLoadingProps) => {
  return (
    <div className={styles.root}>
      <CardContent>
        <div className={styles.content}>
          <Loader color="blue" type="dots" />
          {children && <Text c="dimmed">{children}</Text>}
        </div>
      </CardContent>
    </div>
  );
};
