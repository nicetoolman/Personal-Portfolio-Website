'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, type ReactNode } from 'react'

import { cn } from '@/utilities/ui'
import { STEP_BLOCKS_READY_EVENT } from '@/constants/events'

const VIEWPORT_MAP = {
  narrow: { width: 890, height: 633 },
  wide: { width: 1440, height: 633 },
} as const

export type ViewportVariant = keyof typeof VIEWPORT_MAP

interface LayoutViewportProps {
  variant?: ViewportVariant
  className?: string
  contentClassName?: string
  scrollable?: boolean
  restoreScroll?: boolean
  scrollStorageKey?: string
  children: ReactNode
}

export function LayoutViewport({
  variant = 'narrow',
  className,
  contentClassName,
  scrollable = true,
  restoreScroll = false,
  scrollStorageKey,
  children,
}: LayoutViewportProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const storedPositionRef = useRef<{ x?: number; y?: number } | null>(null)
  const hasRestoredRef = useRef(false)
  const pathname = usePathname()
  const storageKey = scrollStorageKey ?? `viewport-scroll:${pathname}`
  
  // Determine max-width class based on variant
  // This is deterministic and doesn't depend on runtime values
  const maxWidthClass = variant === 'narrow' ? 'max-w-[890px]' : 'max-w-[1440px]'

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

  // Fixed HTML structure - SSR and client render the same
  // All mobile/desktop differences are handled via CSS media queries
  return (
    <div
      className={cn(
        'layout-viewport-root',
        'relative mx-auto mt-[calc(64px+var(--navbar-height))] mb-16',
        'w-full',
        maxWidthClass,
        scrollable && 'layout-viewport-root--scrollable',
        variant === 'narrow' && 'layout-viewport-root--narrow',
        variant === 'wide' && 'layout-viewport-root--wide',
        className,
      )}
    >
      <div
        ref={scrollRef}
        className={cn(
          'layout-viewport-inner',
          'overflow-x-hidden',
          scrollable ? 'overflow-y-auto about-scroll-container' : 'overflow-y-hidden',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}


