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

const BODY_GAP = 'var(--spacing-paragraph)'

/**
 * Step block = Header + Body (variant layout + optional sidebars) + optional gallery.
 * 每个部分在这里拆成独立的渲染函数，方便日后复用 / 替换 token。
 */
export function ProjectStepBlock({ step, index }: ProjectStepBlockProps) {
  if (!step) return null

  return (
    <article
      className="relative flex w-full max-w-[var(--layout-canvas-wide)] flex-col bg-[hsl(var(--background))] px-md md:px-md"
      style={{ rowGap: BODY_GAP }}
    >
      {renderHeader(step, index)}
      {/* Content container: body + gallery + sidebars (sidebar定位参考点) */}
      <div className="relative flex w-full flex-col" style={{ rowGap: BODY_GAP }}>
        {renderBody(step)}
        {step.variant === 'standard' && renderImageGallery(step.images)}
        {renderSidebars(step)}
      </div>
    </article>
  )
}

// =====================
// Step Header (Title / Subtitle)
// =====================
function renderHeader(step: Step, index: number) {
  if (!step.title && !step.subtitle) return null

  return (
    <CenterColumn>
      <header className="flex w-full flex-col gap-sm" data-step-index={index}>
        {step.title && (
          <p className="font-['Roboto_Condensed'] text-heading-lg font-bold leading-[38px] tracking-tight">{step.title}</p>
        )}
        {step.subtitle && (
          <p className="font-['Roboto_Condensed'] text-heading-md font-medium leading-[30px] tracking-tight">
            {step.subtitle}
          </p>
        )}
      </header>
    </CenterColumn>
  )
}

// =====================
// Step Body (variant layout only, no sidebars)
// =====================
function renderBody(step: Step) {
  return <CenterColumn>{renderVariantContent(step)}</CenterColumn>
}

// =====================
// Sidebars (rendered after body and image gallery)
// =====================
function renderSidebars(step: Step) {
  if (!step.enableSidebarLeft && !step.enableSidebarRight) return null

  const sidebarBaseClass = 'md:absolute md:top-0 md:pointer-events-auto md:z-10 md:w-auto w-full'

  return (
    <div className="relative w-full md:absolute md:inset-0 md:pointer-events-none">
      {step.enableSidebarLeft && (
        <div className={cn(sidebarBaseClass, 'md:left-[8px]')}>
          <StepSidebar sidebar={step.sidebarLeft ?? undefined} />
        </div>
      )}

      {step.enableSidebarRight && (
        <div className={cn(sidebarBaseClass, 'md:right-[8px]')}>
          <StepSidebar sidebar={step.sidebarRight ?? undefined} />
        </div>
      )}
    </div>
  )
}

// =====================
// Variant specific content (text stack vs image/text split)
// =====================
function renderVariantContent(step: Step) {
  switch (step.variant) {
    case 'imageRight':
      return (
        <div className="flex md:grid w-full flex-col md:grid-cols-2 md:items-stretch gap-sm">
          {renderTextStack(step)}
          {renderImagePanel(step.images?.[0])}
        </div>
      )

    case 'imageLeft':
      return (
        <div className="flex md:grid w-full flex-col md:items-stretch gap-sm" style={{ gridTemplateColumns: 'minmax(0, 550px) minmax(0, 318px)' }}>
          {/* Mobile: text first, then image. Desktop: image first, then text */}
          <div className="order-2 md:order-1">
            {renderImagePanel(step.images?.[0])}
          </div>
          <div className="order-1 md:order-2">
            {renderTextStack(step, { align: 'right' })}
          </div>
        </div>
      )

    case 'standard':
    default:
      return (
        <div className="flex w-full flex-col gap-paragraph">
          {renderTextStack(step)}
        </div>
      )
  }
}

// =====================
// Content paragraphs stack with optional divider
// =====================
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
    <div className={cn('flex w-full flex-col gap-paragraph', options.align === 'right' ? 'items-end' : 'items-start')}>
      {textBlocks.map((block) => {
        if (!block.value) return null

        return (
          <div
            key={block.id}
            className={cn(
              'w-full text-body-lg leading-[28px]',
              block.withDivider && 'border-2 border-black px-md py-xs',
            )}
          >
            <RichText
              data={block.value}
              enableGutter={false}
              enableProse={false}
              className="font-['Roboto'] text-body-lg leading-[28px]"
            />
          </div>
        )
      })}
    </div>
  )
}

// =====================
// Single image panel (used in imageLeft / imageRight variants)
// =====================
function renderImagePanel(image?: StepImage) {
  const caption = getImageEntryCaption(image)

  return (
    <div className="flex h-full min-h-[var(--layout-image-min-height)] md:min-h-0 w-full flex-col">
      <div className="relative flex-1 w-full overflow-hidden min-h-[var(--layout-image-min-height)] md:min-h-0">
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
      {renderCaption(caption)}
    </div>
  )
}

// =====================
// Standard variant image gallery (1-3 images)
// =====================
function renderImageGallery(images?: Step['images']) {
  if (!images || images.length === 0) return null

  const columns = Math.min(images.length, 3)

  return (
    <CenterColumn>
      <div 
        className="flex md:grid w-full flex-col gap-sm" 
        style={{ 
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` 
        }}
      >
        {images.map((entry, index) => {
          const caption = getImageEntryCaption(entry)

          return (
            <div key={entry.id ?? index} className="flex h-full min-h-[var(--layout-image-min-height)] flex-col">
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: '16 / 9', minHeight: 'var(--layout-image-min-height)' }}
              >
                <Media
                  resource={entry.image}
                  htmlElement="div"
                  className="absolute inset-0"
                  imgClassName="object-contain w-full h-full"
                  fill
                />
              </div>
              {renderCaption(caption)}
            </div>
          )
        })}
      </div>
    </CenterColumn>
  )
}

function getImageEntryCaption(entry?: StepImage) {
  if (!entry) return null
  if (entry.caption) {
    return typeof entry.caption === 'string' ? entry.caption : null
  }
  return getMediaCaption(entry.image)
}

function getMediaCaption(resource?: number | MediaType | null) {
  if (resource && typeof resource === 'object' && 'caption' in resource) {
    const { caption } = resource
    if (!caption) return null
    return typeof caption === 'string' ? caption : null
  }

  return null
}

// =====================
// Shared caption block
// =====================
function renderCaption(text?: string | null) {
  return (
    <div className="hidden md:block min-h-[28px] px-md py-xs text-center font-['Roboto'] text-body font-black leading-tight">
      {text || '\u00A0'}
    </div>
  )
}

// =====================
// Helper: center content to the 890px body width
// =====================
function CenterColumn({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[var(--layout-content-width)] px-md">{children}</div>
    </div>
  )
}

