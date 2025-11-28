'use client'

import React, { useMemo, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import type { Media as MediaType } from '@/payload-types'

type ShowcaseMedia = MediaType | number | string

interface ShowcaseItem {
  image?: ShowcaseMedia | null
}

interface ProjectShowcaseProps {
  items?: ShowcaseItem[] | null
}

const padding = 'calc(100% * 8 / 890)'

export function ProjectShowcase({ items }: ProjectShowcaseProps) {
  const slides = useMemo(
    () =>
      (items ?? [])
        .map((item) => item?.image)
        .filter((image): image is ShowcaseMedia => Boolean(image)),
    [items],
  )

  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)

  if (slides.length === 0) {
    return (
      <div
        className="relative w-full overflow-hidden border border-dashed border-black/40"
        style={{ aspectRatio: '16 / 9' }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-sm text-black/40">
          Showcase area (placeholder)
        </div>
      </div>
    )
  }

  const total = slides.length
  const safeIndex = ((current % total) + total) % total

  const goPrev = () => {
    setDirection(-1)
    setCurrent((index) => (index - 1 + total) % total)
  }

  const goNext = () => {
    setDirection(1)
    setCurrent((index) => (index + 1) % total)
  }

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

  return (
    <div
      className="relative w-full box-content"
      style={{
        aspectRatio: '16 / 9',
        minHeight: '120px',
        padding,
      }}
    >
      <div className="absolute inset-0 flex">
        <div className="relative flex-1 overflow-hidden border border-black">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={safeIndex}
              className="absolute inset-0"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            >
              <Media
                resource={slides[safeIndex]}
                htmlElement="div"
                className="absolute inset-0"
                imgClassName="object-contain w-full h-full"
                fill
              />
            </motion.div>
          </AnimatePresence>

          {total > 1 && (
            <>
              <button
                type="button"
                aria-label="Show previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-[hsl(var(--accent))] bg-[hsl(var(--background))] px-3 py-1 text-caption font-semibold uppercase tracking-wide text-[hsl(var(--accent))] transition-colors duration-300 ease-in-out hover:bg-black/50 hover:text-white"
                onClick={goPrev}
              >
                Prev
              </button>
              <button
                type="button"
                aria-label="Show next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[hsl(var(--accent))] bg-[hsl(var(--background))] px-3 py-1 text-caption font-semibold uppercase tracking-wide text-[hsl(var(--accent))] transition-colors duration-300 ease-in-out hover:bg-black/50 hover:text-white"
                onClick={goNext}
              >
                Next
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

