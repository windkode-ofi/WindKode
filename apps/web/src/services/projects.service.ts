import { i18n } from '@/i18n'
import type { Project } from '@/types/project'

function tt(key: string): string {
  return i18n.global.t(key)
}

function getProjectsData(): Project[] {
  return [
    {
      id: '1',
      title: tt('projects_data.windkode_landing.title'),
      description: tt('projects_data.windkode_landing.description'),
      tags: ['Vue 3', 'TypeScript', 'TailwindCSS', 'Vite'],
      url: '#',
      repo: '#',
    },
  ]
}

export function getProjects(): Promise<Project[]> {
  return Promise.resolve(getProjectsData())
}

export function getProjectById(id: string): Promise<Project | undefined> {
  return Promise.resolve(getProjectsData().find(p => p.id === id))
}
