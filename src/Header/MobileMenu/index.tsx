'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

interface MobileMenuProps {
  data: HeaderType
  onClose: () => void
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ data, onClose }) => {
  const navItems = data?.navItems || []

  // 构建菜单项：Home + 其他链接
  const menuItems = [
    {
      link: {
        type: 'custom' as const,
        url: '/',
        label: 'Home',
      },
    },
    ...navItems,
  ]

  return (
    <div
      className="fixed top-[var(--navbar-mobile-height)] left-0 right-0 bottom-0 bg-background z-40 overflow-y-auto"
      style={{
        animation: 'slideDownMobile 0.3s ease-out',
      }}
      onClick={(e) => {
        // 点击菜单背景关闭（但不关闭链接点击）
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="w-full">
        {menuItems.map(({ link }, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div className="h-6 flex items-center justify-center">
                <div className="w-[calc(100%-32px)] h-px bg-black/30 mx-4" />
              </div>
            )}
            <div
              className="hover:bg-muted/50 active:bg-muted/70 transition-colors px-[var(--navbar-mobile-link-padding)] py-[var(--navbar-mobile-link-padding)] text-[var(--navbar-mobile-font-size)]"
              onClick={onClose}
            >
              <CMSLink
                {...link}
                appearance="inline"
                className="whitespace-nowrap font-normal font-sans text-secondary w-full block"
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

