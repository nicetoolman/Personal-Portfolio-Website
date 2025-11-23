import type { Metadata } from 'next'

import AboutContent from '@/components/AboutContent'

export default function AboutPage() {
  return (
    <article>
      <AboutContent />
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About | CATBOX',
    description: 'About MING ZU - A researcher turned visual creator based in Japan.',
  }
}

