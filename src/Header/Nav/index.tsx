'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

import type { Header as HeaderType, Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { isLinkActive } from '@/utilities/isLinkActive'

const ensureProjectsLink = (items: NonNullable<HeaderType['navItems']>) => {
  const hasProjects = items.some(({ link }) => {
    if (!link) return false
    if (link.type === 'custom') {
      return link.url === '/projects' || link.url === 'projects'
    }
    if (link.type === 'reference' && link.reference?.relationTo === 'pages') {
      const value = link.reference.value
      if (typeof value === 'object' && value !== null && 'slug' in value) {
        return (value as Page).slug === 'projects'
      }
      if (typeof value === 'string') {
        return value === 'projects'
      }
    }
    return false
  })

  if (hasProjects) return items

  return [
    ...items,
    {
      link: {
        type: 'custom' as const,
        url: '/projects',
        label: 'Project',
      },
    },
  ]
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const rawItems = data?.navItems || []
  const navItems = ensureProjectsLink(rawItems)
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
