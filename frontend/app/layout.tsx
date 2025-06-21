import type React from "react"
import type { Metadata } from "next"
import { Orbitron, Share_Tech_Mono } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech",
})

export const metadata: Metadata = {
  title: "StarBridge - Interstellar Token Transfers",
  description: "Gamified cross-chain bridge with rocket launch animations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${orbitron.variable} ${shareTechMono.variable} font-sans antialiased`}>
        <Providers>
          <Navigation />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
