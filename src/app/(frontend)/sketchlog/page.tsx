import type { Metadata } from 'next'

import { LayoutViewport } from '@/components/LayoutViewport'
import { SketchlogCard } from '@/components/sketchlog/SketchlogCard'
import { fetchSketchlogs } from '@/lib/sketchlogs/fetchSketchlogs'

export const metadata: Metadata = {
  title: 'Sketchlog | CATBOX',
  description: '速写 / 草图 / 过程图的时间线。所有内容都在这个 feed 里完成。',
}

export default async function SketchlogPage() {
  const entries = await fetchSketchlogs()

  return (
    <article>
      <LayoutViewport variant="narrow" scrollable={true}>
        <div className="px-4 sm:px-6 lg:px-0 py-10">
          {/* Content */}
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">
                还没有 Sketchlog。去 Payload 后台新建一条 Sketchlog entry 吧 ✏️
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {entries.map((entry) => (
                <SketchlogCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </LayoutViewport>
    </article>
  )
}

