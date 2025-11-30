import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import type { Project } from '@/payload-types'

type NavFooter = Project['navFooter']

interface ProjectNavFooterProps {
  navFooter?: NavFooter | null
}

/**
 * Project Navigation Footer Component
 * 
 * 结构：
 * - Closing Image: 100px 高度，2px 黑色边框
 * - Divider: 1px 高度，30% 不透明度黑色
 * - Navigation Footer: 三个部分，justify-between 布局
 *   - Previous project: 左侧箭头 + 文本
 *   - Back to the list: 中间文本（使用 CMSLink）
 *   - Next project: 文本 + 右侧箭头
 */
export function ProjectNavFooter({ navFooter }: ProjectNavFooterProps) {
  if (!navFooter) return null

  const { closingImage, previousProject, nextProject, backToList } = navFooter

  // 获取 project 的 slug
  const getProjectSlug = (project: Project | number | null | undefined): string | null => {
    if (!project) return null
    if (typeof project === 'number') return null
    return project.slug || null
  }

  const previousSlug = getProjectSlug(previousProject)
  const nextSlug = getProjectSlug(nextProject)

  return (
    <div className="flex w-full max-w-[var(--layout-content-width)] flex-col items-center gap-[10px] px-md">
      {/* Closing Image */}
      {closingImage && (
        <div className="relative h-[100px] w-full overflow-hidden border-2 border-black">
          <Media
            resource={closingImage}
            htmlElement="div"
            className="absolute inset-0"
            imgClassName="object-cover w-full h-full"
            fill
          />
        </div>
      )}

      {/* Divider */}
      <div className="h-px w-full bg-black/30" />

      {/* Navigation Footer */}
      <nav className="flex w-full items-center justify-between">
        {/* Previous Project */}
        {previousSlug ? (
          <Link href={`/projects/${previousSlug}`} className="flex h-[28px] items-center gap-sm">
            <ChevronLeft className="h-5 w-5 shrink-0" />
            <span className="font-['Roboto_Condensed'] text-heading-sm leading-[28px] text-black">
              Previous project
            </span>
          </Link>
        ) : (
          <div className="flex h-[28px] items-center gap-sm opacity-30 pointer-events-none cursor-default">
            <ChevronLeft className="h-5 w-5 shrink-0" />
            <span className="font-['Roboto_Condensed'] text-heading-sm leading-[28px] text-black">
              Previous project
            </span>
          </div>
        )}

        {/* Back to the list */}
        <CMSLink
          {...backToList}
          appearance="inline"
          className="font-['Roboto_Condensed'] text-heading-sm leading-[28px] text-black"
        />

        {/* Next Project */}
        {nextSlug ? (
          <Link href={`/projects/${nextSlug}`} className="flex h-[28px] items-center gap-sm">
            <span className="font-['Roboto_Condensed'] text-heading-sm leading-[28px] text-black">
              Next project
            </span>
            <ChevronLeft className="h-5 w-5 shrink-0 rotate-180" />
          </Link>
        ) : (
          <div className="flex h-[28px] items-center gap-sm opacity-30 pointer-events-none cursor-default">
            <span className="font-['Roboto_Condensed'] text-heading-sm leading-[28px] text-black">
              Next project
            </span>
            <ChevronLeft className="h-5 w-5 shrink-0 rotate-180" />
          </div>
        )}
      </nav>
    </div>
  )
}

