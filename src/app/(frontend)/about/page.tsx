import type { Metadata } from 'next'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { Media } from '@/components/Media'
import type { AboutPageDecorations as AboutPageDecorationsType } from '@/payload-types'

export default async function AboutPage() {
  const decorationsData: AboutPageDecorationsType = await getCachedGlobal(
    'aboutPageDecorations',
    1,
  )()

  const introSection = decorationsData?.introSection
  return (
    <article>
      {/* 视窗容器：固定宽度 890px，比例 890/633 */}
      <div 
        className="mx-auto border-content border-black border-solid relative overflow-hidden"
        style={{ 
          width: '890px',
          height: '633px', // 890 * 633 / 890 = 633px
          marginTop: 'calc(64px + var(--navbar-height))',
          marginBottom: '64px',
        }}
      >
        {/* 滚动容器 */}
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
          {/* About 内容容器：宽度与视窗一致，高度适应内容，无 padding */}
          <div 
            className="w-full h-auto flex flex-col items-center"
            style={{ width: '890px' }}
          >
            {/* 第一个 Grid 容器：网站简介内容 */}
            <div 
              className="grid overflow-hidden relative shrink-0"
              style={{
                width: '890px',
                height: '635px',
                padding: '3px 8px',
                rowGap: '6px',
                columnGap: '6px',
                gridTemplateRows: 'repeat(8, minmax(0, 1fr))',
                gridTemplateColumns: 'repeat(13, minmax(0, 1fr))',
              }}
            >
              {/* 子容器 1：CATBOX 标题区域 (1, 1, 3, 3) */}
              <div 
                className="grid overflow-hidden shrink-0 relative"
                style={{
                  width: '197px',
                  height: '232.125px',
                  rowGap: '10px',
                  columnGap: '10px',
                  flexShrink: 0,
                  gridTemplateRows: 'repeat(1, minmax(0, 1fr))',
                  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                  gridRow: '1 / span 3',
                  gridColumn: '1 / span 3',
                  justifySelf: 'start',
                }}
              >
                {introSection?.level3 && typeof introSection.level3 === 'object' && (
                  <Media
                    resource={introSection.level3}
                    htmlElement="div"
                    className="absolute inset-0"
                    imgClassName="object-contain w-full h-full"
                    fill
                  />
                )}
              </div>

              {/* 子容器 2：主要内容区域 (6, 1, 8, 8) */}
              <div 
                className="grid overflow-hidden shrink-0 relative"
                style={{
                  width: '536px',
                  height: '629px',
                  padding: '8px',
                  rowGap: '8px',
                  columnGap: '8px',
                  flexShrink: 0,
                  gridTemplateRows: 'repeat(13, minmax(0, 1fr))',
                  gridTemplateColumns: 'repeat(13, minmax(0, 1fr))',
                  gridRow: '1 / span 8',
                  gridColumn: '6 / span 8',
                  justifySelf: 'start',
                }}
              >
                {/* 图片容器：绝对定位填充整个容器（包括 padding 区域） */}
                {introSection?.level1 && typeof introSection.level1 === 'object' && (
                  <div className="absolute inset-0">
                    <Media
                      resource={introSection.level1}
                      htmlElement="div"
                      className="absolute inset-0"
                      imgClassName="object-contain w-full h-full"
                      fill
                    />
                  </div>
                )}
              </div>

              {/* 子容器 3：Created by 区域 (4, 1, 2, 2) */}
              <div 
                className="grid overflow-hidden relative"
                style={{
                  rowGap: '10px',
                  columnGap: '10px',
                  flex: '1 0 0',
                  alignSelf: 'stretch',
                  gridTemplateRows: 'repeat(1, minmax(0, 1fr))',
                  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                  gridRow: '1 / span 2',
                  gridColumn: '4 / span 2',
                }}
              >
                {introSection?.level4 && typeof introSection.level4 === 'object' && (
                  <Media
                    resource={introSection.level4}
                    htmlElement="div"
                    className="absolute inset-0"
                    imgClassName="object-contain w-full h-full"
                    fill
                  />
                )}
              </div>

              {/* 子容器 4：左侧插画区域 (1, 4, 5, 5) */}
              <div 
                className="grid overflow-hidden shrink-0 relative"
                style={{
                  width: '332px',
                  height: '390.875px',
                  rowGap: '10px',
                  columnGap: '10px',
                  flexShrink: 0,
                  gridTemplateRows: 'repeat(1, minmax(0, 1fr))',
                  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                  gridRow: '4 / span 5',
                  gridColumn: '1 / span 5',
                  justifySelf: 'start',
                }}
              >
                {introSection?.level2 && typeof introSection.level2 === 'object' && (
                  <Media
                    resource={introSection.level2}
                    htmlElement="div"
                    className="absolute inset-0"
                    imgClassName="object-contain w-full h-full"
                    fill
                  />
                )}
              </div>

              {/* 子容器 5：Visual sandbox 标签 (4, 3, 1, 1) */}
              <div 
                className="flex flex-col justify-center overflow-hidden relative"
                style={{
                  flex: '1 0 0',
                  alignSelf: 'stretch',
                  gridRow: '3 / span 1',
                  gridColumn: '4 / span 1',
                }}
              >
                {introSection?.level5_1 && typeof introSection.level5_1 === 'object' && (
                  <Media
                    resource={introSection.level5_1}
                    htmlElement="div"
                    className="absolute inset-0"
                    imgClassName="object-contain w-full h-full"
                    fill
                  />
                )}
              </div>

              {/* 子容器 6：clarity through design 标签 (5, 3, 1, 1) */}
              <div 
                className="grid overflow-hidden shrink-0 relative"
                style={{
                  width: '63px',
                  height: '73.375px',
                  rowGap: '10px',
                  columnGap: '10px',
                  flexShrink: 0,
                  gridTemplateRows: 'repeat(1, minmax(0, 1fr))',
                  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                  gridRow: '3 / span 1',
                  gridColumn: '5 / span 1',
                }}
              >
                {introSection?.level5_2 && typeof introSection.level5_2 === 'object' && (
                  <Media
                    resource={introSection.level5_2}
                    htmlElement="div"
                    className="absolute inset-0"
                    imgClassName="object-contain w-full h-full"
                    fill
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About | CATBOX',
    description: 'About MING ZU - A researcher turned visual creator based in Japan.',
  }
}
