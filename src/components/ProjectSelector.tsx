import { Autocomplete, Loader } from "@mantine/core";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "../api/@types";
import { useAdminAPI } from "../hooks/useAdminAPI";

interface ProjectSelectorProps {
	value: string;
	onChange: (projectId: string) => void;
	placeholder?: string;
	label?: string;
}

export function ProjectSelector({
	value,
	onChange,
	placeholder = "プロジェクト名を入力",
	label = "プロジェクト",
}: ProjectSelectorProps) {
	const timeoutRef = useRef<number>(-1);
	const [searchValue, setSearchValue] = useState("");
	const [loading, setLoading] = useState(false);
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedProjectName, setSelectedProjectName] = useState("");
	const [userHasCleared, setUserHasCleared] = useState(false);
	const apiClient = useAdminAPI();

	const fetchProjectById = useCallback(
		async (projectId: string) => {
			try {
				const project = await apiClient.v1alpha1.projects
					._projectId(projectId)
					.$get();
				setSelectedProjectName(project.name);
				setSearchValue(project.name);
			} catch (error) {
				console.error("Failed to fetch project by id:", error);
			}
		},
		[apiClient],
	);

	// 初期値を設定（プロジェクトIDから名前を取得）
	// ただし、ユーザーが明示的にクリアした場合は自動復元しない
	useEffect(() => {
		if (value && !selectedProjectName && !userHasCleared) {
			void fetchProjectById(value);
		}
	}, [value, selectedProjectName, userHasCleared, fetchProjectById]);

	const fetchProjects = async (query: string) => {
		try {
			setLoading(true);
			const response = await apiClient.v1alpha1.projects.$get({
				query: {
					limit: 10,
					offset: 0,
				},
			});

			// クエリでフィルタリング（名前で部分一致）
			const filteredProjects = query.trim()
				? response.filter((project) =>
						project.name.toLowerCase().includes(query.toLowerCase()),
					)
				: response;

			setProjects(filteredProjects);
		} catch (error) {
			console.error("Failed to fetch projects:", error);
			setProjects([]);
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (val: string) => {
		window.clearTimeout(timeoutRef.current);
		setSearchValue(val);
		setProjects([]);

		if (val.trim().length === 0) {
			setLoading(false);
			setSelectedProjectName("");
			setUserHasCleared(true); // ユーザーが明示的にクリアしたことを記録
			onChange(""); // 親コンポーネントに空の状態を通知
			return;
		}

		setLoading(true);
		timeoutRef.current = window.setTimeout(() => {
			fetchProjects(val);
		}, 300);
	};

	const handleSelect = (projectName: string) => {
		const selectedProject = projects.find((p) => p.name === projectName);
		if (selectedProject) {
			setSelectedProjectName(projectName);
			setUserHasCleared(false); // プロジェクトが選択されたらクリアフラグをリセット
			onChange(selectedProject.id);
		}
	};

	// 外部からvalueが変更された場合、userHasClearedをリセット
	// ただし、valueが存在する場合のみ（空文字列やundefinedの場合はリセットしない）
	useEffect(() => {
		if (value && value !== selectedProjectName) {
			setUserHasCleared(false);
		}
	}, [value, selectedProjectName]);

	return (
		<Autocomplete
			value={searchValue}
			data={projects.map((project) => project.name)}
			onChange={handleChange}
			onOptionSubmit={handleSelect}
			rightSection={loading ? <Loader size={16} /> : null}
			label={label}
			placeholder={placeholder}
			clearable
			limit={10}
		/>
	);
}
