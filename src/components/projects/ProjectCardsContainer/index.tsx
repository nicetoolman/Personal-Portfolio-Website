import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ProjectCard } from '../ProjectCard'
import type { Project } from '@/payload-types'

/**
 * Project 卡片容器组件
 * 
 * 职责：
 * - 从 Payload 读取 Projects collection 数据
 * - 渲染卡片网格
 * - 处理空状态
 */
export async function ProjectCardsContainer() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    where: {
      _status: {
        equals: 'published',
      },
    },
    depth: 2, // 需要展开 tags relationship 的完整数据
    limit: 100, // 暂时不限制，后续可加分页
    // 不限制 select，确保所有字段都被返回（包括 tags relationship）
  })

  const projects = result.docs as Pick<Project, 'slug' | 'intro'>[]

  if (projects.length === 0) {
    return (
      <div className="w-full py-16 text-center text-secondary">
        <p className="text-body">暂无项目</p>
      </div>
    )
  }

  return (
    <div className="w-full h-auto flex flex-col gap-lg px-md">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  )
}

