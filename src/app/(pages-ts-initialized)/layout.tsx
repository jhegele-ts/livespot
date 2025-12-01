"use client";

import dynamic from "next/dynamic";

const ThoughtSpotInit = dynamic<{ children?: React.ReactNode }>(
  () => import("../../components/thoughtspot-init/thoughtspot-init"),
  { ssr: false }
);

export type LayoutTsInitializedProps = {
  children?: React.ReactNode;
};

const LayoutTsInitialized = ({ children }: LayoutTsInitializedProps) => {
  return <ThoughtSpotInit>{children}</ThoughtSpotInit>;
};

export default LayoutTsInitialized;
