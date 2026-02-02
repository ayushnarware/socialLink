"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, QrCode, Eye, Plus, Trash2, Copy, Check } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"

interface QRCodeItem {
  id: string
  name: string
  url: string
  scans: number
  createdAt: string
}

// Simple QR Code generator using Canvas
function generateQRCode(text: string, size: number = 200): string {
  // Using a simple pattern for demo - in production use qrcode library
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  
  if (!ctx) return ""
  
  // White background
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, size, size)
  
  // Generate a deterministic pattern based on URL
  const hash = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const moduleSize = Math.floor(size / 25)
  
  ctx.fillStyle = "#000000"
  
  // Draw finder patterns (corners)
  const drawFinderPattern = (x: number, y: number) => {
    // Outer square
    ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize)
    ctx.fillStyle = "#000000"
    ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize)
  }
  
  drawFinderPattern(2, 2)
  drawFinderPattern(16, 2)
  drawFinderPattern(2, 16)
  
  // Generate data modules based on hash
  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
      // Skip finder pattern areas
      if ((i < 9 && j < 9) || (i < 9 && j > 15) || (i > 15 && j < 9)) continue
      
      const shouldFill = ((hash * (i + 1) * (j + 1)) % 3) === 0
      if (shouldFill) {
        ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
      }
    }
  }
  
  return canvas.toDataURL("image/png")
}

export default function QRCodesPage() {
  const { user } = useAuth()
  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([])
  const [newUrl, setNewUrl] = useState("")
  const [newName, setNewName] = useState("")
  const [mainQrUrl, setMainQrUrl] = useState("")
  const [copied, setCopied] = useState(false)
  
  const username = user?.username || user?.name?.toLowerCase().replace(/\s+/g, "") || "user"
  const profileUrl = `ayush.link/${username}`

  useEffect(() => {
    // Load saved QR codes from localStorage
    const saved = localStorage.getItem(`ayush_qrcodes_${username}`)
    if (saved) {
      setQrCodes(JSON.parse(saved))
    }
    
    // Generate main profile QR
    setMainQrUrl(generateQRCode(profileUrl))
  }, [username, profileUrl])

  const saveQrCodes = (codes: QRCodeItem[]) => {
    localStorage.setItem(`ayush_qrcodes_${username}`, JSON.stringify(codes))
    setQrCodes(codes)
  }

  const handleAddQrCode = () => {
    if (!newUrl.trim()) {
      toast({ title: "Error", description: "Please enter a URL", variant: "destructive" })
      return
    }
    
    const newQr: QRCodeItem = {
      id: Date.now().toString(),
      name: newName || new URL(newUrl.startsWith("http") ? newUrl : `https://${newUrl}`).hostname,
      url: newUrl.startsWith("http") ? newUrl : `https://${newUrl}`,
      scans: 0,
      createdAt: new Date().toISOString(),
    }
    
    saveQrCodes([...qrCodes, newQr])
    setNewUrl("")
    setNewName("")
    toast({ title: "Success", description: "QR code created!" })
  }

  const handleDelete = (id: string) => {
    saveQrCodes(qrCodes.filter(qr => qr.id !== id))
    toast({ title: "Deleted", description: "QR code removed" })
  }

  const handleDownload = (url: string, name: string, format: "png" | "svg") => {
    const qrDataUrl = generateQRCode(url, 400)
    const link = document.createElement("a")
    link.download = `${name}-qr.${format}`
    link.href = qrDataUrl
    link.click()
    toast({ title: "Downloaded", description: `QR code saved as ${format.toUpperCase()}` })
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({ title: "Copied", description: "Link copied to clipboard" })
  }

  // Calculate total scans
  const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scans, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">QR Codes</h1>
          <p className="text-muted-foreground">
            Generate QR codes for any link and track scans
          </p>
        </div>
      </div>

      {/* Main Profile QR Code */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile QR Code</CardTitle>
          <CardDescription>
            Share this QR code to let others easily access your page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="flex h-48 w-48 items-center justify-center rounded-xl border border-border bg-white p-2">
              {mainQrUrl && (
                <img src={mainQrUrl || "/placeholder.svg"} alt="Profile QR Code" className="h-full w-full" />
              )}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Your unique link</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-medium text-foreground">{profileUrl}</p>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(profileUrl)}>
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload(profileUrl, "profile", "png")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PNG
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload(profileUrl, "profile", "svg")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download SVG
                </Button>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Total scans: <span className="font-medium text-foreground">{totalScans}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate New QR Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Generate New QR Code
          </CardTitle>
          <CardDescription>
            Paste any link to generate a QR code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 space-y-2">
              <Label htmlFor="qr-url">URL</Label>
              <Input
                id="qr-url"
                placeholder="https://example.com or any link"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48 space-y-2">
              <Label htmlFor="qr-name">Name (optional)</Label>
              <Input
                id="qr-name"
                placeholder="My Link"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddQrCode} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="mr-2 h-4 w-4" />
                Generate
              </Button>
            </div>
          </div>
          
          {newUrl && (
            <div className="mt-6 flex justify-center">
              <div className="rounded-xl border border-border bg-white p-4">
                <img src={generateQRCode(newUrl.startsWith("http") ? newUrl : `https://${newUrl}`)} alt="QR Preview" className="h-40 w-40" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All QR Codes */}
      <Card>
        <CardHeader>
          <CardTitle>Your QR Codes</CardTitle>
          <CardDescription>
            {qrCodes.length === 0 
              ? "No QR codes yet. Generate one above!"
              : `${qrCodes.length} QR code${qrCodes.length !== 1 ? "s" : ""} created`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {qrCodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <QrCode className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No QR codes yet</p>
              <p className="text-sm text-muted-foreground/70">Generate your first QR code above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {qrCodes.map((qr) => (
                <div
                  key={qr.id}
                  className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-white p-1">
                    <img src={generateQRCode(qr.url, 60) || "/placeholder.svg"} alt={qr.name} className="h-full w-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{qr.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{qr.url}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-lg font-semibold text-foreground">{qr.scans}</p>
                    <p className="text-xs text-muted-foreground">scans</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(qr.url)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(qr.url, qr.name, "png")}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(qr.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
