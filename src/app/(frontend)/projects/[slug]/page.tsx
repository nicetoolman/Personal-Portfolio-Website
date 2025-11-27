import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Project } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const projects = await payload.find({
    collection: 'projects',
    where: {
      _status: {
        equals: 'published',
      },
    },
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
      return { slug: slug as string }
    })

  return params
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

      {/* TODO: 渲染 Project Intro Grid */}
      {/* TODO: 渲染 Step Blocks */}
      {/* TODO: 渲染 Navigation Footer */}
      
      <div className="w-full py-16 text-center text-secondary">
        <p>Project Detail Page - {project.title}</p>
        <p className="text-sm mt-2">Slug: {slug}</p>
      </div>
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

  // 使用 generateMeta，但需要适配 Project 类型
  // 暂时使用简化的 metadata
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

