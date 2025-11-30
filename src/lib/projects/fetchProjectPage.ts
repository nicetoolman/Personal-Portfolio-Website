import { draftMode } from 'next/headers'
import { cache } from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Project, Redirect } from '@/payload-types'

type FetchResult = {
  project: Project | null
  redirects: Redirect[] | null
}

/**
 * Server-side helper to fetch a single project by slug. The query is cached per request,
 * ensuring generateMetadata and the page component reuse the same result.
 */
async function fetchProjectPageInternal(slug: string): Promise<FetchResult> {
  try {
    if (!slug) {
      return { project: null, redirects: null }
    }

    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const projectResult = await payload.find({
      collection: 'projects',
      draft,
      limit: 1,
      overrideAccess: draft,
      pagination: false,
      depth: 2, // needed by intro and steps
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    const project = (projectResult.docs?.[0] as Project | undefined) ?? null

    if (project) {
      return { project, redirects: null }
    }

    // Large redirect queries with depth were causing SSR stalls
    const redirectsResult = await payload.find({
      collection: 'redirects',
      limit: 100, // lower load + faster SSR
      pagination: false,
      depth: 0, // prevent nested relations from causing RSC serialization stalls
      select: {
        // only fetch necessary fields
        from: true,
        to: true,
      },
    })

    return {
      project: null,
      redirects: redirectsResult.docs as Redirect[],
    }
  } catch (error) {
    console.error('Failed to fetch project page:', error)
    return { project: null, redirects: null }
  }
}

export const fetchProjectPage = cache(fetchProjectPageInternal)

