import React, { Fragment } from 'react'

import type { Props } from './types'

import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource, fill } = props

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
  const Tag = htmlElement || Fragment

  // 如果使用 fill 且 htmlElement 不是 absolute 定位，确保它有高度
  // absolute inset-0 已经定义了尺寸，不需要额外的高度
  const isAbsolute = className?.includes('absolute')
  const needsHeight = fill && !isAbsolute && !className?.match(/\b(h-|height|min-h-|min-height|aspect-)/)
  const finalClassName = needsHeight && htmlElement !== null 
    ? `${className || ''} h-full`.trim()
    : className

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className: finalClassName,
          }
        : {})}
    >
      {isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />}
    </Tag>
  )
}
