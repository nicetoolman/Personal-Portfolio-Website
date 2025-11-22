'use client'
import Link from 'next/link'
import React from 'react'

import type { Header } from '@/payload-types'

import { Media } from '@/components/Media'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const logo = data?.logo
  const hasLogo = logo && typeof logo === 'object' && logo !== null && 'url' in logo && typeof logo.url === 'string'

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-transparent">
      <div
        className="flex items-center"
        style={{
          height: 'var(--navbar-height)',
          paddingLeft: 'var(--navbar-side-padding)',
          paddingRight: 'var(--navbar-side-padding)',
        }}
      >
        {/* Icon 和链接容器：限制宽度 */}
        <div
          className="flex items-center"
          style={{
            width: 'var(--navbar-content-width)',
            gap: 'var(--navbar-gap)',
          }}
        >
          {/* Icon */}
          {hasLogo && (
            <Link
              href="/"
              className="relative overflow-hidden shrink-0"
              style={{
                height: 'var(--navbar-icon-height)',
                aspectRatio: 'var(--navbar-icon-aspect-ratio)',
              }}
            >
              <Media
                resource={logo}
                htmlElement="div"
                className="absolute inset-0 opacity-60"
                imgClassName="object-cover"
                fill
              />
            </Link>
          )}
          <HeaderNav data={data} />
        </div>
      </div>
    </header>
  )
}
