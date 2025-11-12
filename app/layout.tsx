import type { Metadata } from "next";
import "./globals.css";
import { ContextProvider } from "./context";

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
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}
