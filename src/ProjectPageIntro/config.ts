import type { GlobalConfig } from 'payload'

import { revalidateProjectPageIntro } from './hooks/revalidateProjectPageIntro'

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
  ],
}

