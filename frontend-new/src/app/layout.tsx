import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "StarBridge - Cross-Chain Bridge",
  description: "Experience the future of cross-chain transfers with StarBridge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
