import type { Field, GlobalConfig } from 'payload'

import { revalidateProjectPageIntro } from './hooks/revalidateProjectPageIntro'

const flowCardKeys = ['flow1', 'flow2', 'flow3', 'flow4', 'flow5', 'flow6'] as const

const flowCardFields: Field[] = flowCardKeys.map((flowKey, index) => ({
  name: flowKey,
  label: `Flow 卡片 ${index + 1}`,
  type: 'group',
  fields: [
    {
      name: 'image',
      label: '默认图',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Flow 上半区的默认图（hover 前）',
      },
    },
    {
      name: 'textImage',
      label: 'Hover 图',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Flow 上半区 hover 时切换的文本图',
      },
    },
    {
      name: 'bottomImage',
      label: '底部图',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Flow 卡片下半区的静态图片',
      },
    },
  ],
}))

export const ProjectPageIntro: GlobalConfig = {
  slug: 'projectPageIntro',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateProjectPageIntro],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'titleImage',
          type: 'upload',
          relationTo: 'media',
          label: '标题整行',
        },
        {
          name: 'textLine1',
          type: 'upload',
          relationTo: 'media',
          label: '第二行文本',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'placeholder1',
          type: 'upload',
          relationTo: 'media',
          label: '占位 1',
        },
        {
          name: 'placeholder2',
          type: 'upload',
          relationTo: 'media',
          label: '占位 2',
        },
        {
          name: 'placeholder3',
          type: 'upload',
          relationTo: 'media',
          label: '占位 3',
        },
        {
          name: 'placeholder4',
          type: 'upload',
          relationTo: 'media',
          label: '占位 4',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'textLine2',
          type: 'upload',
          relationTo: 'media',
          label: '第九行文本',
        },
        {
          name: 'scrollHint',
          type: 'upload',
          relationTo: 'media',
          label: '滚动提示',
        },
      ],
    },
    {
      name: 'flowCards',
      label: 'Flow 卡片',
      type: 'group',
      admin: {
        description: '六个流程卡片的 hover/静态图配置，用于项目列表首屏',
      },
      fields: flowCardFields,
    },
  ],
}

