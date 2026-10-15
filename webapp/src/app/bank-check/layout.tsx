import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bank Check — ScamLens",
  description: "Check if a recipient bank account has been reported for scams or mule activity before transferring money.",
};

export default function BankCheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
