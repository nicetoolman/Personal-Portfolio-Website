import type { GlobalConfig } from 'payload'

import { revalidateProjectDetailPageIntro } from './hooks/revalidateProjectDetailPageIntro'

export const ProjectDetailPageIntro: GlobalConfig = {
  slug: 'projectDetailPageIntro',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateProjectDetailPageIntro],
  },
  fields: [
    {
      name: 'scrollHintImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Scroll Hint Image',
      admin: {
        description: 'Display this image below the project intro as the global scroll hint.',
      },
    },
  ],
}

