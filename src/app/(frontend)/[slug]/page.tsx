import type { Metadata } from 'next'
import Link from 'next/link'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { cn } from '@/utilities/ui'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { SketchlogCard } from '@/components/sketchlog/SketchlogCard'
import { AboutMain } from '@/components/about/AboutMain'
import { fetchFeaturedProjectsForHome } from '@/lib/projects/fetchFeaturedProjectsForHome'
import { fetchFeaturedSketchlogsForHome } from '@/lib/sketchlogs/fetchFeaturedSketchlogsForHome'
import { fetchAboutPageForHome } from '@/lib/pages/fetchAboutPageForHome'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { AboutMobileHero } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const dynamicParams = true
// Enable ISR revalidation: regenerate homepage every 60 seconds to fetch fresh sketchlog data
export const revalidate = 60

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug

  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  // Remove bottom padding for customHomepage hero to eliminate gap between hero and footer
  const isCustomHomepage = hero?.type === 'customHomepage'

  // 只在首页（slug === 'home'）时获取移动端 feed 数据
  const isHomePage = slug === 'home'
  const [featuredProjects, featuredSketchlogs, aboutPageData, mobileHeroData] = isHomePage
    ? await Promise.all([
        fetchFeaturedProjectsForHome(),
        fetchFeaturedSketchlogsForHome(),
        fetchAboutPageForHome(),
        getCachedGlobal('aboutMobileHero', 1)(),
      ])
    : [[], [], null, null]

  return (
    <article className={cn(!isCustomHomepage && 'pb-16')}>
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      {layout && <RenderBlocks blocks={layout} />}

      {/* 移动端 Home Feed（仅在首页显示） */}
      {isHomePage && (
        <section className="lg:hidden px-4 sm:px-6 py-8 space-y-8">
          {/* Projects 精选 */}
          {featuredProjects.length > 0 && (
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-sm font-semibold tracking-wide uppercase">Project</h2>
                <Link
                  href="/projects"
                  className="text-xs text-muted-foreground hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}

          {/* Sketchlog 精选 */}
          {featuredSketchlogs.length > 0 && (
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-sm font-semibold tracking-wide uppercase">Sketchlog</h2>
                <Link
                  href="/sketchlog"
                  className="text-xs text-muted-foreground hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {featuredSketchlogs.map((entry) => (
                  <SketchlogCard key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          )}

          {/* About 正文区域 */}
          {aboutPageData && (
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="text-sm font-semibold tracking-wide uppercase">About</h2>
                <Link
                  href="/about"
                  className="text-xs text-muted-foreground hover:underline"
                >
                  View Full Page
                </Link>
              </div>
              <div className="border border-border/40 rounded-2xl bg-background/80 p-4">
                <AboutMain decorationsData={aboutPageData} mobileHero={mobileHeroData as AboutMobileHero | null} />
              </div>
            </div>
          )}
        </section>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  try {
    if (!slug) {
      return null
    }

    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      depth: 1, // prevent recursive payload relations from causing RSC serialization hang
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  } catch (error) {
    console.error('Failed to fetch page by slug:', error)
    return null
  }
})

//调试信息
// import type { Metadata } from 'next'

// interface ProjectDetailPageProps {
//   params: { slug: string }
// }

// export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
//   return (
//     <div className="w-full min-h-screen p-8">
//       <h1>Project Detail Test</h1>
//       <p>slug: {params.slug}</p>
//     </div>
//   )
// }