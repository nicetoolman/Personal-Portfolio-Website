import React from 'react'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { Media as MediaType, Project } from '@/payload-types'
import { cn } from '@/utilities/ui'

import { StepSidebar } from './StepSidebar'

type Step = NonNullable<Project['steps']>[number]
type StepImage = NonNullable<Step['images']>[number]

interface ProjectStepBlockProps {
  index: number
  step: Step
}

const BODY_GAP = '6px'

export function ProjectStepBlock({ step, index }: ProjectStepBlockProps) {
  if (!step) return null

  return (
    <article className="flex w-full justify-center">
      <div
        className="flex w-full max-w-[1440px] flex-col border-2 border-black bg-[hsl(var(--background))] px-2 py-1 md:px-[8px] md:py-[3px]"
        style={{ rowGap: BODY_GAP }}
      >
        {renderHeader(step, index)}
        {renderBody(step)}
        {step.variant === 'standard' && renderImageGallery(step.images)}
      </div>
    </article>
  )
}

function renderHeader(step: Step, index: number) {
  if (!step.title && !step.subtitle) return null

  return (
    <CenterColumn>
      <header className="flex w-full flex-col gap-[6px]" data-step-index={index}>
        {step.title && (
          <p className="font-['Roboto_Condensed'] text-[32px] font-bold leading-[38px] tracking-tight">{step.title}</p>
        )}
        {step.subtitle && (
          <p className="font-['Roboto_Condensed'] text-[24px] font-medium leading-[30px] tracking-tight">{step.subtitle}</p>
        )}
      </header>
    </CenterColumn>
  )
}

function renderBody(step: Step) {
  return (
    <div className="relative w-full">
      <CenterColumn>{renderVariantContent(step)}</CenterColumn>

      {step.enableSidebarLeft && (
        <div className="absolute left-[8px] top-0">
          <StepSidebar sidebar={step.sidebarLeft ?? undefined} />
        </div>
      )}

      {step.enableSidebarRight && (
        <div className="absolute right-[8px] top-0">
          <StepSidebar sidebar={step.sidebarRight ?? undefined} />
        </div>
      )}
    </div>
  )
}

function renderVariantContent(step: Step) {
  switch (step.variant) {
    case 'imageRight':
      return (
        <div className="grid w-full gap-[6px]" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          {renderTextStack(step)}
          {renderImagePanel(step.images?.[0])}
        </div>
      )

    case 'imageLeft':
      return (
        <div className="grid w-full gap-[6px]" style={{ gridTemplateColumns: 'minmax(0, 550px) minmax(0, 318px)' }}>
          {renderImagePanel(step.images?.[0])}
          {renderTextStack(step, { align: 'right' })}
        </div>
      )

    case 'standard':
    default:
      return (
        <div className="flex w-full flex-col gap-[9px]">
          {renderTextStack(step)}
        </div>
      )
  }
}

function renderTextStack(
  step: Step,
  options: {
    align?: 'left' | 'right'
  } = {},
) {
  const textBlocks: Array<{
    id: string
    value?: Step['text1'] | Step['text2'] | Step['text3'] | Step['text4']
    withDivider?: boolean
  }> = [
    { id: 'text1', value: step.text1, withDivider: Boolean(step.text1Divider) },
    { id: 'text2', value: step.text2 },
    { id: 'text3', value: step.text3 },
    { id: 'text4', value: step.text4 },
  ]

  return (
    <div
      className={cn('flex w-full flex-col gap-[9px]', options.align === 'right' ? 'items-end' : 'items-start')}
    >
      {textBlocks.map((block) => {
        if (!block.value) return null

        return (
          <div
            key={block.id}
            className={cn(
              'w-full text-[20px] leading-[28px]',
              block.withDivider && 'border-2 border-black px-2 py-1',
            )}
          >
            <RichText
              data={block.value}
              enableGutter={false}
              enableProse={false}
              className="font-['Roboto'] text-[20px] leading-[28px]"
            />
          </div>
        )
      })}
    </div>
  )
}

function renderImagePanel(image?: StepImage) {
  return (
    <div className="flex h-full min-h-[280px] w-full flex-col border-2 border-black">
      <div className="relative flex-1 overflow-hidden border-b border-black bg-white/60">
        {image ? (
          <Media
            resource={image.image}
            htmlElement="div"
            className="absolute inset-0"
            imgClassName="object-contain w-full h-full"
            fill
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-black/40">Image placeholder</div>
        )}
      </div>
      {getImageCaption(image?.image) && (
        <div className="px-2 py-1 text-center font-['Roboto'] text-[16px] font-black leading-tight">
          {getImageCaption(image?.image)}
        </div>
      )}
    </div>
  )
}

function renderImageGallery(images?: Step['images']) {
  if (!images || images.length === 0) return null

  const columns = Math.min(images.length, 3)

  return (
    <CenterColumn>
      <div className="grid w-full gap-[6px]" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {images.map((image, index) => (
          <div key={image.id ?? index} className="flex h-full min-h-[280px] flex-col border-2 border-black">
            <div className="relative flex-1 overflow-hidden border-b border-black bg-white/60">
              <Media
                resource={image.image}
                htmlElement="div"
                className="absolute inset-0"
                imgClassName="object-contain w-full h-full"
                fill
              />
            </div>
            {getImageCaption(image.image) && (
              <div className="px-2 py-1 text-center font-['Roboto'] text-[16px] font-black leading-tight">
                {getImageCaption(image.image)}
              </div>
            )}
          </div>
        ))}
      </div>
    </CenterColumn>
  )
}

function getImageCaption(resource?: number | MediaType | null) {
  if (resource && typeof resource === 'object' && 'caption' in resource) {
    return resource.caption || null
  }

  return null
}

function CenterColumn({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[890px] px-[8px]">{children}</div>
    </div>
  )
}

