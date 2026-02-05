"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Send, CheckCircle, Upload, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface FormField {
  id: string
  label: string
  type: "text" | "email" | "phone" | "textarea" | "number" | "date" | "select" | "checkbox" | "file" | "image"
  required: boolean
  options?: string[]
  placeholder?: string
}

interface FormResponse {
  id: string
  formId: string
  data: Record<string, string>
  submittedAt: string
}

interface Form {
  id: string
  title: string
  description: string
  fields: FormField[]
  createdAt: string
  responses: FormResponse[]
}

export default function PublicFormPage() {
  const params = useParams()
  const username = params.username as string
  const formId = params.formId as string
  
  const [form, setForm] = useState<Form | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    if (!username || !formId) {
      setNotFound(true)
      setLoading(false)
      return
    }
    fetch(`/api/share/form?username=${encodeURIComponent(username)}&formId=${encodeURIComponent(formId)}`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true)
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data?.form) {
          setForm({ ...data.form, createdAt: "", responses: [] })
          fetch("/api/analytics/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, type: "formView", formId }),
          }).catch(() => {})
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [username, formId])

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleFileChange = async (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "File too large. Max 5MB.", variant: "destructive" })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setFormData(prev => ({ ...prev, [fieldId]: `[File: ${file.name}]` }))
    }
    reader.readAsDataURL(file)
  }

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    const current = formData[fieldId] ? formData[fieldId].split(", ") : []
    let updated: string[]
    
    if (checked) {
      updated = [...current, option]
    } else {
      updated = current.filter(o => o !== option)
    }
    
    setFormData(prev => ({ ...prev, [fieldId]: updated.join(", ") }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return

    // Validate required fields
    for (const field of form.fields) {
      if (field.required && !formData[field.id]) {
        toast({ title: "Error", description: `${field.label} is required`, variant: "destructive" })
        return
      }
    }

    setSubmitting(true)

    const res = await fetch("/api/forms/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formId: form.id, responseData: formData }),
    })

    setSubmitting(false)
    if (res.ok) setSubmitted(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  if (notFound || !form) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <h1 className="text-2xl font-bold text-foreground">Form Not Found</h1>
        <p className="mt-2 text-muted-foreground">This form doesn't exist or has been removed.</p>
        <Link href="/">
          <Button className="mt-6 bg-transparent" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </Link>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="mx-auto max-w-lg">
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
              <h2 className="mt-4 text-2xl font-bold text-foreground">Thank You!</h2>
              <p className="mt-2 text-muted-foreground">Your response has been submitted successfully.</p>
              <Link href={`/${username}`}>
                <Button className="mt-6 bg-transparent" variant="outline">
                  Visit @{username}'s Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Ayush
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>{form.title}</CardTitle>
            {form.description && <CardDescription>{form.description}</CardDescription>}
            <p className="text-xs text-muted-foreground">By @{username}</p>
          </CardHeader>
          <CardContent>
            {form.fields.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">This form has no fields yet.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {form.fields.map(field => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    
                    {field.type === "text" && (
                      <Input
                        id={field.id}
                        placeholder={field.placeholder}
                        value={formData[field.id] || ""}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                        required={field.required}
                      />
                    )}

                    {field.type === "email" && (
                      <Input
                        id={field.id}
                        type="email"
                        placeholder={field.placeholder || "email@example.com"}
                        value={formData[field.id] || ""}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                        required={field.required}
                      />
                    )}

                    {field.type === "phone" && (
                      <Input
                        id={field.id}
                        type="tel"
                        placeholder={field.placeholder || "+91 98765 43210"}
                        value={formData[field.id] || ""}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                        required={field.required}
                      />
                    )}

                    {field.type === "textarea" && (
                      <Textarea
                        id={field.id}
                        placeholder={field.placeholder}
                        value={formData[field.id] || ""}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                        required={field.required}
                        rows={3}
                      />
                    )}

                    {field.type === "number" && (
                      <Input
                        id={field.id}
                        type="number"
                        placeholder={field.placeholder}
                        value={formData[field.id] || ""}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                        required={field.required}
                      />
                    )}

                    {field.type === "date" && (
                      <Input
                        id={field.id}
                        type="date"
                        value={formData[field.id] || ""}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                        required={field.required}
                      />
                    )}

                    {field.type === "select" && field.options && (
                      <select
                        id={field.id}
                        value={formData[field.id] || ""}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                        required={field.required}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select an option</option>
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}

                    {field.type === "checkbox" && field.options && (
                      <div className="space-y-2">
                        {field.options.map(opt => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(formData[field.id] || "").split(", ").includes(opt)}
                              onChange={e => handleCheckboxChange(field.id, opt, e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-sm">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {(field.type === "file" || field.type === "image") && (
                      <div>
                        <input
                          ref={el => { fileInputRefs.current[field.id] = el }}
                          type="file"
                          accept={field.type === "image" ? "image/*" : ".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"}
                          onChange={e => handleFileChange(field.id, e)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRefs.current[field.id]?.click()}
                          className="w-full h-20 border-dashed"
                        >
                          <div className="flex flex-col items-center gap-1">
                            {field.type === "image" ? (
                              <Upload className="h-6 w-6" />
                            ) : (
                              <FileText className="h-6 w-6" />
                            )}
                            <span className="text-xs">
                              {formData[field.id] || `Click to upload ${field.type === "image" ? "photo" : "file"}`}
                            </span>
                          </div>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                <Button 
                  type="submit" 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

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
