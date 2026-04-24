import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { LifeQuestProvider } from "@/components/providers/LifeQuestProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "LifeQuest | Productivity RPG Dashboard",
  description:
    "A local-first productivity RPG for leveling up tasks, habits, focus, quests, and life areas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body
        className="min-h-full bg-background text-foreground"
        suppressHydrationWarning
      >
        <LifeQuestProvider>
          <AppShell>{children}</AppShell>
        </LifeQuestProvider>
      </body>
    </html>
  );
}
