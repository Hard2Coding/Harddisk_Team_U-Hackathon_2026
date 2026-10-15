import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "ScamGraph AI — Predict Before It Gets Reported",
  description:
    "Evidence-based Thai/English fraud and scam risk intelligence platform. Analyze suspicious SMS, URLs, OCR screenshots, and QR codes before fraud is reported.",
  icons: {
    icon: "/brand-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body suppressHydrationWarning className="antialiased selection:bg-blue-500 selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            <div className="flex min-h-screen">
              {/* Left Sidebar (Desktop) */}
              <Sidebar />

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
                <Header />
                <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
                  {children}
                </main>
              </div>

              {/* Fixed Bottom Bar (Mobile) */}
              <BottomNav />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
