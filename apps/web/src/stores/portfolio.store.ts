import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project, Skill } from '@/types/project'
import { getProjects } from '@/services'

export const usePortfolioStore = defineStore('portfolio', () => {
  const projects = ref<Project[]>([])
  const skills = ref<Skill[]>([])
  const loading = ref(false)

  async function fetchProjects() {
    loading.value = true
    projects.value = await getProjects()
    loading.value = false
  }

  return { projects, skills, loading, fetchProjects }
})
