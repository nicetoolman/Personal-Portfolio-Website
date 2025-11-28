'use client'

import Link from 'next/link'
import type { Project, Tag } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'

interface ProjectCardProps {
  project: Pick<Project, 'slug' | 'intro'>
}

/**
 * Project 卡片组件
 * 
 * 基于 Figma 1127-7751 设计：
 * - 卡片整体：874×260，垂直布局
 * - main 容器：874×197，水平布局
 *   - 图片：350×197
 *   - 信息区：524×197
 * - Tags/keywords 区：874×63
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const { slug, intro } = project

  if (!slug || !intro) return null

  // 获取卡片图片（优先 heroImage，否则用第一张 showcase）
  const cardImage = intro.heroImage || intro.showcaseImages?.[0]?.image

  // 提取文本内容
  const title = intro.titleGroup?.title
  const overview = intro.content?.overview
  const year = intro.meta?.year
  const tags = intro.meta?.tags
  const keywords = intro.meta?.keywords

  // 处理 tags（array of { tag: relationship }）
  const tagNames: string[] = []
  if (tags && Array.isArray(tags)) {
    tags.forEach((tagItem) => {
      if (typeof tagItem === 'object' && tagItem !== null && 'tag' in tagItem) {
        const tag = tagItem.tag
        if (typeof tag === 'object' && tag !== null) {
          const tagObj = tag as Tag
          if (tagObj.title) {
            tagNames.push(tagObj.title)
          } else if (tagObj.id) {
            tagNames.push(String(tagObj.id))
          }
        } else {
          tagNames.push(String(tag))
        }
      }
    })
  }

  // 处理 keywords（array of { keyword: string }）
  const keywordValues: string[] = []
  if (keywords && Array.isArray(keywords)) {
    keywords.forEach((kwItem) => {
      if (typeof kwItem === 'object' && kwItem !== null && 'keyword' in kwItem) {
        keywordValues.push(String(kwItem.keyword))
      }
    })
  }

  return (
    <Link
      href={`/projects/${slug}`}
      className={cn(
        'group relative flex flex-col w-full overflow-hidden border-2 border-black transition-all duration-300',
        'hover:border-[3px]',
      )}
      style={{
        aspectRatio: '874/260',
      }}
    >
      {/* Main 容器：874×197，水平布局 */}
      <div className="flex shrink-0 w-full" style={{ height: 'calc(100% * 197 / 260)' }}>
        {/* 图片区：350×197，1px border */}
        <div
          className="relative shrink-0 border border-black overflow-hidden"
          style={{
            width: 'calc(100% * 350 / 874)',
            height: '100%',
          }}
        >
          {cardImage ? (
            <Media
              resource={cardImage}
              htmlElement="div"
              className="absolute inset-0"
              imgClassName="object-cover w-full h-full"
              fill
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200" />
          )}
        </div>

        {/* 信息区：524×197，垂直布局，1px border */}
        <div
          className="flex flex-col flex-1 border border-black overflow-hidden"
          style={{
            width: 'calc(100% * 524 / 874)',
            height: '100%',
          }}
        >
          {/* Title 栏：524×38 */}
          <div
            className="flex items-center px-md shrink-0 overflow-hidden"
            style={{ height: 'calc(100% * 38 / 197)' }}
          >
            {title && (
              <div className="flex-1 text-heading-sm font-medium leading-normal">
                <RichText data={title} enableProse={false} enableGutter={false} />
              </div>
            )}
          </div>

          {/* Divider：1px，30% 不透明度 */}
          <div className="h-px bg-black/30 shrink-0 w-full" />

          {/* Year 栏：524×23 */}
          <div
            className="flex items-center px-md shrink-0 overflow-hidden"
            style={{ height: 'calc(100% * 23 / 197)' }}
          >
            {year && (
              <div className="flex-1 text-body font-medium leading-normal">{year}</div>
            )}
          </div>

          {/* Divider：1px，30% 不透明度 */}
          <div className="h-px bg-black/30 shrink-0 w-full" />

          {/* Overview：524×118 */}
          <div
            className="flex items-start px-md flex-1 overflow-hidden"
            style={{ height: 'calc(100% * 118 / 197)' }}
          >
            {overview && (
              <div className="flex-1 text-heading-sm font-normal leading-normal line-clamp-4">
                <RichText data={overview} enableProse={false} enableGutter={false} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags/keywords 区：874×63，垂直布局，1px border */}
      <div
        className="flex flex-col shrink-0 w-full border border-black overflow-hidden"
        style={{ height: 'calc(100% * 63 / 260)' }}
      >
        {/* Tags 栏：874×31 */}
        <div
          className="flex items-center px-md py-xs shrink-0 overflow-hidden"
          style={{ height: 'calc(100% * 31 / 63)' }}
        >
          <span className="text-body font-bold leading-normal shrink-0">Tags：</span>
          {tagNames.length > 0 && (
            <div className="flex-1 flex gap-xs flex-wrap ml-md">
              {tagNames.map((tag, idx) => (
                <span key={idx} className="text-body leading-normal">
                  {tag}
                  {idx < tagNames.length - 1 && ','}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Divider：1px，30% 不透明度 */}
        <div className="h-px bg-black/30 shrink-0 w-full" />

        {/* Keywords 栏：874×31 */}
        <div
          className="flex items-center px-md py-xs shrink-0 overflow-hidden"
          style={{ height: 'calc(100% * 31 / 63)' }}
        >
          <span className="text-body font-bold leading-normal shrink-0">Keywords：</span>
          {keywordValues.length > 0 && (
            <div className="flex-1 flex gap-xs flex-wrap ml-md">
              {keywordValues.map((kw, idx) => (
                <span key={idx} className="text-body leading-normal">
                  {kw}
                  {idx < keywordValues.length - 1 && ','}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
