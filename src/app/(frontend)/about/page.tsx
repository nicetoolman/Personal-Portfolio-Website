import type { Metadata } from 'next'

export default function AboutPage() {
  return (
    <article>
      {/* 视窗容器：固定宽度 890px，比例 890/633 */}
      <div 
        className="mx-auto border-content border-black border-solid relative"
        style={{ 
          width: '890px',
          height: '633px', // 890 * 633 / 890 = 633px
          marginTop: 'calc(64px + var(--navbar-height))',
          marginBottom: '64px',
        }}
      >
        {/* 视窗内容将从这里开始 */}
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
