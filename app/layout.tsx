import type { Metadata } from "next";
import "./globals.css";
import { ContextProvider } from "./context";
import { Analytics } from "@vercel/analytics/next"
export const metadata: Metadata = {
  title: "My NFT Dashboard",
  description: "View your Eggle NFT collection on Base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Analytics/>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}
