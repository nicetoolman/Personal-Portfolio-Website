'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { isLinkActive } from '@/utilities/isLinkActive'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-[var(--navbar-gap)]">
      {navItems.map(({ link }, i) => {
        const isActive = isLinkActive(link as Parameters<typeof isLinkActive>[0], pathname)

        return (
          <div
            key={i}
            className="flex items-center justify-center relative h-auto w-auto py-2 text-[var(--navbar-font-size)]"
          >
            <div className="relative px-3">
              <CMSLink
                {...link}
                appearance="inline"
                className={`whitespace-nowrap font-normal font-sans ${
                  isActive ? 'text-foreground' : 'text-secondary'
                }`}
              />
            </div>
          </div>
        )
      })}
    </nav>
  )
}
