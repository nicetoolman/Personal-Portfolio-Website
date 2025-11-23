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
    <nav className="flex items-center" style={{ gap: 'var(--navbar-gap)' }}>
      {navItems.map(({ link }, i) => {
        const isActive = isLinkActive(link as Parameters<typeof isLinkActive>[0], pathname)

        return (
          <div
            key={i}
            className="flex items-center justify-center relative"
            style={{
              height: 'auto',
              fontSize: 'var(--navbar-font-size)',
              width: 'auto',
              paddingTop: '8px',
              paddingBottom: '8px',
            }}
          >
            <div
              className="relative"
              style={{
                paddingLeft: '12px',
                paddingRight: '12px',
              }}
            >
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
