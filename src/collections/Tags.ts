import type { CollectionConfig } from 'payload'
import { formatSlugHook } from '@/fields/slug/formatSlug'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      hooks: {
        beforeValidate: [formatSlugHook('title')],
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
} 