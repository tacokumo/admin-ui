import {
	Alert,
	Badge,
	Card,
	Container,
	Group,
	LoadingOverlay,
	Pagination,
	SimpleGrid,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { IconAlertCircle, IconCalendar, IconFolder } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Project } from "../api/@types";
import { PEPABO_BLACK, PEPABO_BLUE } from "../constants/colors";
import { useAdminAPI } from "../hooks/useAdminAPI";

const ITEMS_PER_PAGE = 12;

export function ProjectListPage() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalProjects, setTotalProjects] = useState(0);
	const apiClient = useAdminAPI();
	const navigate = useNavigate();

	const fetchProjects = useCallback(
		async (page: number) => {
			try {
				setLoading(true);
				setError(null);

				const offset = (page - 1) * ITEMS_PER_PAGE;
				const response = await apiClient.v1alpha1.projects.$get({
					query: {
						limit: ITEMS_PER_PAGE,
						offset: offset,
					},
				});

				setProjects(response);
				// Note: APIが総数を返さない場合は、レスポンスの長さで判定
				// 実際のAPIでは総数を返すことが推奨されます
				setTotalProjects(
					response.length === ITEMS_PER_PAGE
						? offset + ITEMS_PER_PAGE + 1
						: offset + response.length,
				);
			} catch (err) {
				console.error("Failed to fetch projects:", err);
				setError("プロジェクトの取得に失敗しました。");
			} finally {
				setLoading(false);
			}
		},
		[apiClient],
	);

	useEffect(() => {
		fetchProjects(currentPage);
	}, [currentPage, fetchProjects]);

	const formatDate = (dateString: string | undefined) => {
		if (!dateString) return "不明";
		try {
			return new Date(dateString).toLocaleDateString("ja-JP", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		} catch {
			return "不明";
		}
	};

	const totalPages = Math.ceil(totalProjects / ITEMS_PER_PAGE);

	if (error) {
		return (
			<Container size="lg">
				<Alert
					icon={<IconAlertCircle size={16} />}
					title="エラー"
					color="red"
					mb="md"
				>
					{error}
				</Alert>
			</Container>
		);
	}

	return (
		<Container size="lg" style={{ position: "relative" }}>
			<LoadingOverlay visible={loading} />

			<Stack gap="md">
				<Group justify="space-between" align="center">
					<div>
						<Title order={1} size="h2" c={PEPABO_BLACK}>
							プロジェクト一覧
						</Title>
						<Text size="sm" c="dimmed">
							{totalProjects}件のプロジェクトが見つかりました
						</Text>
					</div>
				</Group>

				{projects.length === 0 && !loading ? (
					<Card withBorder p="xl" style={{ textAlign: "center" }}>
						<IconFolder
							size={48}
							style={{ color: "var(--mantine-color-gray-5)" }}
						/>
						<Title order={3} mt="md" c="dimmed">
							プロジェクトが見つかりません
						</Title>
						<Text size="sm" c="dimmed" mt="sm">
							まだプロジェクトが作成されていないか、アクセス権限がない可能性があります。
						</Text>
					</Card>
				) : (
					<>
						<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
							{projects.map((project) => (
								<Card
									key={project.id}
									shadow="sm"
									padding="md"
									withBorder
									style={{ cursor: "pointer" }}
									onClick={() => navigate(`/dashboard/projects/${project.id}`)}
								>
									<Stack gap="sm">
										<Group justify="space-between">
											<Text fw={600} size="lg" c={PEPABO_BLACK}>
												{project.name}
											</Text>
											<Badge color="blue" variant="light" size="sm">
												{project.id}
											</Badge>
										</Group>

										{project.description && (
											<Text size="sm" c="dimmed" lineClamp={2}>
												{project.description}
											</Text>
										)}

										<Group gap="xs" mt="auto">
											<IconCalendar
												size={14}
												style={{ color: "var(--mantine-color-gray-6)" }}
											/>
											<Text size="xs" c="dimmed">
												作成日: {formatDate(project.createdAt)}
											</Text>
										</Group>

										{project.updatedAt &&
											project.updatedAt !== project.createdAt && (
												<Group gap="xs">
													<IconCalendar
														size={14}
														style={{ color: "var(--mantine-color-gray-6)" }}
													/>
													<Text size="xs" c="dimmed">
														更新日: {formatDate(project.updatedAt)}
													</Text>
												</Group>
											)}
									</Stack>
								</Card>
							))}
						</SimpleGrid>

						{totalPages > 1 && (
							<Group justify="center" mt="xl">
								<Pagination
									value={currentPage}
									onChange={setCurrentPage}
									total={totalPages}
									size="md"
									color={PEPABO_BLUE}
								/>
							</Group>
						)}
					</>
				)}
			</Stack>
		</Container>
	);
}
