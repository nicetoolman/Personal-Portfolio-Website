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
      <div className="hidden md:flex items-center h-[var(--navbar-height)] px-[var(--navbar-side-padding)]">
        {/* Icon 和链接容器：限制宽度 */}
        <div className="flex items-center w-[var(--navbar-content-width)] gap-[var(--navbar-gap)]">
          {/* Icon */}
          {hasLogo && (
            <Link
              href="/"
              className="relative overflow-hidden shrink-0 flex items-center justify-center"
            >
              <div
                className="relative"
                style={{
                  height: 'var(--navbar-icon-height)',
                  aspectRatio: 'var(--navbar-icon-aspect-ratio)', // 88/87
                }}
              >
                <Media
                  resource={logo}
                  htmlElement="div"
                  className="absolute inset-0 opacity-60"
                  imgClassName="object-contain w-full h-full"
                  fill
                />
              </div>
        </Link>
          )}
        <HeaderNav data={data} />
        </div>
      </div>

      {/* 移动端布局 */}
      <div className="flex md:hidden items-center justify-between w-full relative h-[var(--navbar-mobile-height)] px-[var(--navbar-side-padding)]">
        {/* 左侧：汉堡按钮 */}
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="flex items-center justify-center shrink-0 w-[var(--navbar-mobile-hamburger-width)] h-[var(--navbar-mobile-hamburger-width)]"
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
            className="relative overflow-hidden shrink-0 flex items-center justify-center"
            onClick={() => setMenuOpen(false)}
          >
            <div
              className="relative"
              style={{
                height: 'var(--navbar-icon-height)',
                aspectRatio: 'var(--navbar-icon-aspect-ratio)', // 88/87
              }}
            >
              <Media
                resource={logo}
                htmlElement="div"
                className="absolute inset-0 opacity-60"
                imgClassName="object-contain w-full h-full"
                fill
              />
            </div>
          </Link>
        )}

        {/* 右侧：预留空间（不可见，保持对称） */}
        <div className="w-[var(--navbar-mobile-hamburger-width)] invisible" />

        {/* 移动端下拉菜单 */}
        {isMenuOpen && <MobileMenu data={data} onClose={() => setMenuOpen(false)} />}
      </div>
    </header>
  )
}
