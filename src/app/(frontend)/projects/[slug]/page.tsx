import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LayoutViewport } from '@/components/LayoutViewport'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'

import type { Project } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ProjectIntro } from '@/components/projects/ProjectIntro'
import { ProjectStepsSection } from '@/components/projects/ProjectSteps'
import { ProjectNavFooter } from '@/components/projects/ProjectNavFooter'
import { fetchProjectPage } from '@/lib/projects/fetchProjectPage'

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const projects = await payload.find({
      collection: 'projects',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    type ProjectSlugDoc = { slug?: string | null }

    const params = (projects.docs as ProjectSlugDoc[])
      .filter((doc): doc is { slug: string } => Boolean(doc.slug))
      .map(({ slug }) => {
        return { slug }
      })

    return params
  } catch (error) {
    console.error('Error generating static params for projects:', error)
    return []
  }
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProjectDetail({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const { isEnabled: draft } = await draftMode()
  const url = '/projects/' + slug
  const { project, redirects } = await fetchProjectPage(slug)

  if (!project) {
    return <PayloadRedirects url={url} prefetchedRedirects={redirects ?? undefined} />
  }

  return (
    <article>
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <LayoutViewport variant="wide" scrollable={true} restoreScroll contentClassName="project-detail-scroll">
        <div className="flex h-auto w-full flex-col items-center">
          <ProjectIntro intro={project.intro} />
          <ProjectStepsSection steps={project.steps} />
          <ProjectNavFooter navFooter={project.navFooter} />
        </div>
      </LayoutViewport>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const { project } = await fetchProjectPage(slug)

  if (!project) {
    return {
      title: 'Project Not Found | CATBOX',
    }
  }

  const title = project.title ? `${project.title} | CATBOX` : 'Project | CATBOX'
  
  return {
    title,
    description: 'Project detail page',
  }
}

//调试文件
// export default function ProjectDetailTestPage() {
//   return (
//     <div style={{ padding: 32 }}>
//       <h1>Project detail TEST</h1>
//       <p>如果你能看到这段文字，说明 `/projects/[slug]` 至少走到了 page.tsx。</p>
//     </div>
//   )
// }

// src/app/(frontend)/projects/[slug]/page.tsx
//调试文件2

// type PageProps = {
//   params: { slug: string }
// }

// export default function ProjectDetailPage({ params }: PageProps) {
//   return (
//     <div style={{ padding: 32 }}>
//       <h1>Project detail TEST</h1>
//       <p>slug: <strong>{params.slug}</strong></p>
//     </div>
//   )
// }

