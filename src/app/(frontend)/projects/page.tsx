import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects | CATBOX',
  description: 'Projects list is under construction.',
}

export default function ProjectsPage() {
  return (
    <article className="pt-[calc(var(--navbar-height)+64px)] pb-16">
      <div className="mx-auto w-full max-w-[890px] px-4 md:px-0">
        <div className="w-full aspect-[890/633] border border-black/30 box-content flex items-center justify-center bg-[var(--background)] text-secondary">
          <p className="text-center text-lg">Project 列表页建设中</p>
        </div>
      </div>
    </article>
  )
}


