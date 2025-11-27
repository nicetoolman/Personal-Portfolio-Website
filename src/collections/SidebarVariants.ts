import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'

export const SidebarVariants: CollectionConfig = {
  slug: 'sidebarVariants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  upload: false,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Icon Illustration',
    },
    {
      name: 'accentColor',
      type: 'text',
      admin: {
        description: 'Optional CSS color for future styling.',
      },
    },
    ...slugField(),
  ],
}

