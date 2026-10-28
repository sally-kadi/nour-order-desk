
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nour's Order Desk",
  description: "Handmade candle order management dashboard",
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
