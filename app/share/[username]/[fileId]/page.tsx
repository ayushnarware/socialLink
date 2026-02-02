"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, ImageIcon, File, ArrowLeft, Eye } from "lucide-react"

interface SharedFile {
  id: string
  name: string
  type: "file" | "image" | "text"
  content: string
  mimeType?: string
  size?: number
  views: number
  createdAt: string
}

export default function SharedFilePage() {
  const params = useParams()
  const username = params.username as string
  const fileId = params.fileId as string
  const [file, setFile] = useState<SharedFile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    // Load file from localStorage
    const filesKey = `ayush_files_${username}`
    const saved = localStorage.getItem(filesKey)
    
    if (!saved) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const files: SharedFile[] = JSON.parse(saved)
    const foundFile = files.find(f => f.id === fileId)
    
    if (!foundFile) {
      setNotFound(true)
      setLoading(false)
      return
    }

    // Increment view count
    const updatedFiles = files.map(f => 
      f.id === fileId ? { ...f, views: f.views + 1 } : f
    )
    localStorage.setItem(filesKey, JSON.stringify(updatedFiles))
    
    setFile({ ...foundFile, views: foundFile.views + 1 })
    setLoading(false)
  }, [username, fileId])

  const handleDownload = () => {
    if (!file) return
    
    if (file.type === "text") {
      const blob = new Blob([file.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${file.name}.txt`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      const a = document.createElement("a")
      a.href = file.content
      a.download = file.name
      a.click()
    }
  }

  const formatSize = (bytes?: number) => {
    if (!bytes) return ""
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  if (notFound || !file) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <h1 className="text-2xl font-bold text-foreground">File Not Found</h1>
        <p className="mt-2 text-muted-foreground">This file doesn't exist or has been removed.</p>
        <Link href="/">
          <Button className="mt-6 bg-transparent" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Ayush
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {file.type === "image" ? (
                <ImageIcon className="h-6 w-6" />
              ) : file.type === "text" ? (
                <FileText className="h-6 w-6" />
              ) : (
                <File className="h-6 w-6" />
              )}
              {file.name}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {file.size && <span>{formatSize(file.size)}</span>}
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {file.views} views
              </span>
              <span>Shared by @{username}</span>
            </div>
          </CardHeader>
          <CardContent>
            {/* Content Display */}
            {file.type === "image" && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img src={file.content || "/placeholder.svg"} alt={file.name} className="w-full" />
              </div>
            )}

            {file.type === "text" && (
              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm text-foreground">{file.content}</pre>
              </div>
            )}

            {file.type === "file" && (
              <div className="flex flex-col items-center justify-center py-12 rounded-lg border border-border bg-secondary/30">
                <File className="h-16 w-16 text-muted-foreground" />
                <p className="mt-4 font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">{formatSize(file.size)}</p>
              </div>
            )}

            {/* Download Button */}
            <Button
              onClick={handleDownload}
              className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardContent>
        </Card>

        {/* Branding */}
        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-accent/30 text-xs font-bold text-accent">
              A
            </div>
            <span>Powered by Ayush</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
