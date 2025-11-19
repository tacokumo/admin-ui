import type { AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useState } from "react";
import type { Project } from "../api/@types";

type ProjectListApiClient = {
	v1alpha1: {
		projects: {
			$get: (option: {
				query: { limit: number; offset: number };
				config?: AxiosRequestConfig | undefined;
			}) => Promise<Project[]>;
		};
	};
};

type UseDefaultProjectIdResult = {
	defaultProjectId: string | null;
	projectLoading: boolean;
	projectError: string | null;
	reloadDefaultProject: () => Promise<void>;
};

export const useDefaultProjectId = (
	apiClient: ProjectListApiClient,
): UseDefaultProjectIdResult => {
	const [defaultProjectId, setDefaultProjectId] = useState<string | null>(null);
	const [projectLoading, setProjectLoading] = useState(true);
	const [projectError, setProjectError] = useState<string | null>(null);

	const reloadDefaultProject = useCallback(async () => {
		setProjectLoading(true);
		setProjectError(null);

		try {
			const projects = await apiClient.v1alpha1.projects.$get({
				query: {
					limit: 1,
					offset: 0,
				},
			});
			const project = projects[0];
			if (!project) {
				setDefaultProjectId(null);
				setProjectError("プロジェクトが存在しません。");
				return;
			}

			setDefaultProjectId(project.id);
		} catch (err) {
			console.error("Failed to load default project:", err);
			setDefaultProjectId(null);
			setProjectError("プロジェクトの取得に失敗しました。");
		} finally {
			setProjectLoading(false);
		}
	}, [apiClient]);

	useEffect(() => {
		void reloadDefaultProject();
	}, [reloadDefaultProject]);

	return {
		defaultProjectId,
		projectLoading,
		projectError,
		reloadDefaultProject,
	};
};

export default useDefaultProjectId;
