import { Metadata } from "next"

async function getProfile(username: string) {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const res = await fetch(`${base}/api/profile/${encodeURIComponent(username)}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    const data = await res.json()
    return data
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  const { username } = await params
  const data = await getProfile(username)
  if (!data?.profile) {
    return { title: "Profile Not Found" }
  }
  const profile = data.profile
  const seo = (profile.seo || {}) as { title?: string; description?: string; keywords?: string; ogImage?: string; canonicalUrl?: string }
  const title = seo.title || `MyProfile.live/@${profile.name}`
  const description = seo.description || profile.bio || `View ${profile.name}'s links and profile`
  const keywords = seo.keywords || "link in bio, profile, links"
  const images = seo.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630 }] : undefined
  const url = seo.canonicalUrl || `/${username}`

  return {
    title: title.slice(0, 60),
    description: description.slice(0, 160),
    keywords: keywords.split(",").map((k: string) => k.trim()),
    openGraph: {
      title: title.slice(0, 60),
      description: description.slice(0, 160),
      images,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: title.slice(0, 60),
      description: description.slice(0, 160),
      images,
    },
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
  }
}

export default function UsernameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
