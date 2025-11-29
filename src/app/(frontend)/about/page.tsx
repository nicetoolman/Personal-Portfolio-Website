import type { Metadata } from 'next'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { LayoutViewport } from '@/components/LayoutViewport'
import { AboutMain } from '@/components/about/AboutMain'
import type { AboutPageDecoration as AboutPageDecorationType } from '@/payload-types'

export default async function AboutPage() {
  const decorationsData: AboutPageDecorationType = await getCachedGlobal(
    'aboutPageDecorations',
    1,
  )()

  return (
    <article>
      <LayoutViewport variant="narrow">
        <AboutMain decorationsData={decorationsData} />
      </LayoutViewport>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About | CATBOX',
    description: 'About MING ZU - A researcher turned visual creator based in Japan.',
  }
}
