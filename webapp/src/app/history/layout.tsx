import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "History — ScamLens",
  description: "Your recent checks, saved only on this device.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
