import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default async function Page() {
  try {
    const payload = await getPayload({ config: configPromise })

    const posts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 12,
      overrideAccess: false,
      pagination: true,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
      },
    })

  return (
    <div className="pt-24 pb-16">
      <PageClient />
      <div className="container mb-16">
        <div className="prose max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return (
      <div className="pt-24 pb-16">
        <PageClient />
        <div className="container">
          <div className="prose max-w-none">
            <h1>Posts</h1>
            <p>Failed to load posts. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Posts`,
  }
}
