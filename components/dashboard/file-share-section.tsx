"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, Link2, Copy, Trash2, FileText, ImageIcon, File, Check, Download } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"

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

export function FileShareSection() {
  const { user } = useAuth()
  const [files, setFiles] = useState<SharedFile[]>([])
  const [textContent, setTextContent] = useState("")
  const [textName, setTextName] = useState("")
  const [copied, setCopied] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingFiles, setPendingFiles] = useState<Array<{ file: File; title: string }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const username = user?.username || user?.name?.toLowerCase().replace(/\s+/g, "") || "user"

  useEffect(() => {
    if (!user?._id) return
    fetch("/api/files")
      .then((res) => res.json())
      .then((data) => {
        if (data.files) setFiles(data.files)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?._id])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected?.length) return
    const valid: Array<{ file: File; title: string }> = []
    for (let i = 0; i < selected.length; i++) {
      const f = selected[i]
      if (f.size > 5 * 1024 * 1024) {
        toast({ title: "Error", description: `${f.name} is too large. Max 5MB.`, variant: "destructive" })
        continue
      }
      valid.push({ file: f, title: f.name })
    }
    if (valid.length > 0) setPendingFiles(valid)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const updatePendingTitle = (index: number, title: string) => {
    setPendingFiles((prev) => prev.map((p, i) => (i === index ? { ...p, title } : p)))
  }

  const removePending = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleConfirmUpload = async () => {
    if (pendingFiles.length === 0) return
    for (const { file, title } of pendingFiles) {
      const reader = new FileReader()
      const content = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
      const isImage = file.type.startsWith("image/")
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: title.trim() || file.name,
          type: isImage ? "image" : "file",
          content,
          mimeType: file.type,
          size: file.size,
        }),
      })
      const data = await res.json()
      if (res.ok && data.file) {
        setFiles((prev) => [...prev, { ...data.file, createdAt: new Date().toISOString() }])
      }
    }
    setPendingFiles([])
    toast({ title: "Success", description: "File(s) uploaded!" })
  }

  const handleShareText = async () => {
    if (!textContent.trim()) {
      toast({ title: "Error", description: "Please enter some text", variant: "destructive" })
      return
    }
    const res = await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: textName || `Text Note ${files.length + 1}`,
        type: "text",
        content: textContent,
      }),
    })
    const data = await res.json()
    if (res.ok && data.file) {
      setFiles((prev) => [...prev, { ...data.file, createdAt: new Date().toISOString() }])
      setTextContent("")
      setTextName("")
      toast({ title: "Success", description: "Text shared!" })
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/files?fileId=${id}`, { method: "DELETE" })
    if (res.ok) {
      setFiles((prev) => prev.filter((f) => f.id !== id))
      toast({ title: "Deleted", description: "File removed" })
    }
  }

  const handleCopy = (id: string) => {
    const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/share/${username}/${id}`
    navigator.clipboard.writeText(shareUrl)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
    toast({ title: "Copied", description: "Share link copied!" })
  }

  const handleDownload = (file: SharedFile) => {
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

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image": return <ImageIcon className="h-5 w-5" />
      case "text": return <FileText className="h-5 w-5" />
      default: return <File className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          File & Photo Sharing
        </CardTitle>
        <CardDescription>
          Upload files, photos, or text and share with anyone via link
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Upload File or Photo</Label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              variant="outline"
              className="w-full h-20 border-dashed bg-transparent"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-1">
                <Upload className="h-6 w-6" />
                <span className="text-xs">Click or tap to upload (max 5MB)</span>
              </div>
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Share Text</Label>
            <Input
              placeholder="Title (optional)"
              value={textName}
              onChange={(e) => setTextName(e.target.value)}
              className="mb-2"
            />
            <Textarea
              placeholder="Enter text to share..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={2}
            />
            <Button
              onClick={handleShareText}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Share Text
            </Button>
          </div>
        </div>

        {/* Upload dialog - set title for each file */}
        <Dialog open={pendingFiles.length > 0} onOpenChange={(open) => !open && setPendingFiles([])}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set title for files</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {pendingFiles.map((p, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-secondary">
                    {p.file.type.startsWith("image/") ? <ImageIcon className="h-4 w-4" /> : <File className="h-4 w-4" />}
                  </div>
                  <Input
                    value={p.title}
                    onChange={(e) => updatePendingTitle(i, e.target.value)}
                    placeholder="File title"
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removePending(i)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleConfirmUpload} className="flex-1 bg-accent text-accent-foreground">
                Upload
              </Button>
              <Button variant="outline" onClick={() => setPendingFiles([])}>Cancel</Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Shared Items ({files.length})</h4>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center rounded-lg border border-dashed border-border">
              <Link2 className="h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">No files shared yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground overflow-hidden">
                    {file.type === "image" && file.content ? (
                      <img src={file.content || "/placeholder.svg"} alt={file.name} className="h-full w-full object-cover" />
                    ) : (
                      getFileIcon(file.type)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(file.size)} {file.size ? "• " : ""}{file.views} views
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(file.id)}>
                      {copied === file.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(file)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(file.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
