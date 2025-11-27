import React from 'react'

import type { Project } from '@/payload-types'

import { ProjectStepBlock } from './ProjectStepBlock'

type Steps = Project['steps']

interface ProjectStepsSectionProps {
  steps?: Steps | null
}

export function ProjectStepsSection({ steps }: ProjectStepsSectionProps) {
  if (!steps || steps.length === 0) return null

  return (
    <section className="flex w-full flex-col items-center">
      {steps.map((step, index) => (
        <ProjectStepBlock key={step?.id ?? index} index={index + 1} step={step} />
      ))}
    </section>
  )
}

