import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EVIDA | Evidence for Violence De-escalation and Action",
  description:
    "A structured evidence-mapping platform helping practitioners, funders, and policymakers understand what works in reducing armed conflict.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
