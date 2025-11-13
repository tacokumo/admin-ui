import type { Project, CreateProjectRequest } from '../types/Project.js'

export class ProjectService {
  private projects = new Map<string, Project>()
  private nextId = 1

  constructor() {
    // 初期データがあれば設定
    this.seedInitialData()
  }

  private seedInitialData() {
    // テスト用の初期データ
    this.createProject('サンプルプロジェクト', 'これはテスト用のプロジェクトです')
  }

  createProject(name: string, bio?: string): Project {
    const id = (this.nextId++).toString()
    const now = new Date().toISOString()

    const project: Project = {
      id,
      name,
      bio,
      createdAt: now,
      updatedAt: now
    }

    this.projects.set(id, project)
    return project
  }

  getProjects(limit: number = 10, offset: number = 0): Project[] {
    const allProjects = Array.from(this.projects.values())
    return allProjects
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit)
  }

  getProject(id: string): Project | undefined {
    return this.projects.get(id)
  }

  updateProject(id: string, updates: Partial<Pick<Project, 'name' | 'bio'>>): Project | null {
    const project = this.projects.get(id)
    if (!project) return null

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    this.projects.set(id, updatedProject)
    return updatedProject
  }

  deleteProject(id: string): boolean {
    return this.projects.delete(id)
  }

  getTotalCount(): number {
    return this.projects.size
  }
}

// シングルトンインスタンス
export const projectService = new ProjectService()