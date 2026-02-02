'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Download, FileText } from 'lucide-react'
import { exportToCSV, exportToExcel, exportToJSON } from '@/lib/export-utils'

interface ExportMenuProps {
  data: Array<Record<string, any>>
  filename?: string
  onExportStart?: () => void
  onExportComplete?: () => void
}

export function ExportMenu({
  data,
  filename = `export-${Date.now()}`,
  onExportStart,
  onExportComplete,
}: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleExport = (format: 'csv' | 'excel' | 'json') => {
    onExportStart?.()

    try {
      const finalFilename = `${filename}.${format === 'excel' ? 'xlsx' : format}`

      switch (format) {
        case 'csv':
          exportToCSV(data, finalFilename)
          break
        case 'excel':
          exportToExcel(data, finalFilename)
          break
        case 'json':
          exportToJSON(data, finalFilename)
          break
      }

      setIsOpen(false)
      onExportComplete?.()
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='gap-2'>
          <Download className='h-4 w-4' />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Responses</DialogTitle>
          <DialogDescription>
            Choose your preferred format to export the form responses
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-3'>
          <div
            role='button'
            onClick={() => handleExport('csv')}
            className='flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-accent/5 transition-colors'
          >
            <FileText className='h-5 w-5 text-muted-foreground' />
            <div>
              <p className='font-medium text-sm'>CSV File</p>
              <p className='text-xs text-muted-foreground'>Excel, Google Sheets compatible</p>
            </div>
          </div>

          <div
            role='button'
            onClick={() => handleExport('excel')}
            className='flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-accent/5 transition-colors'
          >
            <FileText className='h-5 w-5 text-muted-foreground' />
            <div>
              <p className='font-medium text-sm'>Excel (XLSX)</p>
              <p className='text-xs text-muted-foreground'>Microsoft Excel format</p>
            </div>
          </div>

          <div
            role='button'
            onClick={() => handleExport('json')}
            className='flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-accent/5 transition-colors'
          >
            <FileText className='h-5 w-5 text-muted-foreground' />
            <div>
              <p className='font-medium text-sm'>JSON</p>
              <p className='text-xs text-muted-foreground'>Structured data format</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
