import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SyncFlow — Real-Time Collaborative Workflow",
  description: "Linear-inspired collaborative Kanban platform with Raw SQL and Next.js 15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#090d16] text-slate-100 selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
