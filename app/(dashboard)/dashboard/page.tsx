"use client"

import { LinkBuilderV2 } from "@/components/dashboard/link-builder-v2"
import { LinkPreview } from "@/components/dashboard/link-preview"

export default function DashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <LinkBuilderV2 />
      <div className="hidden lg:block">
        <LinkPreview />
      </div>
    </div>
  )
}
