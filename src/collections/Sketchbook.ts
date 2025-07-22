import type { CollectionConfig } from 'payload'
import { formatSlugHook } from '@/fields/slug/formatSlug'
import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'

export const Sketchbook: CollectionConfig = {
  slug: 'sketchbook',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'cover', 'tags', 'publishedAt', 'images'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: false,
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      required: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: false,
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
    {
      name: 'externalLinks',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'url',
          type: 'text',
          required: false,
        },
      ],
    },
  ],
} 