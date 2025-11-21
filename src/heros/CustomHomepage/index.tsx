'use client'
import React from 'react'
import type { Page } from '@/payload-types'
import { Media } from '@/components/Media'

export const CustomHomepageHero: React.FC<Page['hero']> = (props) => {
  const { mainVisualGroup, titleGroup, scrollBarGroup, decorationGroup } = props || {}
  
  const mainVisual = mainVisualGroup?.mainVisual
  const titleImage = titleGroup?.titleImage
  const scrollBar = scrollBarGroup?.scrollBar
  const decorationImage = decorationGroup?.decorationImage

  return (
    <div className="relative w-full" style={{ aspectRatio: '1440/1024' }}>
      {/* mainvisual - z=10: 容器居中，内部 main visual 右对齐，使用相对单位保持比例 */}
      {mainVisual && typeof mainVisual === 'object' && mainVisual !== null && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full h-full flex flex-col items-end justify-center gap-[10px] overflow-clip">
          <div className="relative w-[71.1111%] aspect-square shrink-0">
            <Media
              resource={mainVisual}
              htmlElement="div"
              className="absolute inset-0"
              imgClassName="object-[50%_50%] object-cover w-full h-full pointer-events-none"
              fill
              priority
            />
          </div>
        </div>
      )}
      
      {/* title - z=20: 全尺寸覆盖 */}
      {titleImage && typeof titleImage === 'object' && titleImage !== null && (
        <div className="absolute left-0 top-0 w-full h-full z-20">
          <Media
            resource={titleImage}
            htmlElement="div"
            className="absolute inset-0"
            imgClassName="object-[50%_50%] object-cover w-full h-full pointer-events-none"
            fill
            priority
          />
        </div>
      )}
      
      {/* scroll bar - z=30: 底部对齐，使用相对高度保持比例 */}
      {scrollBar && typeof scrollBar === 'object' && scrollBar !== null && (
        <div className="absolute left-0 top-0 w-full h-full z-30 flex flex-col items-center justify-end gap-[10px] overflow-clip">
          <div className="w-full h-[14.5508%] relative shrink-0">
            <Media
              resource={scrollBar}
              htmlElement="div"
              className="absolute inset-0"
              imgClassName="object-[50%_50%] object-cover w-full h-full pointer-events-none"
              fill
            />
          </div>
        </div>
      )}
      
      {/* decoration - z=40: 全尺寸覆盖 */}
      {decorationImage && typeof decorationImage === 'object' && decorationImage !== null && (
        <div className="absolute left-0 top-0 w-full h-full z-40">
          <Media
            resource={decorationImage}
            htmlElement="div"
            className="absolute inset-0"
            imgClassName="object-[50%_50%] object-cover w-full h-full pointer-events-none"
            fill
            priority
          />
        </div>
      )}
    </div>
  )
}

