import type { Metadata } from "next"
import { SettingsLayout } from "@/components/settings/settings-layout"
import { requireAuth } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Settings | StarBridge",
  description: "Manage your StarBridge account settings and preferences",
}

export default async function SettingsPage() {
  // Require authentication for this page
  await requireAuth()

  return <SettingsLayout />
}
