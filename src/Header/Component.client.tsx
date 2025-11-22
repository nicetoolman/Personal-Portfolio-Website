'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

import type { Header } from '@/payload-types'

import { Media } from '@/components/Media'
import { HeaderNav } from './Nav'
import { MobileMenu } from './MobileMenu/index'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const logo = data?.logo
  const hasLogo = logo && typeof logo === 'object' && logo !== null && 'url' in logo && typeof logo.url === 'string'
  const [isMenuOpen, setMenuOpen] = useState(false)

  // 菜单打开时阻止背景滚动
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-transparent">
      {/* 桌面端布局 */}
      <div
        className="hidden md:flex items-center"
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

      {/* 移动端布局 */}
      <div
        className="flex md:hidden items-center justify-between w-full relative"
        style={{
          height: 'var(--navbar-mobile-height)',
          paddingLeft: 'var(--navbar-side-padding)',
          paddingRight: 'var(--navbar-side-padding)',
        }}
      >
        {/* 左侧：汉堡按钮 */}
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="flex items-center justify-center shrink-0"
          style={{
            width: 'var(--navbar-mobile-hamburger-width)',
            height: 'var(--navbar-mobile-hamburger-width)',
          }}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X size={24} className="text-foreground" />
          ) : (
            <Menu size={24} className="text-foreground" />
          )}
        </button>

        {/* 中间：Icon（居中） */}
        {hasLogo && (
          <Link
            href="/"
            className="relative overflow-hidden shrink-0"
            style={{
              height: 'var(--navbar-icon-height)',
              aspectRatio: 'var(--navbar-icon-aspect-ratio)',
            }}
            onClick={() => setMenuOpen(false)}
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

        {/* 右侧：预留空间（不可见，保持对称） */}
        <div
          style={{
            width: 'var(--navbar-mobile-hamburger-width)',
            visibility: 'hidden',
          }}
        />

        {/* 移动端下拉菜单 */}
        {isMenuOpen && <MobileMenu data={data} onClose={() => setMenuOpen(false)} />}
      </div>
    </header>
  )
}
