import { cache } from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Sketchlog } from '@/payload-types'

/**
 * Server-side helper to fetch featured sketchlogs for home page.
 * The query is cached per request.
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
      depth: 2, // 需要展开 media 和 project 关系
      limit: 3,
    })

    return docs as Sketchlog[]
  } catch (error) {
    console.error('Failed to fetch featured sketchlogs:', error)
    return [] // 返回空数组，避免页面崩溃
  }
}

export const fetchFeaturedSketchlogsForHome = cache(fetchFeaturedSketchlogsForHomeInternal)

