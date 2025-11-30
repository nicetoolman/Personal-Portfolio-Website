import { cache } from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { AboutPageDecoration } from '@/payload-types'

/**
 * Server-side helper to fetch About page decorations for home page.
 * The query is cached per request.
 */
async function fetchAboutPageForHomeInternal(): Promise<AboutPageDecoration | null> {
  try {
    const payload = await getPayload({ config: configPromise })

    const global = await payload.findGlobal({
      slug: 'aboutPageDecorations',
      depth: 1,
    })

    return (global as AboutPageDecoration) || null
  } catch (error) {
    console.error('Failed to fetch About page decorations:', error)
    return null // 返回 null，避免页面崩溃
  }
}

export const fetchAboutPageForHome = cache(fetchAboutPageForHomeInternal)

