import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

interface SimpleImageToggleProps {
  image?: MediaType | string | number | null
  textImage?: MediaType | string | number | null
  className?: string
}

/**
 * Flow 卡片上半部分：hover 时在主图与文本图之间切换。
 */
export function SimpleImageToggle({ image, textImage, className }: SimpleImageToggleProps) {
  if (!image && !textImage) return null

  return (
    <div className={cn('group relative flex h-full w-full overflow-hidden min-h-[120px]', className)}>
      {image && (
        <Media
          resource={image}
          htmlElement="div"
          className="absolute inset-0 transition-opacity duration-150 group-hover:opacity-0"
          imgClassName="object-contain w-full h-full pointer-events-none"
          fill
        />
      )}
      {textImage && (
        <Media
          resource={textImage}
          htmlElement="div"
          className="absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          imgClassName="object-contain w-full h-full pointer-events-none"
          fill
        />
      )}
    </div>
  )
}

