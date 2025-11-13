export interface Project {
  id: string
  name: string
  bio?: string
  createdAt: string
  updatedAt: string
}

export interface CreateProjectRequest {
  name: string
  bio?: string
}