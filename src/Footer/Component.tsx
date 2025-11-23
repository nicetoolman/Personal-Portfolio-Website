import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { cn } from '@/utilities/ui'
import Link from 'next/link'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { ExploreLinks } from './ExploreLinks'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 2)()

  const identitySection = footerData?.identitySection
  const exploreSection = footerData?.exploreSection
  const contactSection = footerData?.contactSection
  const copyright = footerData?.copyright || '© 2025 Catbox Idea Factory. All rights reserved.'

  // 检查 icon 是否有效（参考 Header 的检查逻辑）
  const hasIdentityIcon = identitySection?.icon && 
    typeof identitySection.icon === 'object' && 
    identitySection.icon !== null && 
    'url' in identitySection.icon && 
    typeof identitySection.icon.url === 'string'

  return (
    <footer
      className={cn(
        'mt-auto',
        'bg-transparent',
        'border-t border-black/30',
        'flex flex-col',
        'items-center',
        'w-full'
      )}
      style={{
        paddingTop: 'var(--footer-padding-y)',
        paddingBottom: 'var(--footer-padding-y)',
        paddingLeft: 'var(--footer-padding-x)',
        paddingRight: 'var(--footer-padding-x)',
        gap: 'var(--footer-gap)',
      }}
    >
      {/* info区：三列布局 */}
      <div
        className="w-full flex flex-row items-start justify-center"
        style={{
          gap: 'var(--footer-column-gap)',
        }}
      >
        {/* 列 1：Identity */}
        <div
          className="flex-1 flex flex-col items-center"
          style={{
            gap: 'var(--footer-gap)',
          }}
        >
          {/* 标题 */}
          <div className="w-full">
            <h3
              className="font-normal font-sans text-accent text-center whitespace-nowrap"
              style={{
                fontSize: 'var(--footer-title-font-size)',
              }}
            >
              {identitySection?.title || 'Identity'}
            </h3>
          </div>
          
          {/* Icon 和 Description 左右布局 */}
          <div
            className="w-full flex flex-row items-center"
            style={{
              gap: 'var(--footer-gap)',
            }}
          >
            {/* Icon */}
            {hasIdentityIcon && (
              <div
                className="relative shrink-0"
                style={{
                  position: 'relative',
                  width: 'var(--footer-identity-icon-size)',
                  height: 'var(--footer-identity-icon-size)',
                  aspectRatio: '1/1',
                }}
              >
                <Media
                  resource={identitySection.icon}
                  htmlElement="div"
                  className="absolute inset-0"
                  imgClassName="object-contain w-full h-full pointer-events-none"
                  fill
                />
              </div>
            )}
            
            {/* 描述文字 */}
            <p
              className="flex-1 font-normal font-sans text-secondary text-left"
              style={{
                fontSize: 'var(--footer-content-font-size)',
                height: 'auto',
                lineHeight: '1.5',
              }}
            >
              {identitySection?.description || 'Sketches, stories, and visual experiments by Ming Zu'}
            </p>
          </div>
        </div>

        {/* 列 2：Explore */}
        <div
          className="flex-1 flex flex-col items-center"
          style={{
            gap: 'var(--footer-gap)',
          }}
        >
          {/* 标题 */}
          <div className="w-full">
            <h3
              className="font-normal font-sans text-accent text-center whitespace-nowrap"
              style={{
                fontSize: 'var(--footer-title-font-size)',
              }}
            >
              {exploreSection?.title || 'Explore'}
            </h3>
          </div>

          {/* 链接列表 */}
          <ExploreLinks links={exploreSection?.links} />
        </div>

        {/* 列 3：Contact */}
        <div
          className="flex-1 flex flex-col items-center"
          style={{
            gap: 'var(--footer-gap)',
          }}
        >
          {/* 标题 */}
          <div className="w-full">
            <h3
              className="font-normal font-sans text-accent text-center whitespace-nowrap"
              style={{
                fontSize: 'var(--footer-title-font-size)',
              }}
            >
              {contactSection?.title || 'Contact'}
            </h3>
          </div>
          
          {/* 社交媒体链接 */}
          <div
            className="w-full flex flex-col items-start justify-center"
            style={{
              gap: 'var(--footer-gap)',
            }}
          >
            {contactSection?.socialLinks?.map((social, i) => {
              const label = social.platform === 'custom' ? social.label : social.platform
              const icon = social.icon
              
              // 检查 icon 是否有效
              const hasIcon = icon && 
                typeof icon === 'object' && 
                icon !== null && 
                'url' in icon && 
                typeof icon.url === 'string'
              
              return (
                <Link
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center hover:opacity-70 transition-opacity"
                  style={{
                    gap: 'var(--footer-social-gap)',
                  }}
                >
                  {hasIcon && (
                    <div
                      className="relative shrink-0"
                      style={{
                        position: 'relative',
                        width: 'var(--footer-social-icon-size)',
                        height: 'var(--footer-social-icon-size)',
                      }}
                    >
                      <Media
                        resource={icon}
                        htmlElement="div"
                        className="absolute inset-0"
                        imgClassName="object-cover w-full h-full pointer-events-none"
                        fill
                      />
                    </div>
                  )}
                  <span
                    className="flex-1 font-normal font-sans text-secondary"
                    style={{
                      fontSize: 'var(--footer-content-font-size)',
                    }}
                  >
                    {label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* copyright区 */}
      <div
        className="w-full flex items-center justify-center"
        style={{
          gap: 'var(--footer-gap)',
        }}
      >
        <p
          className="font-normal font-sans text-secondary text-center whitespace-nowrap"
          style={{
            fontSize: 'var(--footer-content-font-size)',
          }}
        >
          {copyright}
        </p>
      </div>
    </footer>
  )
}
