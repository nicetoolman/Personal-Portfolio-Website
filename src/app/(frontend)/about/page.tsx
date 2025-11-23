import type { Metadata } from 'next'

export default function AboutPage() {
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
                className="grid border-content border-black border-solid overflow-hidden shrink-0"
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
                {/* 子容器内容将从这里开始逐步添加 */}
              </div>

              {/* 子容器 2：主要内容区域 (6, 1, 8, 8) */}
              <div 
                className="grid border-content border-black border-solid overflow-hidden shrink-0"
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
                {/* 子容器内容将从这里开始逐步添加 */}
              </div>

              {/* 子容器 3：Created by 区域 (4, 1, 2, 2) */}
              <div 
                className="grid border-content border-black border-solid overflow-hidden"
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
                {/* 子容器内容将从这里开始逐步添加 */}
              </div>

              {/* 子容器 4：左侧插画区域 (1, 4, 5, 5) */}
              <div 
                className="grid border-content border-black border-solid overflow-hidden shrink-0"
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
                {/* 子容器内容将从这里开始逐步添加 */}
              </div>

              {/* 子容器 5：Visual sandbox 标签 (4, 3, 1, 1) */}
              <div 
                className="flex flex-col justify-center border-content border-black border-solid overflow-hidden"
                style={{
                  flex: '1 0 0',
                  alignSelf: 'stretch',
                  gridRow: '3 / span 1',
                  gridColumn: '4 / span 1',
                }}
              >
                {/* 子容器内容将从这里开始逐步添加 */}
              </div>

              {/* 子容器 6：clarity through design 标签 (5, 3, 1, 1) */}
              <div 
                className="grid border-content border-black border-solid overflow-hidden shrink-0"
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
                {/* 子容器内容将从这里开始逐步添加 */}
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
