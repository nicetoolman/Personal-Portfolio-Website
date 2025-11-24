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
    {
      name: 'resumeSection',
      type: 'group',
      label: 'Resume 装饰区',
      fields: [
        {
          name: 'title',
          type: 'upload',
          relationTo: 'media',
          label: 'Resume 标题图片',
          admin: {
            description: '位于 Resume 模块顶部的大标题图像，尺寸参考 Figma',
          },
        },
        {
          name: 'headline',
          type: 'upload',
          relationTo: 'media',
          label: 'Resume 子容器 1（纯图片）',
          admin: {
            description: '紧接标题的纯图片容器内容',
          },
        },
        {
          name: 'basicInfoLeft',
          type: 'upload',
          relationTo: 'media',
          label: 'Resume 基本信息（左列图片）',
          admin: {
            description: '第二个子容器中左侧图片内容',
          },
        },
        {
          name: 'basicInfoBackground',
          type: 'upload',
          relationTo: 'media',
          label: 'Resume 基本信息（背景图片）',
          admin: {
            description: '覆盖整个第二子容器的背景图',
          },
        },
        {
          name: 'basicInfoRightClosed',
          type: 'upload',
          relationTo: 'media',
          label: 'Resume 基本信息（右列-关闭状态）',
          admin: {
            description: '右列交互组件的关闭状态图片，默认 20% 不透明度，hover 时 50%',
          },
        },
        {
          name: 'basicInfoRightOpen',
          type: 'upload',
          relationTo: 'media',
          label: 'Resume 基本信息（右列-打开状态）',
          admin: {
            description: '右列交互组件的打开状态图片，点击后显示，100% 不透明度',
          },
        },
        {
          name: 'resumeIntro',
          type: 'upload',
          relationTo: 'media',
          label: 'Resume 简介图片',
          admin: {
            description: 'Resume 简介区域的图片内容',
          },
        },
        {
          name: 'resumeGridBackground',
          type: 'upload',
          relationTo: 'media',
          label: 'Resume Grid 容器（背景图片）',
          admin: {
            description: '第四个 Grid 容器的背景图片，覆盖整个容器',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateAboutPageDecorations],
  },
}

