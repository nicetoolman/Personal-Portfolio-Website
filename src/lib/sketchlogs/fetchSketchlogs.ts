import { cache } from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Sketchlog } from '@/payload-types'

/**
 * Server-side helper to fetch sketchlog entries. The query is cached per request,
 * ensuring generateMetadata and the page component reuse the same result.
 */
async function fetchSketchlogsInternal(): Promise<Sketchlog[]> {
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
      limit: 50,
    })
    return docs as Sketchlog[]
  } catch (error) {
    console.error('Failed to fetch sketchlogs:', error)
    return [] // 返回空数组，避免页面崩溃
  }
}

export const fetchSketchlogs = cache(fetchSketchlogsInternal)

