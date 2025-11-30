import { unstable_cache } from 'next/cache'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Sketchlog } from '@/payload-types'

/**
 * Server-side helper to fetch featured sketchlogs for home page.
 * Uses Next.js unstable_cache with revalidation tag for proper cache invalidation.
 */
async function fetchFeaturedSketchlogsForHomeInternal(): Promise<Sketchlog[]> {
  try {
    const payload = await getPayload({ config: configPromise })

    const { docs } = await payload.find({
      collection: 'sketchlogs',
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

    return (docs as Sketchlog[]) || []
  } catch (error) {
    console.error('Failed to fetch featured sketchlogs:', error)
    return [] // 返回空数组，避免页面崩溃
  }
}

// Use unstable_cache with revalidation tag and 60-second revalidation
export const fetchFeaturedSketchlogsForHome = unstable_cache(
  fetchFeaturedSketchlogsForHomeInternal,
  ['featured-sketchlogs'],
  {
    tags: ['sketchlogs'],
    revalidate: 60,
  },
)

