import type { Metadata } from 'next'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { Media } from '@/components/Media'
import { AboutPageInteractiveCard } from '@/components/AboutPageInteractiveCard'
import type { AboutPageDecoration as AboutPageDecorationType } from '@/payload-types'

export default async function AboutPage() {
  const decorationsData: AboutPageDecorationType = await getCachedGlobal(
    'aboutPageDecorations',
    1,
  )()

  const introSection = decorationsData?.introSection
  const decorationSection1 = decorationsData?.decorationSection1
  const decorationSection2 = decorationsData?.decorationSection2
  const decorationSection3 = decorationsData?.decorationSection3
  const resumeSection = decorationsData?.resumeSection
  return (
    <article>
      {/* 视窗容器：视口宽度 > 890px 时固定 890px，≤ 890px 时按比例缩放 */}
      <div 
        className="mx-auto relative overflow-hidden"
        style={{ 
          maxWidth: '890px',
          width: '100%',
          aspectRatio: '890/633',
          marginTop: 'calc(64px + var(--navbar-height))',
          marginBottom: '64px',
        }}
      >
        {/* 滚动容器：使用 about-scroll-container 控制滚动条样式 */}
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden about-scroll-container">
          {/* About 内容容器：宽度与视窗容器一致，高度适应内容 */}
          <div 
            className="w-full h-auto flex flex-col items-center"
            style={{ width: '100%' }}
          >
            {/* Grid 容器：宽度与 About 内容容器一致，比例 890/635，所有属性按比例变化 */}
            <div
              className="grid overflow-hidden relative shrink-0 w-full"
              style={{
                width: '100%', // 与 About 内容容器宽度一致
                aspectRatio: '890/635', // 保持 Grid 容器的宽高比
                padding: 'calc(100% * 3 / 890) calc(100% * 8 / 890)', // 按比例变化
                rowGap: '6', // 按比例变化
                columnGap: '6', // 按比例变化
                gridTemplateRows: 'repeat(8, minmax(0, 1fr))',
                gridTemplateColumns: 'repeat(13, minmax(0, 1fr))',
              }}
            >
              {/* 子容器 1：CATBOX 标题区域 (1, 1, 3, 3) */}
              <div
                className="grid overflow-hidden shrink-0 relative"
                style={{
                  aspectRatio: '197/232.125',
                  rowGap: 'calc(100% * 10 / 890)', // 基于 Grid 容器宽度按比例
                  columnGap: 'calc(100% * 10 / 890)', // 基于 Grid 容器宽度按比例
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
                  aspectRatio: '536/629',
                  padding: 'calc(100% * 8 / 890)', // 基于 Grid 容器宽度按比例
                  rowGap: 'calc(100% * 8 / 890)', // 基于 Grid 容器宽度按比例
                  columnGap: 'calc(100% * 8 / 890)', // 基于 Grid 容器宽度按比例
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
                  rowGap: 'calc(100% * 10 / 890)', // 基于 Grid 容器宽度按比例
                  columnGap: 'calc(100% * 10 / 890)', // 基于 Grid 容器宽度按比例
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
                  aspectRatio: '332/390.875',
                  rowGap: 'calc(100% * 10 / 890)', // 基于 Grid 容器宽度按比例
                  columnGap: 'calc(100% * 10 / 890)', // 基于 Grid 容器宽度按比例
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
                  aspectRatio: '63/73.375',
                  rowGap: 'calc(100% * 10 / 890)', // 基于 Grid 容器宽度按比例
                  columnGap: 'calc(100% * 10 / 890)', // 基于 Grid 容器宽度按比例
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

            {/* About 装饰区 1：890 × 168 图片容器 */}
            {decorationSection1 && typeof decorationSection1 === 'object' && (
              <div
                className="w-full"
                style={{
                  aspectRatio: '890/168',
                }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Media
                    resource={decorationSection1}
                    htmlElement="div"
                    className="absolute inset-0"
                    imgClassName="object-contain w-full h-full"
                    fill
                  />
                </div>
              </div>
            )}

            {/* Resume 容器：与简介区相同结构（31 行 × 1 列） */}
            <div 
              className="grid overflow-hidden relative shrink-0 w-full"
              style={{
                width: '100%',
                aspectRatio: '890/1496.687',
                padding: 'calc(100% * 3 / 890) calc(100% * 8 / 890)',
                rowGap: '6',
                gridTemplateRows: 'repeat(31, minmax(0, 1fr))',
                gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
              }}
            >
              <div className="relative overflow-hidden" style={{ gridRow: '1 / span 1' }}>
                {resumeSection?.headline && typeof resumeSection.headline === 'object' && (
                  <Media
                    resource={resumeSection.headline}
                    htmlElement="div"
                    className="absolute inset-0"
                    imgClassName="object-contain w-full h-full"
                    fill
                  />
                )}
              </div>
              <div className="relative overflow-hidden" style={{ gridRow: '2 / span 3' }}>
                {resumeSection?.basicInfoBackground &&
                  typeof resumeSection.basicInfoBackground === 'object' && (
                    <Media
                      resource={resumeSection.basicInfoBackground}
                      htmlElement="div"
                      className="absolute inset-0"
                      imgClassName="object-cover w-full h-full"
                      fill
                    />
                  )}
                <div
                  className="grid h-full w-full relative z-10"
                  style={{
                    padding: 'calc(100% * 8 / 890)',
                    columnGap: '6px',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  }}
                >
                  <div className="relative w-full h-full overflow-hidden">
                    {resumeSection?.basicInfoLeft && typeof resumeSection.basicInfoLeft === 'object' && (
                      <Media
                        resource={resumeSection.basicInfoLeft}
                        htmlElement="div"
                        className="absolute inset-0"
                        imgClassName="object-contain w-full h-full"
                        fill
                      />
                    )}
                  </div>
                  <div className="relative w-full h-full overflow-hidden">
                    {resumeSection?.basicInfoRightClosed &&
                      resumeSection?.basicInfoRightOpen &&
                      typeof resumeSection.basicInfoRightClosed === 'object' &&
                      typeof resumeSection.basicInfoRightOpen === 'object' && (
                        <AboutPageInteractiveCard
                          closedImage={resumeSection.basicInfoRightClosed}
                          openImage={resumeSection.basicInfoRightOpen}
                        />
                      )}
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden" style={{ gridRow: '5 / span 4' }}>
                {resumeSection?.resumeIntro && typeof resumeSection.resumeIntro === 'object' && (
                  <Media
                    resource={resumeSection.resumeIntro}
                    htmlElement="div"
                    className="absolute inset-0"
                    imgClassName="object-contain w-full h-full"
                    fill
                  />
                )}
              </div>
              <div className="relative overflow-hidden" style={{ gridRow: '9 / span 6' }}>
                {/* 背景图片 */}
                {resumeSection?.resumeGridBackground &&
                  typeof resumeSection.resumeGridBackground === 'object' && (
                    <Media
                      resource={resumeSection.resumeGridBackground}
                      htmlElement="div"
                      className="absolute inset-0"
                      imgClassName="object-cover w-full h-full"
                      fill
                    />
                  )}
                {/* 内部 Grid 容器：确保内容在背景之上 */}
                <div
                  className="grid h-full w-full relative z-10"
                  style={{
                    padding: 'calc(100% * 8 / 890)',
                    rowGap: '6px',
                    columnGap: '6px',
                    gridTemplateRows: '28px minmax(0, 1fr)',
                    gridTemplateColumns: 'calc(100% * 576 / 890) minmax(0, 1fr)',
                    flex: '1 0 0',
                    alignSelf: 'stretch',
                  }}
                >
                  {/* 左子容器：占据整个第一列 - 图片容器 */}
                  <div
                    className="relative overflow-hidden"
                    style={{
                      gridRow: '1 / span 2',
                      gridColumn: '1',
                    }}
                  >
                    {resumeSection?.resumeGridLeft &&
                      typeof resumeSection.resumeGridLeft === 'object' && (
                        <Media
                          resource={resumeSection.resumeGridLeft}
                          htmlElement="div"
                          className="absolute inset-0"
                          imgClassName="object-contain w-full h-full"
                          fill
                        />
                      )}
                  </div>
                  {/* 右子容器：占据第二行第二列 - 交互组件 */}
                  <div
                    className="relative overflow-hidden"
                    style={{
                      gridRow: '2',
                      gridColumn: '2',
                    }}
                  >
                    {resumeSection?.resumeGridRightClosed &&
                      resumeSection?.resumeGridRightOpen &&
                      typeof resumeSection.resumeGridRightClosed === 'object' &&
                      typeof resumeSection.resumeGridRightOpen === 'object' && (
                        <AboutPageInteractiveCard
                          closedImage={resumeSection.resumeGridRightClosed}
                          openImage={resumeSection.resumeGridRightOpen}
                        />
                      )}
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden" style={{ gridRow: '15 / span 5' }}>
                {resumeSection?.resumeSection5 && typeof resumeSection.resumeSection5 === 'object' && (
                  <Media
                    resource={resumeSection.resumeSection5}
                    htmlElement="div"
                    className="absolute inset-0"
                    imgClassName="object-contain w-full h-full"
                    fill
                  />
                )}
              </div>
              <div className="relative overflow-hidden" style={{ gridRow: '20 / span 12' }}>
                {resumeSection?.resumeSection6 && typeof resumeSection.resumeSection6 === 'object' && (
                  <Media
                    resource={resumeSection.resumeSection6}
                    htmlElement="div"
                    className="absolute inset-0"
                    imgClassName="object-contain w-full h-full"
                    fill
                  />
                )}
              </div>
            </div>

            {/* About 装饰区 2：890 × 788.667 图片容器 */}
            {decorationSection2 && typeof decorationSection2 === 'object' && (
              <div
                className="w-full"
                style={{
                  aspectRatio: '890/788.667',
                }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Media
                    resource={decorationSection2}
                    htmlElement="div"
                    className="absolute inset-0"
                    imgClassName="object-contain w-full h-full"
                    fill
                  />
                </div>
              </div>
            )}

            {/* About 装饰区 3：890 × 633 图片容器 */}
            {decorationSection3 && typeof decorationSection3 === 'object' && (
              <div
                className="w-full"
                style={{
                  aspectRatio: '890/633',
                }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Media
                    resource={decorationSection3}
                    htmlElement="div"
                    className="absolute inset-0"
                    imgClassName="object-contain w-full h-full"
                    fill
                  />
                </div>
              </div>
            )}
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
