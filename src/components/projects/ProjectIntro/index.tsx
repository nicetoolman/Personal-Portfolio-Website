import React from 'react'

import type { Project } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

interface ProjectIntroProps {
  intro?: Project['intro'] | null
}

interface MetaSectionProps {
  title: string
  children: React.ReactNode
}

const Divider = () => <div className="w-full h-px bg-black/30" />

const MetaSection: React.FC<MetaSectionProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold uppercase tracking-wide text-black/60">{title}</p>
      <div className="text-base leading-relaxed text-black">{children}</div>
    </div>
  )
}

export function ProjectIntro({ intro }: ProjectIntroProps) {
  if (!intro) {
    return null
  }

  const contentBlocks = [
    { key: 'overview', label: 'Overview', value: intro.content?.overview },
    { key: 'goal', label: 'Goal', value: intro.content?.goal },
    { key: 'process', label: 'Process', value: intro.content?.process },
    { key: 'outcome', label: 'Outcome', value: intro.content?.outcome },
  ]

  const keywords = intro.meta?.keywords?.filter(
    (keywordItem): keywordItem is { keyword: string } => typeof keywordItem?.keyword === 'string',
  )

  const links = intro.meta?.links
    ?.map((linkItem) => linkItem?.link)
    .filter((linkItem): linkItem is NonNullable<typeof linkItem> => Boolean(linkItem))

  const roles = intro.meta?.roles?.filter(
    (roleItem): roleItem is { role: string } => typeof roleItem?.role === 'string' && roleItem.role.trim().length > 0,
  )

  const padding = 'calc(100% * 8 / 890)'

  return (
    <section className="w-full flex justify-center">
      <div
        className="flex w-full max-w-[890px] flex-col gap-2 box-content"
        style={{
          padding,
        }}
      >
        {/* Title Group */}
        {(intro.titleGroup?.title || intro.titleGroup?.subtitle) && (
          <div className="w-full max-w-[874px] flex flex-col items-center gap-2 text-center">
            {intro.titleGroup?.title && (
              <RichText
                data={intro.titleGroup.title}
                enableProse={false}
                enableGutter={false}
                className="text-[40px] font-black leading-tight tracking-tight font-['Roboto_Condensed']"
              />
            )}
            {intro.titleGroup?.subtitle && (
              <RichText
                data={intro.titleGroup.subtitle}
                enableProse={false}
                enableGutter={false}
                className="text-[32px] font-black leading-tight tracking-tight font-['Roboto_Condensed']"
              />
            )}
          </div>
        )}

        {/* Hero Viewport */}
        <div
          className="relative w-full max-w-[874px] overflow-hidden border border-black bg-white"
          style={{ aspectRatio: '16 / 9' }}
        >
          {intro.heroImage ? (
            <Media
              resource={intro.heroImage}
              htmlElement="div"
              className="absolute inset-0"
              imgClassName="object-cover w-full h-full"
              fill
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-black/40">
              Hero image placeholder
            </div>
          )}
        </div>

        {/* Content Blocks */}
        <div className="w-full max-w-[874px] flex flex-col gap-4">
          {contentBlocks.map((block) => {
            if (!block.value) return null
            return (
              <div key={block.key} className="flex flex-col gap-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-black/60">{block.label}</p>
                <RichText data={block.value} enableGutter={false} enableProse={false} />
              </div>
            )
          })}
        </div>

        {/* Showcase placeholder */}
        <div
          className="relative w-full max-w-[874px] overflow-hidden border border-dashed border-black/40 bg-white/40"
          style={{ aspectRatio: '16 / 9' }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-sm text-black/40">
            Showcase area (placeholder)
          </div>
        </div>

        <Divider />

        {/* Meta Grid */}
        <div className="w-full max-w-[874px] flex flex-col gap-6 md:flex-row md:gap-10">
          <div className="flex-1 flex flex-col gap-4">
            <MetaSection title="Year">
              {intro.meta?.year ? intro.meta.year : <span className="text-black/40">—</span>}
            </MetaSection>

            <MetaSection title="Keywords">
              {keywords && keywords.length > 0 ? (
                <div className="flex flex-wrap gap-2 text-sm">
                  {keywords.map((keywordItem, index) => (
                    <span
                      key={`${keywordItem.keyword}-${index}`}
                      className="border border-black px-2 py-1 text-xs uppercase tracking-wide"
                    >
                      {keywordItem.keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-black/40">No keywords</span>
              )}
            </MetaSection>

            <MetaSection title="Links">
              {links && links.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {links.map((linkItem, index) => (
                    <CMSLink key={index} {...linkItem} className="underline underline-offset-2 text-base" />
                  ))}
                </div>
              ) : (
                <span className="text-black/40">No links</span>
              )}
            </MetaSection>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <MetaSection title="Roles">
              {roles && roles.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {roles.map((roleItem, index) => (
                    <li key={`${roleItem.role}-${index}`} className="text-base leading-relaxed">
                      {roleItem.role}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-black/40">No roles</span>
              )}
            </MetaSection>
          </div>
        </div>

        <Divider />

        {/* Scroll hint placeholder */}
        <div
          className="relative w-full max-w-[874px] overflow-hidden border border-dashed border-black/40 bg-white/40"
          style={{ aspectRatio: '874 / 160' }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-sm text-black/40">
            Scroll hint placeholder
          </div>
        </div>

        <Divider />
      </div>
    </section>
  )
}

