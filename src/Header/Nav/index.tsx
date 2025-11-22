'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  // 判断链接是否匹配当前路径
  const isLinkActive = (link: (typeof navItems)[0]['link']) => {
    // 主页不显示下划线
    if (pathname === '/') return false

    // 处理 custom 类型链接
    if (link.type === 'custom' && link.url) {
      // 规范化路径：移除末尾斜杠进行比较
      const normalizedPathname = pathname.endsWith('/') && pathname !== '/' 
        ? pathname.slice(0, -1) 
        : pathname
      const normalizedUrl = link.url.endsWith('/') && link.url !== '/' 
        ? link.url.slice(0, -1) 
        : link.url
      return normalizedPathname === normalizedUrl
    }

    // 处理 reference 类型链接
    if (link.type === 'reference' && link.reference?.value) {
      const ref = link.reference.value
      if (typeof ref === 'object' && ref !== null && 'slug' in ref) {
        const slug = ref.slug
        const relationTo = link.reference.relationTo
        const expectedPath = relationTo === 'pages' ? `/${slug}` : `/${relationTo}/${slug}`
        
        // 规范化路径比较
        const normalizedPathname = pathname.endsWith('/') && pathname !== '/' 
          ? pathname.slice(0, -1) 
          : pathname
        const normalizedExpectedPath = expectedPath.endsWith('/') && expectedPath !== '/' 
          ? expectedPath.slice(0, -1) 
          : expectedPath
        
        return normalizedPathname === normalizedExpectedPath
      }
    }

    return false
  }

  return (
    <nav className="flex items-center" style={{ gap: 'var(--navbar-gap)' }}>
      {navItems.map(({ link }, i) => {
        const isActive = isLinkActive(link)

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
                className="whitespace-nowrap font-normal font-sans text-secondary"
              />
              {/* 活跃链接下划线：与文本宽度一致，无左右空白 */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-10px',
                    left: '12px',
                    right: '12px',
                    height: '2px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  }}
                />
              )}
            </div>
          </div>
        )
      })}
    </nav>
  )
}
