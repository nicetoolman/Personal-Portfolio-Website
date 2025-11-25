import type { Metadata } from 'next'

import { LayoutViewport } from '@/components/LayoutViewport'
import { Media } from '@/components/Media'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Media as MediaType, ProjectPageIntro as ProjectPageIntroType } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Projects | CATBOX',
  description: 'Projects list is under construction.',
}

export default async function ProjectsPage() {
  const introData: ProjectPageIntroType = await getCachedGlobal('projectPageIntro', 1)()

  const renderImage = (resource: MediaType | number | string | null | undefined) => {
    if (!resource) return null
    return (
      <Media
        resource={resource}
        htmlElement="div"
        className="absolute inset-0"
        imgClassName="object-contain w-full h-full"
        fill
      />
    )
  }

  const imageSlots: Array<{
    key: keyof ProjectPageIntroType
    gridRow: string
    gridColumn: string
  }> = [
    { key: 'titleImage', gridRow: '1 / span 1', gridColumn: '1 / span 13' },
    { key: 'textLine1', gridRow: '2 / span 1', gridColumn: '1 / span 13' },
    { key: 'placeholder1', gridRow: '3 / span 6', gridColumn: '1 / span 1' },
    { key: 'placeholder2', gridRow: '3 / span 6', gridColumn: '5 / span 1' },
    { key: 'placeholder3', gridRow: '3 / span 6', gridColumn: '9 / span 1' },
    { key: 'placeholder4', gridRow: '3 / span 6', gridColumn: '13 / span 1' },
    { key: 'textLine2', gridRow: '9 / span 1', gridColumn: '1 / span 13' },
    { key: 'scrollHint', gridRow: '10 / span 1', gridColumn: '1 / span 13' },
  ]

  const flowSlots = [
    { gridRow: '3 / span 3', gridColumn: '2 / span 3' },
    { gridRow: '3 / span 3', gridColumn: '6 / span 3' },
    { gridRow: '3 / span 3', gridColumn: '10 / span 3' },
    { gridRow: '6 / span 3', gridColumn: '2 / span 3' },
    { gridRow: '6 / span 3', gridColumn: '6 / span 3' },
    { gridRow: '6 / span 3', gridColumn: '10 / span 3' },
  ]

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
            {imageSlots.map((slot) => (
              <div
                key={slot.key as string}
                className="relative overflow-hidden"
                style={{ gridRow: slot.gridRow, gridColumn: slot.gridColumn }}
              >
                {renderImage(introData?.[slot.key])}
              </div>
            ))}

            {flowSlots.map((slot, index) => (
              <div
                key={`flow-slot-${index}`}
                className="relative border border-black/30 bg-[var(--background)]/60"
                style={{ gridRow: slot.gridRow, gridColumn: slot.gridColumn }}
              />
            ))}
          </div>
        </div>
      </LayoutViewport>
    </article>
  )
}


