import { Text, Title } from "@mantine/core";
import styles from "./header-content.module.css";

export type HeaderContentProps = {
  title: string;
  description?: string;
};

export const HeaderContent = ({ title, description }: HeaderContentProps) => {
  return (
    <section className={styles.root}>
      <Title order={1}>{title}</Title>
      {description && <Text c="dimmed">{description}</Text>}
    </section>
  );
};
