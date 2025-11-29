import { cache } from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Project } from '@/payload-types'

/**
 * Server-side helper to fetch featured projects for home page.
 * The query is cached per request.
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
      depth: 2, // 需要 depth=2 来获取 intro 中的嵌套数据
      limit: 3,
    })

    return docs as Project[]
  } catch (error) {
    console.error('Failed to fetch featured projects:', error)
    return [] // 返回空数组，避免页面崩溃
  }
}

export const fetchFeaturedProjectsForHome = cache(fetchFeaturedProjectsForHomeInternal)

