"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const username = user?.username || user?.name?.toLowerCase().replace(/\s+/g, "") || "user"

  useEffect(() => {
    const saved = localStorage.getItem(`ayush_files_${username}`)
    if (saved) {
      setFiles(JSON.parse(saved))
    }
  }, [username])

  const saveFiles = (newFiles: SharedFile[]) => {
    localStorage.setItem(`ayush_files_${username}`, JSON.stringify(newFiles))
    setFiles(newFiles)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files
    if (!uploadedFiles) return

    const newFiles: SharedFile[] = []
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i]
      
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Error", description: `${file.name} is too large. Max 5MB.`, variant: "destructive" })
        continue
      }

      const reader = new FileReader()
      const content = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      const isImage = file.type.startsWith("image/")
      
      newFiles.push({
        id: Date.now().toString() + i,
        name: file.name,
        type: isImage ? "image" : "file",
        content,
        mimeType: file.type,
        size: file.size,
        views: 0,
        createdAt: new Date().toISOString(),
      })
    }

    saveFiles([...files, ...newFiles])
    toast({ title: "Success", description: `${newFiles.length} file(s) uploaded!` })
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleShareText = () => {
    if (!textContent.trim()) {
      toast({ title: "Error", description: "Please enter some text", variant: "destructive" })
      return
    }

    const newFile: SharedFile = {
      id: Date.now().toString(),
      name: textName || `Text Note ${files.length + 1}`,
      type: "text",
      content: textContent,
      views: 0,
      createdAt: new Date().toISOString(),
    }

    saveFiles([...files, newFile])
    setTextContent("")
    setTextName("")
    toast({ title: "Success", description: "Text shared!" })
  }

  const handleDelete = (id: string) => {
    saveFiles(files.filter(f => f.id !== id))
    toast({ title: "Deleted", description: "File removed" })
  }

  const handleCopy = (id: string) => {
    const shareUrl = `${window.location.origin}/share/${username}/${id}`
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
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              className="w-full h-20 border-dashed bg-transparent"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-1">
                <Upload className="h-6 w-6" />
                <span className="text-xs">Click to upload (max 5MB)</span>
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

        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Shared Items ({files.length})</h4>
          
          {files.length === 0 ? (
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground overflow-hidden">
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
                  <div className="flex gap-1">
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
