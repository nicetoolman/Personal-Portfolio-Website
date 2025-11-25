import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/utilities/ui'

const VIEWPORT_MAP = {
  narrow: { width: 890, height: 633 },
  wide: { width: 1440, height: 633 },
} as const

export type ViewportVariant = keyof typeof VIEWPORT_MAP

interface LayoutViewportProps {
  variant?: ViewportVariant
  className?: string
  contentClassName?: string
  style?: CSSProperties
  contentStyle?: CSSProperties
  scrollable?: boolean
  children: ReactNode
}

export function LayoutViewport({
  variant = 'narrow',
  className,
  contentClassName,
  style,
  contentStyle,
  scrollable = true,
  children,
}: LayoutViewportProps) {
  const config = VIEWPORT_MAP[variant]
  const aspectRatio = `${config.width}/${config.height}`

  return (
    <div
      className={cn('relative mx-auto overflow-hidden', className)}
      style={{
        maxWidth: `${config.width}px`,
        width: '100%',
        aspectRatio,
        ...style,
      }}
    >
      <div
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


