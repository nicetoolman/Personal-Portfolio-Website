import type { GlobalConfig } from 'payload'

import { revalidateAboutPageDecorations } from './hooks/revalidateAboutPageDecorations'

export const AboutPageDecorations: GlobalConfig = {
  slug: 'aboutPageDecorations',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'introSection',
      type: 'group',
      label: 'Intro Section (网站简介内容区域)',
      fields: [
        {
          name: 'level3',
          type: 'upload',
          relationTo: 'media',
          label: '三级内容（CATBOX 标题区域）',
          admin: {
            description: 'CATBOX 标题区域的装饰图片',
          },
        },
        {
          name: 'level1',
          type: 'upload',
          relationTo: 'media',
          label: '一级内容（主要内容区域）',
          admin: {
            description: '主要内容区域的装饰图片',
          },
        },
        {
          name: 'level4',
          type: 'upload',
          relationTo: 'media',
          label: '四级内容（Created by 区域）',
          admin: {
            description: 'Created by 区域的装饰图片',
          },
        },
        {
          name: 'level2',
          type: 'upload',
          relationTo: 'media',
          label: '二级内容（左侧插画区域）',
          admin: {
            description: '左侧插画区域的装饰图片',
          },
        },
        {
          name: 'level5_1',
          type: 'upload',
          relationTo: 'media',
          label: '五级内容-1（Visual sandbox 标签）',
          admin: {
            description: 'Visual sandbox 标签的装饰图片',
          },
        },
        {
          name: 'level5_2',
          type: 'upload',
          relationTo: 'media',
          label: '五级内容-2（clarity through design 标签）',
          admin: {
            description: 'clarity through design 标签的装饰图片',
          },
        },
      ],
    },
    {
      name: 'decorationSection1',
      type: 'upload',
      relationTo: 'media',
      label: 'About 装饰区 1',
      admin: {
        description: '对应 Figma 中 890×168 的装饰条，将渲染在网站简介内容下方',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateAboutPageDecorations],
  },
}

