import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  try {
    const { q: query } = await searchParamsPromise
    const payload = await getPayload({ config: configPromise })

    const posts = await payload.find({
      collection: 'search',
      depth: 1,
      limit: 12,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
      },
      pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="pt-24 pb-16">
      <PageClient />
      <div className="container mb-16">
        <div className="prose max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as CardPostData[]} />
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
  } catch (error) {
    console.error('Failed to fetch search results:', error)
    return (
      <div className="pt-24 pb-16">
        <PageClient />
        <div className="container mb-16">
          <div className="prose max-w-none text-center">
            <h1 className="mb-8 lg:mb-16">Search</h1>
            <div className="max-w-[50rem] mx-auto">
              <Search />
            </div>
          </div>
        </div>
        <div className="container">搜索时出错，请稍后重试</div>
      </div>
    )
  }
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Search`,
  }
}
