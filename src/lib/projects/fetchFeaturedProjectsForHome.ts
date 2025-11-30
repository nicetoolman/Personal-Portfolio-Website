import { unstable_cache } from 'next/cache'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Project } from '@/payload-types'

/**
 * Server-side helper to fetch featured projects for home page.
 * Uses Next.js unstable_cache with revalidation tag for proper cache invalidation.
 */
async function fetchFeaturedProjectsForHomeInternal(): Promise<Project[]> {
  try {
    const payload = await getPayload({ config: configPromise })

    const { docs } = await payload.find({
      collection: 'projects',
      where: {
        _status: {
          equals: 'published',
        },
      },
      sort: '-publishedOn', // 按发布日期倒序
      depth: 1, // prevent recursive payload relations from causing RSC serialization hang
      limit: 3,
      pagination: false,
    })

    return (docs as Project[]) || []
  } catch (error) {
    console.error('Failed to fetch featured projects:', error)
    return [] // 返回空数组，避免页面崩溃
  }
}

// Use unstable_cache with revalidation tag and 60-second revalidation
export const fetchFeaturedProjectsForHome = unstable_cache(
  fetchFeaturedProjectsForHomeInternal,
  ['featured-projects'],
  {
    tags: ['projects'],
    revalidate: 60,
  },
)

