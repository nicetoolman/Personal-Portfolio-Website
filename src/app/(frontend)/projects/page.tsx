import type { Metadata } from 'next'

import { LayoutViewport } from '@/components/LayoutViewport'

export const metadata: Metadata = {
  title: 'Projects | CATBOX',
  description: 'Projects list is under construction.',
}

export default function ProjectsPage() {
  return (
    <article>
      <LayoutViewport variant="narrow" scrollable={false}>
        <div className="w-full h-full flex items-center justify-center bg-[var(--background)] text-secondary">
          <p className="text-center text-lg">Project 列表页建设中</p>
        </div>
      </LayoutViewport>
    </article>
  )
}


