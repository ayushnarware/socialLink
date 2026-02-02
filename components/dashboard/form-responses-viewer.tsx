'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExportMenu } from './export-menu'
import { toast } from 'react-toastify'
import { Download, FileText } from 'lucide-react'
import { exportToCSV, exportToExcel } from './export-functions'

interface FormResponse {
  id: string
  timestamp: string
  data: Record<string, any>
}

export function FormResponsesViewer({ formId, formTitle }: { formId: string; formTitle: string }) {
  const [responses, setResponses] = useState<FormResponse[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 86400000).toLocaleString(),
      data: { name: 'John Doe', email: 'john@example.com', message: 'Great product!' },
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 172800000).toLocaleString(),
      data: { name: 'Jane Smith', email: 'jane@example.com', message: 'Love it!' },
    },
  ])

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Form Responses</CardTitle>
            <CardDescription>{formTitle} - {responses.length} responses</CardDescription>
          </div>
          <ExportMenu
            data={responses.map(r => ({ timestamp: r.timestamp, ...r.data }))}
            filename={`${formTitle}-responses`}
          />
        </div>
      </CardHeader>
      <CardContent>
        {responses.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-8'>
            <p className='text-muted-foreground'>No responses yet</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-border'>
                  <th className='px-4 py-2 text-left font-medium text-foreground'>Timestamp</th>
                  {Array.from(new Set(responses.flatMap(r => Object.keys(r.data)))).map(key => (
                    <th key={key} className='px-4 py-2 text-left font-medium text-foreground'>
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.map(response => (
                  <tr key={response.id} className='border-b border-border hover:bg-accent/5'>
                    <td className='px-4 py-2 text-muted-foreground'>{response.timestamp}</td>
                    {Array.from(new Set(responses.flatMap(r => Object.keys(r.data)))).map(key => (
                      <td key={key} className='px-4 py-2 text-muted-foreground'>
                        {response.data[key] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
