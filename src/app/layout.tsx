import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.layer.css";
import "@mantine/notifications/styles.layer.css";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { Providers } from "@/components/providers/providers";
import styles from "./layout.module.css";
import { IconBrandGithubFilled } from "@tabler/icons-react";
import Link from "next/link";

const fontPoppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fontInter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LiveSpot",
  description: "Full-screen display for your ThoughtSpot liveboards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${fontPoppins.variable} ${fontInter.variable}`}>
        <main className={styles.root}>
          <Providers>{children}</Providers>
          <div className={styles.links}>
            <Link
              href="https://github.com/jhegele-ts/livespot"
              target="_blank"
              style={{
                color: "black",
              }}
            >
              <IconBrandGithubFilled className={styles.linkIcon} />
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
