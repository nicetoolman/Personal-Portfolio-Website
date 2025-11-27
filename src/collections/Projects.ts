import type { CollectionConfig, Field } from 'payload'

import { link } from '@/fields/link'
import { slugField } from '@/fields/slug'

const showcaseImageField: Field = {
  name: 'showcaseImages',
  type: 'array',
  minRows: 1,
  maxRows: 4,
  label: 'Showcase Images',
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
  ],
}

const metaFields: Field = {
  name: 'meta',
  type: 'group',
  label: 'Meta',
  fields: [
    { name: 'year', type: 'text', label: 'Year' },
    {
      name: 'roles',
      type: 'array',
      label: 'Roles (max 3)',
      maxRows: 3,
      fields: [{ name: 'role', type: 'text', required: true }],
    },
    {
      name: 'keywords',
      type: 'array',
      label: 'Keywords',
      fields: [{ name: 'keyword', type: 'text', required: true }],
    },
    {
      name: 'links',
      type: 'array',
      label: 'Links',
      fields: [
        link({
          appearances: false,
          overrides: {
            name: 'link',
            label: 'Link',
          },
        }),
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags (for project cards)',
      fields: [
        {
          name: 'tag',
          type: 'relationship',
          relationTo: 'tags',
          required: true,
        },
      ],
    },
  ],
}

const introFields: Field[] = [
  {
    name: 'titleGroup',
    type: 'group',
    label: 'Title Group',
    fields: [
      {
        name: 'title',
        type: 'richText',
        required: true,
      },
      {
        name: 'subtitle',
        type: 'richText',
      },
    ],
  },
  {
    name: 'heroImage',
    type: 'upload',
    relationTo: 'media',
    label: 'Hero Viewport Image (890×633)',
  },
  {
    name: 'content',
    type: 'group',
    label: 'Intro Content Blocks',
    fields: [
      { name: 'overview', type: 'richText', required: true },
      { name: 'goal', type: 'richText' },
      { name: 'process', type: 'richText' },
      { name: 'outcome', type: 'richText' },
    ],
  },
  showcaseImageField,
  metaFields,
]

const sidebarFields = (name: string, toggleName: string): Field[] => [
  {
    name: toggleName,
    type: 'checkbox',
    label: `Enable ${name === 'sidebarLeft' ? 'Left' : 'Right'} Sidebar`,
  },
  {
    name,
    type: 'group',
    label: `${name === 'sidebarLeft' ? 'Left' : 'Right'} Sidebar`,
    admin: {
      condition: (_, siblingData) => Boolean(siblingData?.[toggleName]),
    },
    fields: [
      {
        name: 'variant',
        type: 'relationship',
        label: 'Variant',
        relationTo: 'sidebarVariants',
        required: true,
      },
      {
        name: 'content',
        type: 'richText',
        label: 'Sidebar Content',
        required: true,
      },
      {
        name: 'images',
        type: 'array',
        maxRows: 2,
        label: 'Sidebar Images',
        fields: [
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
          },
        ],
      },
    ],
  },
]

const stepsField: Field = {
  name: 'steps',
  type: 'array',
  label: 'Step Blocks',
  minRows: 1,
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Image Right', value: 'imageRight' },
        { label: 'Image Left', value: 'imageLeft' },
      ],
    },
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'text' },
    {
      name: 'text1',
      type: 'richText',
      required: true,
      label: 'Text 1',
    },
    {
      name: 'text1Divider',
      type: 'checkbox',
      label: 'Add Divider around Text 1',
    },
    { name: 'text2', type: 'richText' },
    { name: 'text3', type: 'richText' },
    { name: 'text4', type: 'richText' },
    {
      name: 'images',
      type: 'array',
      maxRows: 3,
      label: 'Step Images (0-3)',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Image Caption',
          admin: {
            description: 'Appears below the image in the step body.',
          },
        },
      ],
    },
    ...sidebarFields('sidebarLeft', 'enableSidebarLeft'),
    ...sidebarFields('sidebarRight', 'enableSidebarRight'),
  ],
}

const navFooterField: Field = {
  name: 'navFooter',
  type: 'group',
  label: 'Navigation Footer',
  fields: [
    {
      name: 'closingImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Closing Image',
    },
    {
      name: 'previousProject',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Previous Project',
    },
    {
      name: 'nextProject',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Next Project',
    },
    link({
      overrides: {
        name: 'backToList',
        label: 'Back To List Link',
      },
    }),
  ],
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'createdAt', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'intro',
      type: 'group',
      label: 'Intro',
      fields: introFields,
    },
    stepsField,
    navFooterField,
    ...slugField(),
  ],
}

