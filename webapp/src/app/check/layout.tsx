import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check a message or link — ScamLens",
  description: "Paste a suspicious message or link and see the warning signs.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
