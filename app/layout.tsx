import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoleLens | Evidence, not a score",
  description:
    "Compare a job description with a candidate profile through transparent, evidence-based analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
