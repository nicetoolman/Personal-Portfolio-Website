import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Custom Homepage',
          value: 'customHomepage',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    // Custom Homepage Hero fields
    {
      name: 'mainVisualGroup',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'customHomepage',
      },
      fields: [
        {
          name: 'mainVisual',
          type: 'upload',
          relationTo: 'media',
          label: 'Main Visual',
          admin: {
            description: 'Main visual image (1024x1024, right-aligned)',
          },
        },
      ],
    },
    {
      name: 'titleGroup',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'customHomepage',
      },
      fields: [
        {
          name: 'titleImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Title Image',
          admin: {
            description: 'Title image (full size overlay)',
          },
        },
      ],
    },
    {
      name: 'scrollBarGroup',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'customHomepage',
      },
      fields: [
        {
          name: 'scrollBar',
          type: 'upload',
          relationTo: 'media',
          label: 'Scroll Bar',
          admin: {
            description: 'Scroll bar image (bottom aligned)',
          },
        },
      ],
    },
    {
      name: 'decorationGroup',
      type: 'group',
      admin: {
        condition: (_, { type } = {}) => type === 'customHomepage',
      },
      fields: [
        {
          name: 'decorationImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Decoration Image',
          admin: {
            description: 'Decoration image (full size overlay, top layer)',
          },
        },
      ],
    },
  ],
  label: false,
}
