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
 * 响应式行为：
 * - 桌面端 (md 及以上)：保持原有卡片式布局（874×260，左右分栏，带缩略图）
 * - 移动端 (md 以下)：纯文本列表项（隐藏缩略图，自然高度，只显示文字信息）
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
        'project-card group relative flex flex-col w-full overflow-hidden border-2 border-black transition-all duration-300',
        // 移动端：自然高度，不使用 aspect-ratio
        // 桌面端：保持固定比例 874/260
        'h-auto md:aspect-[874/260]',
      )}
    >
      {/* =====================
       * 桌面端布局：保持原有卡片式结构
       * ===================== */}
      <div className="hidden md:flex flex-row shrink-0 w-full h-[calc(100%*197/260)]">
        {/* Thumbnail：桌面端显示 */}
        <div
          className="relative shrink-0 border border-black overflow-hidden w-[calc(100%*350/874)] h-full min-h-[120px]"
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

        {/* 信息区：桌面端保持原有布局 */}
        <div
          className="flex flex-col flex-1 border border-black overflow-hidden w-[calc(100%*524/874)] h-full"
        >
          {/* Title 栏 */}
          <div className="flex items-center px-md shrink-0 h-[calc(100%*38/197)]">
            {title && (
              <div className="flex-1 text-heading-sm font-medium leading-normal">
                <RichText data={title} enableProse={false} enableGutter={false} />
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-black/30 shrink-0 w-full" />

          {/* Year 栏 */}
          <div className="flex items-center px-md shrink-0 h-[calc(100%*23/197)]">
            {year && (
              <div className="flex-1 text-body font-medium leading-normal">{year}</div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-black/30 shrink-0 w-full" />

          {/* Overview */}
          <div className="flex items-start px-md flex-1 overflow-hidden h-[calc(100%*118/197)]">
            {overview && (
              <div className="flex-1 text-heading-sm font-normal leading-normal line-clamp-4">
                <RichText data={overview} enableProse={false} enableGutter={false} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags/keywords 区：桌面端 */}
      <div className="hidden md:flex flex-col shrink-0 w-full border border-black overflow-hidden h-[calc(100%*63/260)]">
        {/* Tags 栏 */}
        <div className="flex items-center px-md py-xs shrink-0 h-[calc(100%*31/63)]">
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

        {/* Divider */}
        <div className="h-px bg-black/30 shrink-0 w-full" />

        {/* Keywords 栏 */}
        <div className="flex items-center px-md py-xs shrink-0 h-[calc(100%*31/63)]">
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

      {/* =====================
       * 移动端布局：纯文本列表项
       * ===================== */}
      <article className="flex flex-col px-md py-sm gap-0 md:hidden">
        {/* Meta：标题 + 年份 + tags + keywords */}
        <div className="flex flex-col gap-0">
          {/* 标题 */}
          {title && (
            <h3 className="text-heading-sm font-medium leading-normal">
              <RichText data={title} enableProse={false} enableGutter={false} />
            </h3>
          )}

          {/* 年份 + tags（primary 字体） */}
          <div className="flex flex-wrap gap-sm text-body">
            {year && <span>{year}</span>}
            {tagNames.length > 0 && (
              <>
                {year && <span>·</span>}
                {tagNames.map((tag, idx) => (
                  <span key={idx}>
                    {tag}
                    {idx < tagNames.length - 1 && ','}
                  </span>
                ))}
              </>
            )}
          </div>

          {/* Keywords（secondary 字体） */}
          {keywordValues.length > 0 && (
            <div className="flex flex-wrap gap-sm text-caption text-secondary">
              {keywordValues.map((kw, idx) => (
                <span key={idx}>
                  {kw}
                  {idx < keywordValues.length - 1 && ','}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
