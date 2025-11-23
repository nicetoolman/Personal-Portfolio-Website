import type { Metadata } from 'next'

export default function AboutPage() {
  return (
    <article className="pb-16">
      {/* About 页面内容将从这里开始 */}
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About | CATBOX',
    description: 'About MING ZU - A researcher turned visual creator based in Japan.',
  }
}

