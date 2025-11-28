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
 * ProjectStepBlock - 响应式 Step Block 组件
 * 
 * 两种布局模式：
 * 
 * 1. 移动端单列模式（< md）：
 *    - 外层容器使用 flex flex-col gap-paragraph
 *    - Sidebar 和正文上下堆叠：Sidebar 在上（order-1），正文在下（order-2）
 *    - Sidebar 使用 w-full，不使用绝对定位
 *    - 正文使用 w-full，不需要右侧 padding
 * 
 * 2. 桌面端画布+Sidebar 模式（≥ md）：
 *    - 保持现有布局：Sidebar 在右侧绝对定位，宽度基于 var(--layout-sidebar-width)
 *    - 正文通过 md:pr-[calc(var(--layout-sidebar-width)+var(--spacing-lg))] 留出空间，避免被 Sidebar 遮挡
 */
export function ProjectStepBlock({ step, index }: ProjectStepBlockProps) {
  if (!step) return null

  return (
    <article
      className="flex w-full max-w-[var(--layout-canvas-wide)] flex-col bg-[hsl(var(--background))] px-md md:px-md"
      style={{ rowGap: BODY_GAP }}
    >
      {renderHeader(step, index)}
      {renderBody(step)}
      {step.variant === 'standard' && renderImageGallery(step.images)}
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
// Step Body (variant layout + optional sidebars)
// =====================
function renderBody(step: Step) {
  const hasSidebar = step.enableSidebarLeft || step.enableSidebarRight

  return (
    <div className="relative w-full flex flex-col gap-paragraph md:block">
      {/* 正文区域：移动端最先显示，符合阅读逻辑 */}
      <div
        className={cn(
          'order-1 w-full md:order-none',
          // 桌面端：如果有右侧 Sidebar，留出空间避免被遮挡
          step.enableSidebarRight && 'md:pr-[calc(var(--layout-sidebar-width)+var(--spacing-lg))]',
          // 桌面端：如果有左侧 Sidebar，留出空间避免被遮挡
          step.enableSidebarLeft && 'md:pl-[calc(var(--layout-sidebar-width)+var(--spacing-lg))]',
        )}
      >
        <CenterColumn>{renderVariantContent(step)}</CenterColumn>
      </div>

      {/* 移动端：Sidebar 在正文之后显示 */}
      {step.enableSidebarLeft && (
        <div className="order-2 w-full md:absolute md:left-[8px] md:top-0 md:w-auto md:order-none">
          <StepSidebar sidebar={step.sidebarLeft ?? undefined} />
        </div>
      )}

      {step.enableSidebarRight && (
        <div className="order-3 w-full md:absolute md:right-[8px] md:top-0 md:w-auto md:order-none">
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
        <div className="grid w-full gap-sm" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          {renderTextStack(step)}
          {renderImagePanel(step.images?.[0])}
        </div>
      )

    case 'imageLeft':
      return (
        <div className="grid w-full gap-sm" style={{ gridTemplateColumns: 'minmax(0, 550px) minmax(0, 318px)' }}>
          {renderImagePanel(step.images?.[0])}
          {renderTextStack(step, { align: 'right' })}
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
    <div className="flex h-full min-h-[var(--layout-image-min-height)] w-full flex-col">
      <div className="relative flex-1 overflow-hidden">
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
      <div className="grid w-full gap-sm" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {images.map((entry, index) => {
          const caption = getImageEntryCaption(entry)

          return (
            <div key={entry.id ?? index} className="flex h-full min-h-[var(--layout-image-min-height)] flex-col">
              <div className="relative flex-1 overflow-hidden">
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
    <div className="min-h-[28px] px-md py-xs text-center font-['Roboto'] text-body font-black leading-tight">
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
      {/* 移动端：不需要左右 padding，桌面端保持 px-md */}
      <div className="w-full max-w-[var(--layout-content-width)] md:px-md">{children}</div>
    </div>
  )
}

