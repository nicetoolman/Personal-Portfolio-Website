'use client'

import { PropsWithChildren, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { STEP_BLOCKS_READY_EVENT } from '@/constants/events'

const LOGICAL_CANVAS_WIDTH = 1440
const BODY_WIDTH = 890
const MOBILE_BREAKPOINT = 640

/**
 * Wraps the StepBlock content with a horizontally scrollable viewport that keeps
 * a 1440px logical canvas and scales down when the viewport is narrower than 890px.
 * 
 * On mobile (< 640px), completely disables scaling and uses natural flow layout.
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

  const isMobile = viewportWidth < MOBILE_BREAKPOINT

  const updateMetrics = useCallback(() => {
    if (typeof window === 'undefined') return
    const vw = window.innerWidth
    setViewportWidth(vw)
    // Only calculate scale for desktop
    if (vw >= MOBILE_BREAKPOINT) {
      const nextScale = Math.min(1, vw / BODY_WIDTH)
      setScale(nextScale)
    } else {
      setScale(1) // Mobile: no scaling
    }
  }, [])

  const focusBody = useCallback(() => {
    // Skip focusBody on mobile
    if (isMobile) return
    
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
  }, [viewportWidth, isMobile])

  useLayoutEffect(() => {
    updateMetrics()
    window.addEventListener('resize', updateMetrics)
    return () => {
      window.removeEventListener('resize', updateMetrics)
    }
  }, [updateMetrics])

  useEffect(() => {
    if (!isMobile) {
      focusBody()
    }
  }, [focusBody, scale, viewportWidth, isMobile])

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
    if (wrapperEl && !isMobile) {
      wrapperEl.style.setProperty('--step-canvas-height', `${canvasHeight}px`)
    }
  }, [canvasHeight, isMobile])

  useEffect(() => {
    if (readyDispatchedRef.current) return
    if (canvasHeight <= 0 && !isMobile) return
    if (typeof window === 'undefined') return

    readyDispatchedRef.current = true

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event(STEP_BLOCKS_READY_EVENT))
      })
    })
  }, [canvasHeight, isMobile])

  // Mobile: return flow layout without scaling
  if (isMobile) {
    return (
      <div className="w-full max-w-[var(--layout-content-width)] mx-auto">
        <div ref={canvasRef} className="step-block-mobile w-full">
          {children}
        </div>
      </div>
    )
  }

  // Desktop: original scaling behavior
  return (
    <div 
      ref={scrollRef} 
      className="w-full overflow-x-auto step-block-scrollbar-hide"
      style={{
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
      }}
    >
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

