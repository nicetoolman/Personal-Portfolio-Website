'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center" style={{ gap: 'var(--navbar-gap)' }}>
      {navItems.map(({ link }, i) => {
        return (
          <div
            key={i}
            className="flex items-center justify-center"
            style={{
              height: 'var(--navbar-link-height)',
              fontSize: 'var(--navbar-font-size)',
              width: 'auto',
            }}
          >
            <CMSLink
              {...link}
              appearance="inline"
              className="whitespace-nowrap font-normal font-sans text-secondary"
              style={{
                paddingLeft: '12px',
                paddingRight: '12px',
              }}
            />
          </div>
        )
      })}
    </nav>
  )
}
