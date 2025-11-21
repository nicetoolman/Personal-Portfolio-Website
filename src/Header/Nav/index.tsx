'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-[10px] items-center h-[87px]">
      {navItems.map(({ link }, i) => {
        return (
          <div
            key={i}
            className="flex gap-[10px] h-[87px] items-center justify-center overflow-clip rounded-[10px]"
          >
            <CMSLink
              {...link}
              appearance="inline"
              className="px-3 whitespace-nowrap text-[32px] font-normal font-sans text-secondary leading-[0]"
            />
          </div>
        )
      })}
    </nav>
  )
}
