import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LayoutViewport } from '@/components/LayoutViewport'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Project } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ProjectIntro } from '@/components/projects/ProjectIntro'

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
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/projects/' + slug
  const project = await queryProjectBySlug({ slug, draft })

  if (!project) return <PayloadRedirects url={url} />

  return (
    <article>
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <LayoutViewport variant="wide" scrollable={true}>
        <div className="w-full h-auto flex flex-col items-center">
          <ProjectIntro intro={project.intro} />
          {/* TODO: 渲染 Step Blocks */}
          {/* TODO: 渲染 Navigation Footer */}
          
          {/* 占位内容 */}
          <div className="w-full max-w-[890px] py-16 text-center text-secondary">
            <p>Project Detail Page - {project.title}</p>
            <p className="text-sm mt-2">Slug: {slug}</p>
          </div>
        </div>
      </LayoutViewport>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const project = await queryProjectBySlug({ slug, draft: false })

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

const queryProjectBySlug = cache(async ({ slug, draft }: { slug: string; draft: boolean }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    depth: 2, // 需要展开 media 关系
    where: {
      slug: {
        equals: slug,
      },
      ...(draft
        ? {}
        : {
            _status: {
              equals: 'published',
            },
          }),
    },
  })

  return (result.docs?.[0] as Project | undefined) || null
})

