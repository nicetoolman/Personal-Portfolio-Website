import type { Metadata } from 'next'

import { LayoutViewport } from '@/components/LayoutViewport'
import { Media } from '@/components/Media'
import { ProcessPhaseCard } from '@/components/ProcessPhaseCard'
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

  type IntroImageKey =
    | 'titleImage'
    | 'textLine1'
    | 'placeholder1'
    | 'placeholder2'
    | 'placeholder3'
    | 'placeholder4'
    | 'textLine2'
    | 'scrollHint'

  const imageSlots: Array<{
    key: IntroImageKey
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

  type FlowCardKey = 'flow1' | 'flow2' | 'flow3' | 'flow4' | 'flow5' | 'flow6'

  type FlowCardContent = {
    image?: MediaType | number | string | null
    textImage?: MediaType | number | string | null
    bottomImage?: MediaType | number | string | null
  }

  const flowSlots: Array<{
    flowKey: FlowCardKey
    gridRow: string
    gridColumn: string
  }> = [
    { flowKey: 'flow1', gridRow: '3 / span 3', gridColumn: '2 / span 3' },
    { flowKey: 'flow2', gridRow: '3 / span 3', gridColumn: '6 / span 3' },
    { flowKey: 'flow3', gridRow: '3 / span 3', gridColumn: '10 / span 3' },
    { flowKey: 'flow4', gridRow: '6 / span 3', gridColumn: '2 / span 3' },
    { flowKey: 'flow5', gridRow: '6 / span 3', gridColumn: '6 / span 3' },
    { flowKey: 'flow6', gridRow: '6 / span 3', gridColumn: '10 / span 3' },
  ]

  const flowCards =
    ((introData as ProjectPageIntroType & {
      flowCards?: Partial<Record<FlowCardKey, FlowCardContent>>
    }).flowCards as Partial<Record<FlowCardKey, FlowCardContent>>) || {}

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
              rowGap: 'calc(100% * 6 / 890)',
              columnGap: 'calc(100% * 6 / 890)',
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

            {flowSlots.map((slot) => {
              const flowCard = flowCards[slot.flowKey]
              return (
                <div
                  key={slot.flowKey}
                  className="relative overflow-hidden"
                  style={{ gridRow: slot.gridRow, gridColumn: slot.gridColumn }}
                >
                  {flowCard ? (
                    <ProcessPhaseCard
                      image={flowCard.image ?? null}
                      textImage={flowCard.textImage ?? null}
                      bottomImage={flowCard.bottomImage ?? null}
                    />
                  ) : (
                    <div className="h-full w-full border border-dashed border-black/20 bg-[var(--background)]/40" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </LayoutViewport>
    </article>
  )
}


