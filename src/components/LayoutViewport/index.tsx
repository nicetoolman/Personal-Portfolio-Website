'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

import { cn } from '@/utilities/ui'
import { STEP_BLOCKS_READY_EVENT } from '@/constants/events'

const VIEWPORT_MAP = {
  narrow: { width: 890, height: 633 },
  wide: { width: 1440, height: 633 },
} as const

const MOBILE_BREAKPOINT = 640

export type ViewportVariant = keyof typeof VIEWPORT_MAP

interface LayoutViewportProps {
  variant?: ViewportVariant
  className?: string
  contentClassName?: string
  style?: CSSProperties
  contentStyle?: CSSProperties
  scrollable?: boolean
  restoreScroll?: boolean
  scrollStorageKey?: string
  children: ReactNode
}

export function LayoutViewport({
  variant = 'narrow',
  className,
  contentClassName,
  style,
  contentStyle,
  scrollable = true,
  restoreScroll = false,
  scrollStorageKey,
  children,
}: LayoutViewportProps) {
  const config = VIEWPORT_MAP[variant]
  const aspectRatio = `${config.width}/${config.height}`
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const storedPositionRef = useRef<{ x?: number; y?: number } | null>(null)
  const hasRestoredRef = useRef(false)
  const pathname = usePathname()
  const storageKey = scrollStorageKey ?? `viewport-scroll:${pathname}`
  
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : config.width,
  )
  const isMobile = viewportWidth < MOBILE_BREAKPOINT

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth)
    }
    
    window.addEventListener('resize', updateViewportWidth)
    return () => {
      window.removeEventListener('resize', updateViewportWidth)
    }
  }, [])

  useEffect(() => {
    if (!restoreScroll) return
    if (typeof window === 'undefined') return

    const el = scrollRef.current
    if (!el) return

    const raw = sessionStorage.getItem(storageKey)
    if (raw) {
      try {
        storedPositionRef.current = JSON.parse(raw) as { x?: number; y?: number }
      } catch {
        // ignore parse error
        storedPositionRef.current = null
      }
    } else {
      storedPositionRef.current = null
    }

    let frame: number | null = null
    let fallbackTimeout: number | null = null

    const attemptRestore = () => {
      if (hasRestoredRef.current) return
      if (!storedPositionRef.current) return
      const targetEl = scrollRef.current
      if (!targetEl) return

      hasRestoredRef.current = true

      requestAnimationFrame(() => {
        const { x = 0, y = 0 } = storedPositionRef.current ?? {}
        targetEl.scrollTo(x ?? 0, y ?? 0)
      })
    }

    const handleReady = () => {
      attemptRestore()
    }

    window.addEventListener(STEP_BLOCKS_READY_EVENT, handleReady)

    // fallback restore to support页面 without step blocks
    fallbackTimeout = window.setTimeout(() => {
      attemptRestore()
    }, 300)

    const save = () => {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          x: el.scrollLeft,
          y: el.scrollTop,
        }),
      )
    }

    const onScroll = () => {
      if (frame !== null) return
      frame = requestAnimationFrame(() => {
        frame = null
        save()
      })
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('beforeunload', save)

    return () => {
      if (frame !== null) {
        cancelAnimationFrame(frame)
      }
      if (fallbackTimeout !== null) {
        window.clearTimeout(fallbackTimeout)
      }
      window.removeEventListener(STEP_BLOCKS_READY_EVENT, handleReady)
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('beforeunload', save)
    }
  }, [restoreScroll, storageKey])

  // Mobile: height auto, no aspect ratio restriction
  if (isMobile) {
    return (
      <div
        className={cn(
          'relative mx-auto mt-[calc(64px+var(--navbar-height))] mb-16',
          className,
        )}
        style={{
          maxWidth: `${config.width}px`,
          width: '100%',
          ...style,
        }}
      >
        <div
          ref={scrollRef}
          className={cn(
            'w-full overflow-x-hidden',
            scrollable ? 'overflow-y-auto about-scroll-container' : 'overflow-y-hidden',
            contentClassName,
          )}
          style={contentStyle}
        >
          {children}
        </div>
      </div>
    )
  }

  // Desktop: original behavior with aspect ratio
  return (
    <div
      className={cn(
        'relative mx-auto overflow-hidden mt-[calc(64px+var(--navbar-height))] mb-16',
        className,
      )}
      style={{
        maxWidth: `${config.width}px`,
        width: '100%',
        aspectRatio,
        ...style,
      }}
    >
      <div
        ref={scrollRef}
        className={cn(
          'absolute inset-0 overflow-x-hidden',
          scrollable ? 'overflow-y-auto about-scroll-container' : 'overflow-y-hidden',
          contentClassName,
        )}
        style={contentStyle}
      >
        {children}
      </div>
    </div>
  )
}


