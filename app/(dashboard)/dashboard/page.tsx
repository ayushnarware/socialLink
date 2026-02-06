"use client"

import { useState } from "react"
import { LinkBuilderV2 } from "@/components/dashboard/link-builder-v2"
import { LinkPreview } from "@/components/dashboard/link-preview"
import { Button } from "@/components/ui/button"
import { Eye, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function DashboardPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  return (
    <div className="relative">
      <div className="grid gap-6 lg:grid-cols-2">
        <LinkBuilderV2 />
        <div className="hidden lg:block">
          <LinkPreview />
        </div>
      </div>

      {/* Mobile Preview Button */}
      <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 lg:hidden">
        <Button 
          onClick={() => setIsPreviewOpen(true)}
          className="rounded-full bg-accent px-6 py-6 text-accent-foreground shadow-lg hover:bg-accent/90"
        >
          <Eye className="mr-2 h-5 w-5" />
          Preview
        </Button>
      </div>

      {/* Mobile Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="h-[90vh] max-w-[400px] overflow-hidden p-0 sm:max-w-[400px]">
          <DialogHeader className="absolute right-2 top-2 z-50">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsPreviewOpen(false)}
              className="rounded-full bg-background/50 backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="h-full overflow-y-auto pt-8">
            <LinkPreview />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
