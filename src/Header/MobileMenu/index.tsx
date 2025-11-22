'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

interface MobileMenuProps {
  data: HeaderType
  onClose: () => void
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ data, onClose }) => {
  const pathname = usePathname()
  const navItems = data?.navItems || []

  // 检查链接是否激活
  const isLinkActive = (link: { type?: string | null; url?: string | null; reference?: any }) => {
    if (!link) return false
    if (link.type === 'custom' && link.url) {
      const normalizedUrl = link.url.replace(/\/$/, '') || '/'
      const normalizedPathname = pathname.replace(/\/$/, '') || '/'
      return normalizedUrl === normalizedPathname
    }
    if (link.type === 'reference' && link.reference) {
      const ref = link.reference
      if (typeof ref === 'object' && ref !== null && 'slug' in ref) {
        const refSlug = (ref as { slug?: string }).slug
        const normalizedRefSlug = refSlug ? `/${refSlug}`.replace(/\/$/, '') || '/' : '/'
        const normalizedPathname = pathname.replace(/\/$/, '') || '/'
        return normalizedRefSlug === normalizedPathname
      }
    }
    return false
  }

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
        {menuItems.map(({ link }, i) => {
          const isActive = isLinkActive(link) && pathname !== '/'
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <div
                  style={{
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 'calc(100% - 32px)',
                      height: '1px',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      marginLeft: '16px',
                      marginRight: '16px',
                    }}
                  />
                </div>
              )}
              <div
                className="hover:bg-muted/50 active:bg-muted/70 transition-colors relative"
                style={{
                  paddingLeft: 'var(--navbar-mobile-link-padding)',
                  paddingRight: 'var(--navbar-mobile-link-padding)',
                  paddingTop: 'var(--navbar-mobile-link-padding)',
                  paddingBottom: 'var(--navbar-mobile-link-padding)',
                  fontSize: 'var(--navbar-mobile-font-size)',
                }}
                onClick={onClose}
              >
                <CMSLink
                  {...link}
                  appearance="inline"
                  className="whitespace-nowrap font-normal font-sans text-secondary w-full block"
                />
                {/* 激活状态的下划线 */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: 'var(--navbar-mobile-link-padding)',
                      right: 'var(--navbar-mobile-link-padding)',
                      height: '2px',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    }}
                  />
                )}
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

