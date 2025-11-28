import React from 'react'

import type { Media as MediaType, Project } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { ProjectShowcase } from '@/components/projects/ProjectShowcase'
import { getCachedGlobal } from '@/utilities/getGlobals'

type ProjectDetailPageIntroGlobal = {
  scrollHintImage?: MediaType | number | string | null
} | null

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
    <div className="flex flex-col gap-0.5">
      <p className="text-heading-sm font-medium font-['Roboto_Condensed'] text-black">{`${title}:`}</p>
      <div className="text-body leading-relaxed text-black">{children}</div>
    </div>
  )
}

export async function ProjectIntro({ intro }: ProjectIntroProps) {
  if (!intro) {
    return null
  }

  const projectDetailIntroGlobal = (await getCachedGlobal('projectDetailPageIntro', 1)()) as ProjectDetailPageIntroGlobal
  const scrollHintImage = projectDetailIntroGlobal?.scrollHintImage ?? null

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
        className="flex w-full flex-col gap-md"
        style={{
          maxWidth: 'var(--layout-content-width)',
          padding,
        }}
      >
        {/* Title Group */}
        {(intro.titleGroup?.title || intro.titleGroup?.subtitle) && (
          <div className="w-full flex flex-col items-center gap-md text-center">
            {intro.titleGroup?.title && (
              <RichText
                data={intro.titleGroup.title}
                enableProse={false}
                enableGutter={false}
                className="text-display font-black leading-tight tracking-tight font-['Roboto_Condensed']"
              />
            )}
            {intro.titleGroup?.subtitle && (
              <RichText
                data={intro.titleGroup.subtitle}
                enableProse={false}
                enableGutter={false}
                className="text-heading-lg font-black leading-tight tracking-tight font-['Roboto_Condensed']"
              />
            )}
          </div>
        )}

        {/* Hero Viewport */}
        <div
          className="relative w-full overflow-hidden border border-black"
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
            <div className="absolute inset-0 flex items-center justify-center text-caption text-black/40">
              Hero image placeholder
            </div>
          )}
        </div>

        {/* Content Blocks */}
        <div className="w-full flex flex-col gap-md">
          {contentBlocks.map((block) => {
            if (!block.value) return null
            return (
              <div key={block.key} className="flex flex-col gap-0.5">
                <p className="text-heading-sm font-bold font-['Roboto'] text-black">{`${block.label}:`}</p>
                <RichText
                  data={block.value}
                  enableGutter={false}
                  enableProse={false}
                  className="text-body-lg leading-relaxed"
                />
              </div>
            )
          })}
        </div>

        {/* Showcase */}
        <ProjectShowcase items={intro.showcaseImages} />

        <Divider />

        {/* Meta Grid */}
        <div className="w-full flex flex-col gap-xl md:flex-row md:gap-3xl">
          <div className="flex-1 flex flex-col gap-md">
            <MetaSection title="Year">
              {intro.meta?.year ? intro.meta.year : <span className="text-black/40">—</span>}
            </MetaSection>

            <MetaSection title="Keywords">
              {keywords && keywords.length > 0 ? (
                <div className="flex flex-wrap gap-md text-caption">
                  {keywords.map((keywordItem, index) => (
                    <span
                      key={`${keywordItem.keyword}-${index}`}
                      className="border border-black px-md py-xs text-caption uppercase tracking-wide"
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
                <div className="flex flex-col gap-xs">
                  {links.map((linkItem, index) => (
                    <CMSLink key={index} {...linkItem} className="underline underline-offset-2 text-body" />
                  ))}
                </div>
              ) : (
                <span className="text-black/40">No links</span>
              )}
            </MetaSection>
          </div>

          <div className="flex-1 flex flex-col gap-lg">
            <MetaSection title="Roles">
              {roles && roles.length > 0 ? (
                <ul className="flex flex-col gap-xs">
                  {roles.map((roleItem, index) => (
                    <li key={`${roleItem.role}-${index}`} className="text-body leading-relaxed">
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

        {/* Scroll hint */}
        <div className="relative w-full overflow-hidden border border-black" style={{ aspectRatio: '874 / 160' }}>
          {scrollHintImage ? (
            <Media
              resource={scrollHintImage}
              htmlElement="div"
              className="absolute inset-0"
              imgClassName="object-cover w-full h-full"
              fill
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-caption text-black/40">
              Scroll hint placeholder
            </div>
          )}
        </div>

        <Divider />
      </div>
    </section>
  )
}

