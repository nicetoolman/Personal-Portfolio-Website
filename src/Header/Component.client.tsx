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
    <header className="fixed top-0 left-0 right-0 w-full z-30 bg-transparent">
      <div className="h-[131px] px-4 py-[22px] flex gap-[24px] items-center">
        {hasLogo && (
          <Link href="/" className="h-[87px] w-[88px] relative overflow-hidden shrink-0">
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
    </header>
  )
}
