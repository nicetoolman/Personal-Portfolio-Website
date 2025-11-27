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
    depth: 2,
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

  const redirectsResult = await payload.find({
    collection: 'redirects',
    limit: 300,
    pagination: false,
    depth: 1,
  })

  return {
    project: null,
    redirects: redirectsResult.docs as Redirect[],
  }
}

export const fetchProjectPage = cache(fetchProjectPageInternal)

