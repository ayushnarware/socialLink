'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

export interface FormField {
  id: string
  label: string
  type: 'text' | 'email' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'radio'
  required: boolean
  options?: string[]
}

interface PublicFormProps {
  formTitle: string
  formDescription: string
  fields: FormField[]
  onSubmit: (data: Record<string, any>) => void
}

export function PublicFormComponent({
  formTitle,
  formDescription,
  fields,
  onSubmit,
}: PublicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const missingRequired = fields
      .filter(f => f.required)
      .filter(f => !formData[f.id] || formData[f.id] === '')

    if (missingRequired.length > 0) {
      toast({
        title: 'Validation Error',
        description: `Please fill out: ${missingRequired.map(f => f.label).join(', ')}`,
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      onSubmit(formData)
      toast({ title: 'Success', description: 'Form submitted successfully' })
      setFormData({})
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit form', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id] || ''

    switch (field.type) {
      case 'text':
        return (
          <Input
            type='text'
            placeholder={field.label}
            value={value}
            onChange={e => handleChange(field.id, e.target.value)}
            className='mt-1'
          />
        )
      case 'email':
        return (
          <Input
            type='email'
            placeholder={field.label}
            value={value}
            onChange={e => handleChange(field.id, e.target.value)}
            className='mt-1'
          />
        )
      case 'number':
        return (
          <Input
            type='number'
            placeholder={field.label}
            value={value}
            onChange={e => handleChange(field.id, e.target.value)}
            className='mt-1'
          />
        )
      case 'date':
        return (
          <Input
            type='date'
            value={value}
            onChange={e => handleChange(field.id, e.target.value)}
            className='mt-1'
          />
        )
      case 'textarea':
        return (
          <Textarea
            placeholder={field.label}
            value={value}
            onChange={e => handleChange(field.id, e.target.value)}
            className='mt-1 resize-none'
          />
        )
      case 'select':
        return (
          <select
            value={value}
            onChange={e => handleChange(field.id, e.target.value)}
            className='mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm'
          >
            <option value=''>Select an option</option>
            {field.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      case 'checkbox':
        return (
          <div className='flex items-center gap-2 mt-1'>
            <Checkbox
              id={field.id}
              checked={value === true}
              onCheckedChange={checked => handleChange(field.id, checked)}
            />
            <Label htmlFor={field.id} className='cursor-pointer text-sm'>
              {field.label}
            </Label>
          </div>
        )
      case 'radio':
        return (
          <RadioGroup value={value} onValueChange={v => handleChange(field.id, v)} className='mt-1'>
            {field.options?.map(option => (
              <div key={option} className='flex items-center gap-2'>
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <Label htmlFor={`${field.id}-${option}`} className='cursor-pointer'>
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-background py-8'>
      <div className='mx-auto max-w-2xl px-4'>
        <Card>
          <CardHeader>
            <CardTitle>{formTitle}</CardTitle>
            {formDescription && (
              <CardDescription>{formDescription}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {fields.map(field => (
                <div key={field.id}>
                  {field.type !== 'checkbox' && (
                    <Label>
                      {field.label}
                      {field.required && <span className='text-destructive ml-1'>*</span>}
                    </Label>
                  )}
                  {renderField(field)}
                </div>
              ))}

              <Button type='submit' disabled={isSubmitting} className='w-full'>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PublicFormPage() {
  const handleFormSubmit = (data: Record<string, any>) => {
    console.log('Form submitted:', data)
  }

  const sampleFields: FormField[] = [
    {
      id: '1',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      id: '2',
      label: 'Email',
      type: 'email',
      required: true,
    },
    {
      id: '3',
      label: 'Message',
      type: 'textarea',
      required: false,
    },
  ]

  return (
    <PublicFormComponent
      formTitle='Contact Us'
      formDescription='We would love to hear from you. Please fill out the form below.'
      fields={sampleFields}
      onSubmit={handleFormSubmit}
    />
  )
}
