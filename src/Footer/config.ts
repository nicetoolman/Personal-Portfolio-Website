import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    // Identity Section
    {
      name: 'identitySection',
      type: 'group',
      label: 'Identity Section',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          defaultValue: 'Identity',
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          defaultValue: 'Sketches, stories, and visual experiments by Ming Zu',
        },
      ],
    },
    // Explore Section
    {
      name: 'exploreSection',
      type: 'group',
      label: 'Explore Section',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          defaultValue: 'Explore',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            link({
              appearances: false,
            }),
          ],
          maxRows: 10,
        },
      ],
    },
    // Contact Section
    {
      name: 'contactSection',
      type: 'group',
      label: 'Contact Section',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          defaultValue: 'Contact',
        },
        {
          name: 'socialLinks',
          type: 'array',
          label: 'Social Media Links',
          fields: [
            {
              name: 'platform',
              type: 'select',
              label: 'Platform',
              options: [
                { label: 'Rednote', value: 'rednote' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'X (Twitter)', value: 'x' },
                { label: 'Custom', value: 'custom' },
              ],
              required: true,
            },
            {
              name: 'icon',
              type: 'upload',
              relationTo: 'media',
              label: 'Icon',
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              required: true,
            },
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              admin: {
                condition: (_, { platform }) => platform === 'custom',
              },
            },
          ],
          maxRows: 10,
        },
      ],
    },
    // Copyright
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright Text',
      defaultValue: '© 2025 Catbox Idea Factory. All rights reserved.',
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
