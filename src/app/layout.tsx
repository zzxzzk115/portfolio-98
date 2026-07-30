import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kexuan 98 — Kexuan Zhang",
  description:
    "Personal homepage of Kexuan Zhang (Lazy_V) — PhD student in Perceptual Graphics at the University of Leeds, game & graphics programmer. Styled after Windows 98.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
