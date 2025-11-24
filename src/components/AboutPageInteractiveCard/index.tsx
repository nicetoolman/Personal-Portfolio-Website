'use client'

import React, { useState } from 'react'
import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

interface AboutPageInteractiveCardProps {
  /**
   * 关闭状态图片（默认 20% 不透明度，hover 时 50%）
   */
  closedImage: MediaType | string | number | null
  /**
   * 打开状态图片（100% 不透明度）
   */
  openImage: MediaType | string | number | null
  /**
   * 自定义 className（可选）
   */
  className?: string
}

/**
 * About 页面交互式图片卡片组件
 * 
 * 交互逻辑：
 * - 默认：显示关闭状态图片，20% 不透明度
 * - hover：显示关闭状态图片，50% 不透明度
 * - 点击：切换到打开状态图片，100% 不透明度
 * - 再次点击：回到关闭状态，20% 不透明度
 */
export const AboutPageInteractiveCard: React.FC<AboutPageInteractiveCardProps> = ({
  closedImage,
  openImage,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // 确定当前显示的图片
  const currentImage = isOpen ? openImage : closedImage

  // 计算不透明度
  let opacity = 1.0
  if (!isOpen) {
    // 关闭状态：hover 时 50%，否则 20%
    opacity = isHovered ? 0.5 : 0.2
  }
  // 打开状态：始终 100%

  // 如果没有图片资源，不渲染
  if (!currentImage || (typeof currentImage === 'object' && currentImage === null)) {
    return null
  }

  return (
    <button
      type="button"
      className={`relative w-full h-full overflow-hidden cursor-pointer ${className}`}
      onClick={() => setIsOpen(!isOpen)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={isOpen ? '关闭交互卡片' : '打开交互卡片'}
    >
      {/* 外层 div 用于控制不透明度和过渡效果 */}
      <div
        className="absolute inset-0"
        style={{
          opacity,
          transition: 'opacity 0.2s ease-in-out',
        }}
      >
        <Media
          resource={currentImage}
          htmlElement="div"
          className="absolute inset-0"
          imgClassName="object-contain w-full h-full pointer-events-none"
          fill
        />
      </div>
    </button>
  )
}

