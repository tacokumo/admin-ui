/* eslint-disable */
export type HealthResponse = {
  status: string;
}

export type ErrorResponse = {
  error?: string | undefined;
}

export type Project = {
  id: string;
  name: string;
  bio?: string | null | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export type CreateProjectRequest = {
  name: string;
  bio?: string | null | undefined;
}
