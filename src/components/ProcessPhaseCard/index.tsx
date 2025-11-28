import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { SimpleImageToggle } from '@/components/SimpleImageToggle'
import { cn } from '@/utilities/ui'

interface ProcessPhaseCardProps {
  image?: MediaType | string | number | null
  textImage?: MediaType | string | number | null
  bottomImage?: MediaType | string | number | null
  className?: string
}

/**
 * Figma Flow 卡片：上半区 hover 切图，下半区为静态图。
 * 容器高度由父级 Grid 决定，内部通过 flex 维持 142 : 41.9 的上下比例。
 */
export function ProcessPhaseCard({ image, textImage, bottomImage, className }: ProcessPhaseCardProps) {
  return (
    <div className={cn('flex h-full w-full flex-col bg-[var(--background)]/80 backdrop-blur-sm', className)}>
      <div
        className="relative w-full"
        style={{
          flexBasis: 'calc((142 / 183.9) * 100%)',
          flexShrink: 0,
        }}
      >
        <SimpleImageToggle image={image} textImage={textImage} />
      </div>
      <div className="relative w-full flex-1 overflow-hidden min-h-[120px]">
        {bottomImage ? (
          <Media
            resource={bottomImage}
            htmlElement="div"
            className="absolute inset-0"
            imgClassName="object-contain w-full h-full"
            fill
          />
        ) : null}
      </div>
    </div>
  )
}

