"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, QrCode, Eye, Plus, Trash2, Copy, Check } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import QRCode from "qrcode"

interface QRCodeItem {
  id: string
  name: string
  url: string
  scans: number
  createdAt: string
}

async function generateQRCode(text: string, size: number = 200): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
  } catch (err) {
    console.error(err)
    return ""
  }
}

async function generateQRSVG(text: string): Promise<string> {
  try {
    return await QRCode.toString(text, {
      type: 'svg',
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
  } catch (err) {
    console.error(err)
    return ""
  }
}

export default function QRCodesPage() {
  const { user } = useAuth()
  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([])
  const [newUrl, setNewUrl] = useState("")
  const [newName, setNewName] = useState("")
  const [mainQrUrl, setMainQrUrl] = useState("")
  const [previewQrUrl, setPreviewQrUrl] = useState("")
  const [copied, setCopied] = useState(false)
  
  const username = user?.username || user?.name?.toLowerCase().replace(/\s+/g, "") || "user"
  const profileUrl = `https://myprofile.live/${username}`

  useEffect(() => {
    const saved = localStorage.getItem(`ayush_qrcodes_${username}`)
    if (saved) {
      setQrCodes(JSON.parse(saved))
    }
    
    generateQRCode(profileUrl).then(setMainQrUrl)
  }, [username, profileUrl])

  useEffect(() => {
    if (newUrl) {
      const urlToEncode = newUrl.startsWith("http") ? newUrl : `https://${newUrl}`
      generateQRCode(urlToEncode).then(setPreviewQrUrl)
    } else {
      setPreviewQrUrl("")
    }
  }, [newUrl])

  const saveQrCodes = (codes: QRCodeItem[]) => {
    localStorage.setItem(`ayush_qrcodes_${username}`, JSON.stringify(codes))
    setQrCodes(codes)
  }

  const handleAddQrCode = () => {
    if (!newUrl.trim()) {
      toast({ title: "Error", description: "Please enter a URL", variant: "destructive" })
      return
    }
    
    const url = newUrl.startsWith("http") ? newUrl : `https://${newUrl}`
    
    const newQr: QRCodeItem = {
      id: Date.now().toString(),
      name: newName || new URL(url).hostname,
      url: url,
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

  const handleDownload = async (url: string, name: string, format: "png" | "svg") => {
    if (format === 'png') {
      const qrDataUrl = await generateQRCode(url, 400)
      const link = document.createElement("a")
      link.download = `${name}-qr.png`
      link.href = qrDataUrl
      link.click()
    } else {
      const svgString = await generateQRSVG(url)
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `${name}-qr.svg`
      link.click()
      URL.revokeObjectURL(link.href)
    }
    toast({ title: "Downloaded", description: `QR code saved as ${format.toUpperCase()}` })
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({ title: "Copied", description: "Link copied to clipboard" })
  }

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
              {mainQrUrl ? (
                <img src={mainQrUrl} alt="Profile QR Code" className="h-full w-full" />
              ) : (
                <div className="h-full w-full bg-gray-200 animate-pulse rounded-md" />
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
          
          {previewQrUrl && (
            <div className="mt-6 flex justify-center">
              <div className="rounded-xl border border-border bg-white p-4">
                <img src={previewQrUrl} alt="QR Preview" className="h-40 w-40" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
                <QrCodeListItem
                  key={qr.id}
                  qr={qr}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface QrCodeListItemProps {
  qr: QRCodeItem;
  onDelete: (id: string) => void;
  onDownload: (url: string, name: string, format: "png" | "svg") => void;
  onCopy: (text: string) => void;
}

function QrCodeListItem({ qr, onDelete, onDownload, onCopy }: QrCodeListItemProps) {
  const [qrUrl, setQrUrl] = useState("")

  useEffect(() => {
    generateQRCode(qr.url, 60).then(setQrUrl)
  }, [qr.url])

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-white p-1">
        {qrUrl ? (
          <img src={qrUrl} alt={qr.name} className="h-full w-full" />
        ) : (
          <div className="h-full w-full bg-gray-200 animate-pulse rounded-sm" />
        )}
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
        <Button variant="ghost" size="icon" onClick={() => onCopy(qr.url)}>
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDownload(qr.url, qr.name, "png")}>
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(qr.id)} className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
