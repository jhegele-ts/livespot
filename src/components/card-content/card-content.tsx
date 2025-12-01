import styles from "./card-content.module.css";
import { Card } from "@mantine/core";

export type CardContentProps = {
  children?: React.ReactNode;
};

export const CardContent = ({ children }: CardContentProps) => {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className={styles.root}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {children}
    </Card>
  );
};
