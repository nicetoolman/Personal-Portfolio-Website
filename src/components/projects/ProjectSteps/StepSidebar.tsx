import React from 'react'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { Media as MediaType, Project } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Sidebar = NonNullable<Project['steps']>[number]['sidebarLeft']
type SidebarImage = NonNullable<Sidebar>['images']

interface StepSidebarProps {
  sidebar?: Sidebar | null
}

/**
 * Sidebar 样式骨架：
 * - 固定宽 253px，padding 4px，内部 gap 6px
 * - Icon 区（占位），RichText，图片带（245×120）
 */
export function StepSidebar({ sidebar }: StepSidebarProps) {
  if (!sidebar) {
    return <SidebarPlaceholder />
  }

  const hasContent = sidebar.content || (sidebar.images && sidebar.images.length > 0)

  return (
    <aside className="flex w-full justify-center">
      <div className="flex w-full max-w-[253px] flex-col gap-[6px] rounded-[10px] border-2 border-black p-[4px]">
        {renderIconSlot(sidebar.variant)}

        {sidebar.content && (
          <div className="text-[16px] leading-[28px]">
            <RichText data={sidebar.content} enableProse={false} enableGutter={false} />
          </div>
        )}

        {renderImagesStrip(sidebar.images)}

        {!hasContent && <SidebarPlaceholder label="空 sidebar" muted />}
      </div>
    </aside>
  )
}

function renderIconSlot(variant?: string | null) {
  return (
    <div className="relative h-[78px] w-full rounded-[10px] border border-dashed border-black/40 bg-white/40">
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold uppercase tracking-[0.08em] text-black/40">
        {variant ? `icon: ${variant}` : 'icon placeholder'}
      </div>
    </div>
  )
}

function renderImagesStrip(images?: SidebarImage | null) {
  if (!images || images.length === 0) return null

  const validImages = images.filter((item) => Boolean(item?.image))
  if (validImages.length === 0) return null

  const columns = validImages.length

  return (
    <div
      className="flex h-[120px] w-full gap-[6px]"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {validImages.map((item, index) => (
        <div key={item?.id ?? index} className="relative flex-1 border-2 border-black">
          <Media
            resource={item!.image}
            htmlElement="div"
            className="absolute inset-0"
            imgClassName="object-contain w-full h-full"
            fill
          />
        </div>
      ))}
    </div>
  )
}

function SidebarPlaceholder({ label = 'Sidebar placeholder', muted = false }: { label?: string; muted?: boolean }) {
  return (
    <div
      className={cn(
        'flex w-full max-w-[253px] items-center justify-center rounded-[10px] border-2 border-dashed border-black/30 px-4 py-6 text-center text-xs font-semibold uppercase tracking-[0.1em]',
        muted ? 'text-black/30' : 'text-black/50',
      )}
    >
      {label}
    </div>
  )
}

