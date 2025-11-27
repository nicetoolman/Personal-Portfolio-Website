'use client'

import { PropsWithChildren, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const LOGICAL_CANVAS_WIDTH = 1440
const BODY_WIDTH = 890

/**
 * Wraps the StepBlock content with a horizontally scrollable viewport that keeps
 * a 1440px logical canvas and scales down when the viewport is narrower than 890px.
 */
export function StepBlockViewport({ children }: PropsWithChildren) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const [scale, setScale] = useState(1)
  const [canvasHeight, setCanvasHeight] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : LOGICAL_CANVAS_WIDTH,
  )

  const updateMetrics = useCallback(() => {
    if (typeof window === 'undefined') return
    const vw = window.innerWidth
    setViewportWidth(vw)
    const nextScale = Math.min(1, vw / BODY_WIDTH)
    setScale(nextScale)
  }, [])

  const focusBody = useCallback(() => {
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
  }, [viewportWidth])

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

