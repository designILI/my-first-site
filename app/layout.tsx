import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paper Farm | Handcrafted Farm Scene",
  description:
    "A calm moving paper craft farm scene with layered cutout art, friendly animals, and warm handmade textures.",
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
