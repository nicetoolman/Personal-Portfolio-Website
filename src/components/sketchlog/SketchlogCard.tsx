'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { Sketchlog } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

interface SketchlogCardProps {
  entry: Sketchlog
}

/**
 * Sketchlog 卡片组件
 *
 * 布局：
 * - 折叠时：左图（1:1 比例，宽度 = 38.2%）右文（宽度 = 61.8%）
 * - 展开时：保持相同的 flex 布局，文字在 61.8% 宽度内换行，撑开高度
 */
export function SketchlogCard({ entry }: SketchlogCardProps) {
  const [expanded, setExpanded] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [imageHeight, setImageHeight] = useState<number | null>(null)
  const [textHeight, setTextHeight] = useState<number | null>(null)
  const [shouldCollapse, setShouldCollapse] = useState(false)

  // Lightbox 状态
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  // 提取数据
  const title = entry.title || 'Untitled Sketchlog'
  const publishedOn = entry.publishedOn
    ? new Date(entry.publishedOn as string).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null
  const images = (entry.images as { image?: any; caption?: string }[] | undefined) ?? []
  const excerpt = entry.excerpt as any // RichText 数据（JSON 格式）
  const project = entry.project

  // 图片轮播相关
  const validImages = useMemo(
    () => images.filter((item) => Boolean(item?.image)).map((item) => item.image),
    [images],
  )
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const hasMultipleImages = validImages.length > 1

  const goPrev = () => {
    if (!hasMultipleImages) return
    setDirection(-1)
    setCurrentImageIndex((index) => (index - 1 + validImages.length) % validImages.length)
  }

  const goNext = () => {
    if (!hasMultipleImages) return
    setDirection(1)
    setCurrentImageIndex((index) => (index + 1) % validImages.length)
  }

  // Lightbox 功能
  const handleOpenLightbox = (index: number) => {
    if (!validImages[index]) return
    setActiveIndex(index)
    setLightboxOpen(true)
    // 防止背景滚动
    document.body.style.overflow = 'hidden'
  }

  const handleCloseLightbox = () => {
    setLightboxOpen(false)
    // 恢复背景滚动
    document.body.style.overflow = ''
  }

  const handleLightboxPrev = () => {
    if (validImages.length <= 1) return
    setActiveIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))
  }

  const handleLightboxNext = () => {
    if (validImages.length <= 1) return
    setActiveIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1))
  }

  // 清理：组件卸载时恢复滚动
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // 设置 mounted 状态，避免 SSR 报错
  useEffect(() => {
    setMounted(true)
  }, [])

  const slideVariants = {
    initial: (dir: 1 | -1) => ({
      x: dir === 1 ? 60 : -60,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: 1 | -1) => ({
      x: dir === 1 ? -60 : 60,
      opacity: 0,
    }),
  }

  // 比较文字和图片高度，决定是否需要折叠
  useEffect(() => {
    if (!textRef.current || !imageRef.current || !excerpt) return

    const checkHeights = () => {
      const textHeightValue = textRef.current?.scrollHeight || 0
      const imageHeightValue = imageRef.current?.offsetHeight || 0
      
      setTextHeight(textHeightValue)
      setImageHeight(imageHeightValue)
      
      // 如果文字高度超过图片高度，则需要折叠
      // 按钮高度约等于一行文字高度（约 20-24px），需要预留空间
      const buttonHeight = 24 // 估算按钮高度
      const shouldCollapseValue = textHeightValue > imageHeightValue - buttonHeight
      setShouldCollapse(shouldCollapseValue)
    }

    // 初始检查
    checkHeights()

    // 监听文字容器高度变化
    const textObserver = new ResizeObserver(() => {
      checkHeights()
    })
    textObserver.observe(textRef.current)

    // 监听图片容器高度变化
    const imageObserver = new ResizeObserver(() => {
      checkHeights()
    })
    imageObserver.observe(imageRef.current)

    return () => {
      textObserver.disconnect()
      imageObserver.disconnect()
    }
  }, [excerpt, expanded])

  // Lightbox JSX（提取为独立变量）
  const lightbox = lightboxOpen && validImages[activeIndex] ? (
    <div
      className="fixed inset-0 z-[9999] flex justify-center bg-black/70 px-4 py-10 overflow-y-auto"
      onClick={handleCloseLightbox}
    >
      <div
        className="relative my-auto max-w-5xl w-full bg-background/90 rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          type="button"
          onClick={handleCloseLightbox}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs text-white hover:bg-black/80 transition-colors"
        >
          Close
        </button>

        {/* 大图区域 */}
        <div className="relative w-full bg-black max-h-[80vh] min-h-[50vh]">
          <Media
            resource={validImages[activeIndex]}
            htmlElement="div"
            className="absolute inset-0"
            imgClassName="object-contain w-full h-full"
            fill
            size="(max-width: 1024px) 100vw, 900px"
          />
        </div>

        {/* 底部控制区域（多图时显示） */}
        {validImages.length > 1 && (
          <div className="flex items-center justify-between px-4 py-3 text-xs text-muted-foreground border-t">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLightboxPrev}
                className="rounded-full border px-3 py-1 hover:bg-muted transition-colors"
              >
                &lt;
              </button>
              <button
                type="button"
                onClick={handleLightboxNext}
                className="rounded-full border px-3 py-1 hover:bg-muted transition-colors"
              >
                &gt;
              </button>
            </div>
            <div>
              {activeIndex + 1} / {validImages.length}
            </div>
          </div>
        )}

        {/* 当前图片 caption */}
        {images[activeIndex]?.caption && (
          <div className="border-t px-4 py-3 text-xs text-muted-foreground whitespace-pre-wrap">
            {images[activeIndex].caption}
          </div>
        )}
      </div>
    </div>
  ) : null

  return (
    <>
      <article className="rounded bg-card/60 backdrop-blur-sm shadow-sm border-2 border-black p-4 sm:p-5">
      {/* 标题和日期 */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="text-base font-semibold leading-tight">{title}</h2>
        {publishedOn && (
          <time className="shrink-0 text-[11px] uppercase tracking-wide text-muted-foreground">
            {publishedOn}
          </time>
        )}
      </div>

      {/* 图片和文字区域 */}
      <div
        ref={containerRef}
        data-container
        className={cn(
          'w-full flex gap-4 items-start',
        )}
      >
        {/* 图片区域 */}
        {validImages.length > 0 && (
          <div
            ref={imageRef}
            className="relative bg-muted rounded-lg overflow-hidden shrink-0 cursor-pointer"
            onClick={() => handleOpenLightbox(currentImageIndex)}
            style={
              containerRef.current
                ? {
                    // 图片宽度为容器的 38.2%（黄金比例），减去 gap 的一半
                    width: 'calc(38.2% - 8px)',
                    // 图片高度等于宽度（1:1 比例）
                    aspectRatio: '1 / 1',
                  }
                : {
                    // 默认值
                    aspectRatio: '1 / 1',
                  }
            }
          >
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={currentImageIndex}
                className="absolute inset-0"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.45, ease: 'easeInOut' }}
              >
                <Media
                  resource={validImages[currentImageIndex]}
                  htmlElement="div"
                  className="absolute inset-0"
                  imgClassName="object-cover w-full h-full"
                  fill
                />
              </motion.div>
            </AnimatePresence>

            {/* 左右箭头按钮（仅在有多张图片时显示） */}
            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  aria-label="Show previous image"
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full border border-[hsl(var(--accent))] text-[hsl(var(--accent))] opacity-70 transition-all duration-300 ease-in-out hover:opacity-100 hover:bg-black/50 hover:text-white hover:border-white z-10"
                  onClick={(e) => {
                    e.stopPropagation() // 阻止触发图片点击事件
                    goPrev()
                  }}
                >
                  <span className="text-sm leading-none">◀</span>
                </button>
                <button
                  type="button"
                  aria-label="Show next image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full border border-[hsl(var(--accent))] text-[hsl(var(--accent))] opacity-70 transition-all duration-300 ease-in-out hover:opacity-100 hover:bg-black/50 hover:text-white hover:border-white z-10"
                  onClick={(e) => {
                    e.stopPropagation() // 阻止触发图片点击事件
                    goNext()
                  }}
                >
                  <span className="text-sm leading-none">▶</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* 文字内容 */}
        {excerpt && (
          <div
            className="space-y-2 flex-1 min-w-0"
            style={{
              // 文本宽度：容器的 61.8%（黄金比例），减去 gap 的一半
              width: 'calc(61.8% - 8px)',
            }}
          >
            <div
              ref={textRef}
              className={cn(
                'text-sm text-muted-foreground leading-relaxed',
              )}
              style={
                shouldCollapse && !expanded && imageHeight
                  ? {
                      // 折叠时：限制高度为图片高度减去按钮高度（预留一行空间）
                      maxHeight: `${imageHeight - 24}px`,
                      overflow: 'hidden',
                    }
                  : undefined
              }
            >
              <RichText
                data={excerpt}
                enableProse={false}
                enableGutter={false}
                className="text-sm text-muted-foreground"
              />
            </div>
            {shouldCollapse && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
              >
                {expanded ? 'Read less' : 'Read more'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 关联项目 */}
      {project && typeof project === 'object' && project !== null && 'title' in project && (
        <div className="text-[11px] text-muted-foreground mt-3">
          关联项目: {String(project.title ?? 'Unknown project')}
        </div>
      )}
      </article>

      {/* 使用 Portal 将 Lightbox 渲染到 document.body */}
      {mounted && lightboxOpen ? createPortal(lightbox, document.body) : null}
    </>
  )
}

