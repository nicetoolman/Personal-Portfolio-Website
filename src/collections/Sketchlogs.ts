import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { defaultLexical } from '../fields/defaultLexical'

export const Sketchlogs: CollectionConfig = {
  slug: 'sketchlogs',
  labels: {
    singular: 'Sketchlog Entry',
    plural: 'Sketchlog Entries',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedOn', 'images'],
    group: 'Content',
    description: '时间线 feed 内容，用于频繁更新的速写、草图、过程图记录。',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: false,
      admin: {
        placeholder: 'CATBOX-023 – 在便利店画的灯箱',
        description: '标题（可选），如果不填写，前端会显示 "Untitled Sketchlog"',
      },
    },
    {
      name: 'publishedOn',
      type: 'date',
      label: 'Published On',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: { pickerAppearance: 'dayOnly' },
        position: 'sidebar',
        description: '发布日期，用于时间线排序',
      },
    },
    {
      type: 'array',
      name: 'images',
      label: 'Sketch Images',
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      required: true,
      minRows: 1,
      admin: {
        description: '这一条 Sketchlog 相关的图片（至少 1 张，可以多张）。',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: '图片资源',
          },
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
          required: false,
          admin: {
            description: '图片说明（可选）',
            placeholder: '图片的说明文字',
          },
        },
      ],
    },
    {
      name: 'excerpt',
      type: 'richText',
      label: 'Text',
      required: false,
      editor: defaultLexical,
      admin: {
        description: '这一条的文字说明，feed 里会显示，可折叠展开。支持富文本格式。',
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: false,
      label: 'Related Project',
      admin: {
        position: 'sidebar',
        description: '如果这条是某个项目的过程记录，可以在这里关联。',
      },
    },
  ],
}

