import React from 'react'
import { cn } from '@/utilities/ui'

import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { CustomHomepageHero } from '@/heros/CustomHomepage'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  customHomepage: CustomHomepageHero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return (
    <div
      className={cn(
        // 移动端：添加 margin-top，让 Hero 下移到 Navbar 下方
        'mt-[var(--navbar-mobile-height)]',
        // 桌面端：不需要 margin-top（Hero 与 Navbar 重合）
        'md:mt-0'
      )}
    >
      <HeroToRender {...props} />
    </div>
  )
}
