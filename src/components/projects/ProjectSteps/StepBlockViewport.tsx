'use client'

import { PropsWithChildren, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { STEP_BLOCKS_READY_EVENT } from '@/constants/events'

const LOGICAL_CANVAS_WIDTH = 1440
const BODY_WIDTH = 890
const MOBILE_BREAKPOINT = 640

/**
 * StepBlockViewport - 响应式容器组件
 * 
 * 两种布局模式：
 * 
 * 1. 桌面端模式（> 640px）：
 *    - 使用 1440px 逻辑画布和 transform: scale() 缩放
 *    - 保持现有的左右分栏、边距等布局
 *    - 水平滚动以聚焦内容区域
 * 
 * 2. 手机端模式（≤ 640px）：
 *    - 禁用缩放（scale = 1）
 *    - 不使用固定 1440px 画布，改用 width: 100%; max-width: var(--layout-content-width)
 *    - 不设置固定 aspectRatio，让内容自然撑高
 *    - 布局简化为单列，Sidebar 和正文上下堆叠
 */
export function StepBlockViewport({ children }: PropsWithChildren) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const readyDispatchedRef = useRef(false)

  const [scale, setScale] = useState(1)
  const [canvasHeight, setCanvasHeight] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : LOGICAL_CANVAS_WIDTH,
  )

  // 判断是否为手机端布局
  const isMobileLayout = viewportWidth <= MOBILE_BREAKPOINT

  const updateMetrics = useCallback(() => {
    if (typeof window === 'undefined') return
    const vw = window.innerWidth
    setViewportWidth(vw)
    
    // 手机端禁用缩放
    if (vw <= MOBILE_BREAKPOINT) {
      setScale(1)
    } else {
      const nextScale = Math.min(1, vw / BODY_WIDTH)
      setScale(nextScale)
    }
  }, [])

  const focusBody = useCallback(() => {
    // 手机端不需要聚焦逻辑
    if (isMobileLayout) return

    const scrollEl = scrollRef.current
    const canvasEl = canvasRef.current
    if (!scrollEl) return

    const vw = viewportWidth
    const canvasWidth = canvasEl ? canvasEl.offsetWidth : LOGICAL_CANVAS_WIDTH
    const bodyStart = (canvasWidth - BODY_WIDTH) / 2
    const bodyCenter = bodyStart + BODY_WIDTH / 2
    const maxScroll = Math.max(0, canvasWidth - vw)

    let target = 0
    if (vw >= canvasWidth) {
      target = Math.max(0, (canvasWidth - vw) / 2)
    } else {
      target = Math.min(Math.max(0, bodyCenter - vw / 2), maxScroll)
    }

    scrollEl.scrollTo({ left: target })
  }, [viewportWidth, isMobileLayout])

  useLayoutEffect(() => {
    updateMetrics()
    window.addEventListener('resize', updateMetrics)
    return () => {
      window.removeEventListener('resize', updateMetrics)
    }
  }, [updateMetrics])

  useEffect(() => {
    focusBody()
  }, [focusBody, scale, viewportWidth])

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry?.contentRect) {
        setCanvasHeight(entry.contentRect.height)
      }
    })

    observer.observe(canvasEl)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const wrapperEl = wrapperRef.current
    if (wrapperEl) {
      wrapperEl.style.setProperty('--step-canvas-height', `${canvasHeight}px`)
    }
  }, [canvasHeight])

  useEffect(() => {
    if (readyDispatchedRef.current) return
    if (canvasHeight <= 0) return
    if (typeof window === 'undefined') return

    readyDispatchedRef.current = true

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event(STEP_BLOCKS_READY_EVENT))
      })
    })
  }, [canvasHeight])

  // 手机端：简单容器，不使用缩放
  if (isMobileLayout) {
    return (
      <div
        ref={wrapperRef}
        className="w-full"
        style={{ maxWidth: 'var(--layout-content-width)' }}
      >
        <div ref={canvasRef} className="step-block-mobile">
          {children}
        </div>
      </div>
    )
  }

  // 桌面端：保持原有的缩放画布逻辑
  return (
    <div ref={scrollRef} className="w-full overflow-x-auto">
      <div
        ref={wrapperRef}
        className="inline-block"
        style={{ height: canvasHeight * scale }}
      >
        <div
          ref={canvasRef}
          className="relative mx-auto"
          style={{
            width: LOGICAL_CANVAS_WIDTH,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

