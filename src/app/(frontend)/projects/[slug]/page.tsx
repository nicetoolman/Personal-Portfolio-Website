import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LayoutViewport } from '@/components/LayoutViewport'
import { draftMode } from 'next/headers'
import React from 'react'

import type { Project } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ProjectIntro } from '@/components/projects/ProjectIntro'
import { ProjectStepsSection } from '@/components/projects/ProjectSteps'
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

    const params = projects.docs
      .filter((doc) => doc.slug)
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

      <LayoutViewport variant="wide" scrollable={true}>
        <div className="flex h-auto w-full flex-col items-center">
          <ProjectIntro intro={project.intro} />
          <ProjectStepsSection steps={project.steps} />
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


