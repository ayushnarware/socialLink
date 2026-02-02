'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Copy,
  ExternalLink,
  Trash2,
  Plus,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Github,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { id: 'twitter', label: 'Twitter (X)', icon: Twitter, color: '#000000' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF0000' },
  { id: 'github', label: 'GitHub', icon: Github, color: '#333333' },
]

export function SocialMediaLinksSection() {
  const [socialLinks, setSocialLinks] = useState<Array<{ id: string; platform: string; url: string }>>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [url, setUrl] = useState('')

  const addLink = () => {
    if (!selectedPlatform || !url) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' })
      return
    }

    const newLink = {
      id: Date.now().toString(),
      platform: selectedPlatform,
      url,
    }

    setSocialLinks([...socialLinks, newLink])
    setUrl('')
    setSelectedPlatform('')
    setIsOpen(false)
    toast({ title: 'Success', description: 'Social link added' })
  }

  const removeLink = (id: string) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id))
    toast({ title: 'Success', description: 'Link removed' })
  }

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({ title: 'Copied', description: 'Link copied to clipboard' })
  }

  const getPlatformIcon = (platformId: string) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId)
    return platform?.icon || Plus
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Connect your social media profiles</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className='gap-2'>
                <Plus className='h-4 w-4' />
                Add Platform
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Social Media Link</DialogTitle>
              </DialogHeader>
              <div className='space-y-4'>
                <div>
                  <Label>Select Platform</Label>
                  <div className='mt-2 grid grid-cols-2 gap-2'>
                    {SOCIAL_PLATFORMS.map(platform => {
                      const Icon = platform.icon
                      return (
                        <button
                          key={platform.id}
                          onClick={() => setSelectedPlatform(platform.id)}
                          className={`flex items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                            selectedPlatform === platform.id
                              ? 'border-accent bg-accent/10'
                              : 'border-border hover:border-muted-foreground'
                          }`}
                        >
                          <Icon className='h-4 w-4' />
                          <span className='text-sm'>{platform.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <Label htmlFor='social-url'>Profile URL</Label>
                  <Input
                    id='social-url'
                    placeholder='https://instagram.com/yourprofile'
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    className='mt-1'
                  />
                </div>
                <div className='flex gap-2'>
                  <Button onClick={addLink} className='flex-1'>
                    Add Link
                  </Button>
                  <Button onClick={() => setIsOpen(false)} variant='outline' className='flex-1'>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {socialLinks.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-8'>
            <p className='text-muted-foreground'>No social media links added yet</p>
            <p className='text-sm text-muted-foreground'>Add your first social link to get started</p>
          </div>
        ) : (
          <div className='space-y-2'>
            {socialLinks.map(link => {
              const platform = SOCIAL_PLATFORMS.find(p => p.id === link.platform)
              const Icon = platform?.icon || Plus
              return (
                <div
                  key={link.id}
                  className='flex items-center justify-between gap-2 rounded-lg border border-border p-3'
                >
                  <div className='flex items-center gap-3 flex-1'>
                    <Icon className='h-5 w-5' style={{ color: platform?.color }} />
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-foreground text-sm'>{platform?.label}</p>
                      <p className='text-xs text-muted-foreground truncate'>{link.url}</p>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => copyLink(link.url)}
                      className='h-8 w-8 p-0'
                    >
                      <Copy className='h-4 w-4' />
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => window.open(link.url, '_blank')}
                      className='h-8 w-8 p-0'
                    >
                      <ExternalLink className='h-4 w-4' />
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => removeLink(link.id)}
                      className='h-8 w-8 p-0 text-destructive'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
