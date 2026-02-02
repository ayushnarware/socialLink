"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Eye, Download, Trash2, Plus, Settings, Share2, Check, FileText, Phone, Mail, ImageIcon, File, Calendar, Hash, List, ToggleLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"

export interface FormField {
  id: string
  label: string
  type: "text" | "email" | "phone" | "textarea" | "number" | "date" | "select" | "checkbox" | "file" | "image"
  required: boolean
  options?: string[]
  placeholder?: string
}

export interface FormResponse {
  id: string
  formId: string
  data: Record<string, string>
  submittedAt: string
}

export interface Form {
  id: string
  title: string
  description: string
  fields: FormField[]
  createdAt: string
  responses: FormResponse[]
}

const fieldTypeIcons: Record<string, React.ReactNode> = {
  text: <FileText className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
  textarea: <FileText className="h-4 w-4" />,
  number: <Hash className="h-4 w-4" />,
  date: <Calendar className="h-4 w-4" />,
  select: <List className="h-4 w-4" />,
  checkbox: <ToggleLeft className="h-4 w-4" />,
  file: <File className="h-4 w-4" />,
  image: <ImageIcon className="h-4 w-4" />,
}

export function FormBuilderSection() {
  const { user } = useAuth()
  const [forms, setForms] = useState<Form[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [selectedForm, setSelectedForm] = useState<Form | null>(null)
  const [showFieldDialog, setShowFieldDialog] = useState(false)
  const [showResponsesDialog, setShowResponsesDialog] = useState(false)
  const [newField, setNewField] = useState<Partial<FormField>>({ type: "text", required: false })
  const [optionsText, setOptionsText] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  const username = user?.username || user?.name?.toLowerCase().replace(/\s+/g, "") || "user"

  useEffect(() => {
    const saved = localStorage.getItem(`ayush_forms_${username}`)
    if (saved) {
      setForms(JSON.parse(saved))
    }
  }, [username])

  const saveForms = (newForms: Form[]) => {
    localStorage.setItem(`ayush_forms_${username}`, JSON.stringify(newForms))
    setForms(newForms)
  }

  const createForm = () => {
    if (!formTitle) {
      toast({ title: "Error", description: "Form title is required", variant: "destructive" })
      return
    }

    const newForm: Form = {
      id: Date.now().toString(),
      title: formTitle,
      description: formDescription,
      fields: [],
      createdAt: new Date().toISOString(),
      responses: [],
    }

    saveForms([...forms, newForm])
    setSelectedForm(newForm)
    setFormTitle("")
    setFormDescription("")
    setIsOpen(false)
    toast({ title: "Success", description: "Form created!" })
  }

  const addField = () => {
    if (!selectedForm || !newField.label || !newField.type) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" })
      return
    }

    const field: FormField = {
      id: Date.now().toString(),
      label: newField.label,
      type: newField.type as FormField["type"],
      required: newField.required || false,
      placeholder: newField.placeholder,
      options: ["select", "checkbox"].includes(newField.type as string) 
        ? optionsText.split("\n").filter(o => o.trim()) 
        : undefined,
    }

    const updatedForm = { ...selectedForm, fields: [...selectedForm.fields, field] }
    saveForms(forms.map(f => f.id === selectedForm.id ? updatedForm : f))
    setSelectedForm(updatedForm)
    setNewField({ type: "text", required: false })
    setOptionsText("")
    setShowFieldDialog(false)
    toast({ title: "Success", description: "Field added!" })
  }

  const removeField = (fieldId: string) => {
    if (!selectedForm) return
    const updatedForm = { ...selectedForm, fields: selectedForm.fields.filter(f => f.id !== fieldId) }
    saveForms(forms.map(f => f.id === selectedForm.id ? updatedForm : f))
    setSelectedForm(updatedForm)
  }

  const deleteForm = (id: string) => {
    saveForms(forms.filter(f => f.id !== id))
    if (selectedForm?.id === id) setSelectedForm(null)
    toast({ title: "Deleted", description: "Form removed" })
  }

  const getShareUrl = (formId: string) => {
    return `${window.location.origin}/form/${username}/${formId}`
  }

  const copyShareLink = (formId: string) => {
    navigator.clipboard.writeText(getShareUrl(formId))
    setCopied(formId)
    setTimeout(() => setCopied(null), 2000)
    toast({ title: "Copied", description: "Form link copied!" })
  }

  const exportResponses = (form: Form) => {
    if (form.responses.length === 0) {
      toast({ title: "No data", description: "No responses to export", variant: "destructive" })
      return
    }

    const headers = form.fields.map(f => f.label)
    const rows = form.responses.map(r => form.fields.map(f => r.data[f.id] || ""))
    
    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${form.title}-responses.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "Exported", description: "Responses downloaded as CSV" })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Form Builder
            </CardTitle>
            <CardDescription>Create forms to collect text, emails, phone numbers, photos, PDFs & more</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4" />
                New Form
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Form</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="form-title">Form Title</Label>
                  <Input
                    id="form-title"
                    placeholder="e.g., Contact Form"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="form-desc">Description (Optional)</Label>
                  <Textarea
                    id="form-desc"
                    placeholder="Tell people what this form is about"
                    value={formDescription}
                    onChange={e => setFormDescription(e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={createForm} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                    Create Form
                  </Button>
                  <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {forms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 rounded-lg border border-dashed border-border">
            <FileText className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-muted-foreground">No forms created yet</p>
            <p className="text-sm text-muted-foreground/70">Create your first form to start collecting data</p>
          </div>
        ) : (
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="list">Forms ({forms.length})</TabsTrigger>
              {selectedForm && <TabsTrigger value="editor">Edit: {selectedForm.title}</TabsTrigger>}
            </TabsList>

            <TabsContent value="list" className="space-y-2 mt-4">
              {forms.map(form => (
                <div key={form.id} className="flex items-center justify-between gap-2 rounded-lg border border-border p-3 bg-secondary/30">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{form.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {form.fields.length} fields • {form.responses.length} responses
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setSelectedForm(form)} className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => copyShareLink(form.id)} className="h-8 w-8 p-0">
                      {copied === form.id ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setSelectedForm(form); setShowResponsesDialog(true) }} className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteForm(form.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            {selectedForm && (
              <TabsContent value="editor" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground">Form Fields ({selectedForm.fields.length})</h3>
                    <Dialog open={showFieldDialog} onOpenChange={setShowFieldDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                          <Plus className="h-4 w-4" />
                          Add Field
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Form Field</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="field-label">Field Label</Label>
                            <Input
                              id="field-label"
                              placeholder="e.g., Your Name"
                              value={newField.label || ""}
                              onChange={e => setNewField({ ...newField, label: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="field-type">Field Type</Label>
                            <select
                              id="field-type"
                              value={newField.type}
                              onChange={e => setNewField({ ...newField, type: e.target.value as any })}
                              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                            >
                              <option value="text">Short Text</option>
                              <option value="textarea">Long Text</option>
                              <option value="email">Email</option>
                              <option value="phone">Phone Number</option>
                              <option value="number">Number</option>
                              <option value="date">Date</option>
                              <option value="select">Dropdown</option>
                              <option value="checkbox">Checkboxes</option>
                              <option value="image">Photo Upload</option>
                              <option value="file">File Upload (PDF, etc.)</option>
                            </select>
                          </div>
                          {["select", "checkbox"].includes(newField.type as string) && (
                            <div>
                              <Label htmlFor="field-options">Options (one per line)</Label>
                              <Textarea
                                id="field-options"
                                placeholder="Option 1&#10;Option 2&#10;Option 3"
                                value={optionsText}
                                onChange={e => setOptionsText(e.target.value)}
                                className="mt-1"
                                rows={3}
                              />
                            </div>
                          )}
                          <div>
                            <Label htmlFor="field-placeholder">Placeholder (Optional)</Label>
                            <Input
                              id="field-placeholder"
                              placeholder="e.g., Enter your name"
                              value={newField.placeholder || ""}
                              onChange={e => setNewField({ ...newField, placeholder: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="required"
                              checked={newField.required || false}
                              onChange={e => setNewField({ ...newField, required: e.target.checked })}
                              className="rounded"
                            />
                            <Label htmlFor="required" className="cursor-pointer">Required field</Label>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={addField} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                              Add Field
                            </Button>
                            <Button onClick={() => setShowFieldDialog(false)} variant="outline" className="flex-1">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {selectedForm.fields.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No fields added yet. Add fields to build your form.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedForm.fields.map((field, index) => (
                        <div key={field.id} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3 border border-border">
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">{fieldTypeIcons[field.type]}</span>
                            <div>
                              <p className="text-sm font-medium text-foreground">{field.label}</p>
                              <p className="text-xs text-muted-foreground capitalize">{field.type} {field.required && "• Required"}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => removeField(field.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={() => copyShareLink(selectedForm.id)} variant="outline" className="flex-1 gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Form
                  </Button>
                  <Button onClick={() => window.open(getShareUrl(selectedForm.id), "_blank")} variant="outline" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button onClick={() => setShowResponsesDialog(true)} variant="outline" className="flex-1 gap-2">
                    <FileText className="h-4 w-4" />
                    Responses ({selectedForm.responses.length})
                  </Button>
                </div>
              </TabsContent>
            )}
          </Tabs>
        )}

        {/* Responses Dialog */}
        <Dialog open={showResponsesDialog} onOpenChange={setShowResponsesDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Form Responses ({selectedForm?.responses.length || 0})</span>
                {selectedForm && selectedForm.responses.length > 0 && (
                  <Button size="sm" variant="outline" onClick={() => exportResponses(selectedForm)} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedForm && selectedForm.responses.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No responses yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedForm?.responses.map((response, index) => (
                  <div key={response.id} className="rounded-lg border border-border p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Response #{index + 1}</span>
                      <span>{new Date(response.submittedAt).toLocaleString()}</span>
                    </div>
                    {selectedForm.fields.map(field => (
                      <div key={field.id}>
                        <p className="text-xs text-muted-foreground">{field.label}</p>
                        <p className="text-sm text-foreground">{response.data[field.id] || "-"}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
