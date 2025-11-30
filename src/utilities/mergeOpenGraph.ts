import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Sketches, stories, and visual experiments by Ming Zu',
  images: [
    {
      url: `${getServerSideURL()}/CATBOX-OG.webp`,
    },
  ],
  siteName: 'CATBOX',
  title: 'CATBOX',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
