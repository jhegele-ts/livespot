import { Text } from "@mantine/core";
import styles from "./page-error.module.css";
import { CardContent } from "../card-content/card-content";

export interface PageErrorProps {
  children: string;
}

export const PageError = ({ children }: PageErrorProps) => {
  return (
    <div className={styles.root}>
      <CardContent>
        <Text fw={700} c="red">
          Error
        </Text>
        <Text c="red">{children}</Text>
      </CardContent>
    </div>
  );
};
