export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  image?: string
  url?: string
  repo?: string
}

export interface Skill {
  name: string
  category: 'frontend' | 'backend' | 'devops' | 'tools'
  level: number
  icon?: string
}

export interface ContactForm {
  name: string
  email: string
  message: string
}
