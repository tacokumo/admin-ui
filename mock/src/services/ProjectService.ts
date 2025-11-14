import type {
	CreateProjectRequest,
	Project,
	UpdateProjectRequest,
} from "../types/api.js";
import { NotFoundError } from "./errors.js";

type ProjectRecord = Project & {
	ownerIds: string[];
	ownerGroupIds: string[];
};

export class ProjectService {
	private projects = new Map<string, ProjectRecord>();
	private nextId = 1;

	constructor() {
		this.seedInitialData();
	}

	private seedInitialData() {
		const seeds: CreateProjectRequest[] = [
			{
				name: "Research Vault",
				description: "Personal project for internal research documents.",
				kind: "personal",
				ownerIds: ["user-1"],
				ownerGroupIds: [],
			},
			{
				name: "Shared Workspace",
				description: "Collaboration space for the operations team.",
				kind: "shared",
				ownerIds: ["user-2"],
				ownerGroupIds: ["group-1"],
			},
		];

		for (const payload of seeds) {
			this.createProject(payload);
		}
	}

	private nextProjectId(): string {
		return `project-${this.nextId++}`;
	}

	private sanitize(record: ProjectRecord): Project {
		const {
			ownerIds: _ownerIds,
			ownerGroupIds: _ownerGroupIds,
			...project
		} = record;
		return project;
	}

	list(limit: number, offset: number): Project[] {
		return Array.from(this.projects.values())
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			)
			.slice(offset, offset + limit)
			.map((record) => this.sanitize(record));
	}

	createProject(payload: CreateProjectRequest): Project {
		const now = new Date().toISOString();
		const record: ProjectRecord = {
			id: this.nextProjectId(),
			name: payload.name,
			description: payload.description,
			kind: payload.kind,
			ownerIds: [...payload.ownerIds],
			ownerGroupIds: [...payload.ownerGroupIds],
			createdAt: now,
			updatedAt: now,
		};

		this.projects.set(record.id, record);
		return this.sanitize(record);
	}

	getProject(projectId: string): Project | undefined {
		const record = this.projects.get(projectId);
		return record ? this.sanitize(record) : undefined;
	}

	requireProject(projectId: string): Project {
		const project = this.getProject(projectId);
		if (!project) {
			throw new NotFoundError("Project not found");
		}

		return project;
	}

	updateProject(projectId: string, payload: UpdateProjectRequest): Project {
		const existing = this.projects.get(projectId);
		if (!existing) {
			throw new NotFoundError("Project not found");
		}

		const updated: ProjectRecord = {
			...existing,
			name: payload.name,
			description: payload.description,
			ownerIds: [...payload.ownerIds],
			ownerGroupIds: [...payload.ownerGroupIds],
			updatedAt: new Date().toISOString(),
		};

		this.projects.set(projectId, updated);
		return this.sanitize(updated);
	}

	getAll(): Project[] {
		return Array.from(this.projects.values()).map((record) =>
			this.sanitize(record),
		);
	}
}
