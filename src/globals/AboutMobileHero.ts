import type { GlobalConfig } from 'payload'

export const AboutMobileHero: GlobalConfig = {
  slug: 'aboutMobileHero',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'image',
      label: 'Mobile About Intro Image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: '移动端 About Intro 用的大图（导出的那一张）',
      },
    },
  ],
}

