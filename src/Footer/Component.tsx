import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { cn } from '@/utilities/ui'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer
      className={cn(
        'mt-auto',
        // 透明背景
        'bg-transparent',
        // 上边框：30% 不透明度的黑色分割线
        'border-t border-black/30',
        // 减小高度：减少 padding（从 py-8 改为 py-4）
        'py-4',
        // 使用更淡的文字颜色
        'text-secondary'
      )}
    >
      <div className="container gap-4 flex flex-col md:flex-row md:justify-between md:items-center">
        {/* 导航链接 */}
        {navItems.length > 0 && (
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  className="text-secondary hover:text-foreground transition-colors"
                  key={i}
                  {...link}
                />
              )
            })}
          </nav>
        )}
      </div>
    </footer>
  )
}
