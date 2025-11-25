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
        <div className="w-full h-auto flex flex-col items-center">
          <div
            className="grid overflow-hidden relative shrink-0 w-full"
            style={{
              width: '100%',
              aspectRatio: '890/633',
              padding: 'calc(100% * 3 / 890) calc(100% * 8 / 890)',
              rowGap: '6px',
              columnGap: '6px',
              gridTemplateRows: 'repeat(10, minmax(0, 1fr))',
              gridTemplateColumns: 'repeat(13, minmax(0, 1fr))',
            }}
          >
            {/* TODO: Project Intro Grid content */}
          </div>
        </div>
      </LayoutViewport>
    </article>
  )
}


