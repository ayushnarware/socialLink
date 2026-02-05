'use client'

import { SocialMediaLinksSection } from '@/components/dashboard/social-media-links'
import { FileShareSection } from '@/components/dashboard/file-share-section'
import { FormBuilderSection } from '@/components/dashboard/form-builder'
import { LinkPreview } from '@/components/dashboard/link-preview'

export default function LinksAndFilesPage() {
  return (
    <div className='grid gap-6 lg:grid-cols-[1fr,380px]'>
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Links, Files & Forms</h1>
          <p className='text-muted-foreground'>
            Manage your social links, share files, and create forms to collect data
          </p>
        </div>

        <div className='space-y-6'>
          <SocialMediaLinksSection />
          <FileShareSection />
          <FormBuilderSection />
        </div>
      </div>

      <div className='hidden lg:block'>
        <LinkPreview />
      </div>
    </div>
  )
}
