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
import { IconAlertCircle, IconCalendar, IconShield } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import type { Role } from "../api/@types";
import { PEPABO_BLACK, PEPABO_BLUE } from "../constants/colors";
import { useAdminAPI } from "../hooks/useAdminAPI";
import { useDefaultProjectId } from "../hooks/useDefaultProjectId";
import { ProjectSelector } from "./ProjectSelector";

const ITEMS_PER_PAGE = 12;

export function RoleListPage() {
	const [roles, setRoles] = useState<Role[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalRoles, setTotalRoles] = useState(0);
	const [selectedProjectId, setSelectedProjectId] = useState<string>("");
	const apiClient = useAdminAPI();
	const { defaultProjectId, projectError, projectLoading } =
		useDefaultProjectId(apiClient);

	// デフォルトプロジェクトIDが取得できたら、それを初期値として設定
	useEffect(() => {
		if (defaultProjectId && !selectedProjectId) {
			setSelectedProjectId(defaultProjectId);
		}
	}, [defaultProjectId, selectedProjectId]);

	const fetchRoles = useCallback(
		async (page: number, projectId: string) => {
			try {
				setLoading(true);
				setError(null);

				const offset = (page - 1) * ITEMS_PER_PAGE;
				// Note: このAPIは実際のAPI仕様に合わせて調整が必要です
				// mockサーバでは全ロールを取得する形になります
				const response = await apiClient.v1alpha1.projects
					._projectId(projectId)
					.roles.$get({
						query: {
							limit: ITEMS_PER_PAGE,
							offset: offset,
						},
					});

				setRoles(response);
				setTotalRoles(
					response.length === ITEMS_PER_PAGE
						? offset + ITEMS_PER_PAGE + 1
						: offset + response.length,
				);
			} catch (err) {
				console.error("Failed to fetch roles:", err);
				setError("ロールの取得に失敗しました。");
			} finally {
				setLoading(false);
			}
		},
		[apiClient],
	);

	useEffect(() => {
		if (!selectedProjectId) {
			return;
		}

		void fetchRoles(currentPage, selectedProjectId);
	}, [currentPage, selectedProjectId, fetchRoles]);

	const handleProjectChange = (projectId: string) => {
		setSelectedProjectId(projectId);
		setCurrentPage(1); // プロジェクト変更時はページを1にリセット
	};

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

	const totalPages = Math.ceil(totalRoles / ITEMS_PER_PAGE);

	const combinedError = projectError ?? error;
	const isLoading = loading || projectLoading;

	if (combinedError) {
		return (
			<Container size="lg">
				<Alert
					icon={<IconAlertCircle size={16} />}
					title="エラー"
					color="red"
					mb="md"
				>
					{combinedError}
				</Alert>
			</Container>
		);
	}

	return (
		<Container size="lg" style={{ position: "relative" }}>
			<LoadingOverlay visible={isLoading} />

			<Stack gap="md">
				<Group justify="space-between" align="center">
					<div>
						<Title order={1} size="h2" c={PEPABO_BLACK}>
							ロール一覧
						</Title>
						<Text size="sm" c="dimmed">
							{totalRoles}件のロールが見つかりました
						</Text>
					</div>
				</Group>

				<ProjectSelector
					value={selectedProjectId}
					onChange={handleProjectChange}
					label="プロジェクトを選択"
					placeholder="プロジェクト名を入力して選択してください"
				/>

				{roles.length === 0 && !loading ? (
					<Card withBorder p="xl" style={{ textAlign: "center" }}>
						<IconShield
							size={48}
							style={{ color: "var(--mantine-color-gray-5)" }}
						/>
						<Title order={3} mt="md" c="dimmed">
							ロールが見つかりません
						</Title>
						<Text size="sm" c="dimmed" mt="sm">
							まだロールが作成されていないか、アクセス権限がない可能性があります。
						</Text>
					</Card>
				) : (
					<>
						<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
							{roles.map((role) => (
								<Card key={role.id} shadow="sm" padding="md" withBorder>
									<Stack gap="sm">
										<Group justify="space-between">
											<Text fw={600} size="lg" c={PEPABO_BLACK}>
												{role.name}
											</Text>
											<Badge color="blue" variant="light" size="sm">
												{role.id}
											</Badge>
										</Group>

										{role.description && (
											<Text size="sm" c="dimmed" lineClamp={2}>
												{role.description}
											</Text>
										)}

										{role.project && (
											<Group gap="xs">
												<Text size="xs" c="dimmed" fw={500}>
													プロジェクト:
												</Text>
												<Text size="xs" c={PEPABO_BLUE}>
													{role.project.name}
												</Text>
											</Group>
										)}

										{role.attributes && role.attributes.length > 0 && (
											<Group gap="xs">
												<Text size="xs" c="dimmed" fw={500}>
													権限:
												</Text>
												<Group gap={4}>
													{role.attributes.map(
														(attr: (typeof role.attributes)[number]) => (
															<Badge key={attr.id} size="xs" variant="outline">
																{attr.name}
															</Badge>
														),
													)}
												</Group>
											</Group>
										)}

										<Group gap="xs" mt="auto">
											<IconCalendar
												size={14}
												style={{ color: "var(--mantine-color-gray-6)" }}
											/>
											<Text size="xs" c="dimmed">
												作成日: {formatDate(role.createdAt)}
											</Text>
										</Group>

										{role.updatedAt && role.updatedAt !== role.createdAt && (
											<Group gap="xs">
												<IconCalendar
													size={14}
													style={{ color: "var(--mantine-color-gray-6)" }}
												/>
												<Text size="xs" c="dimmed">
													更新日: {formatDate(role.updatedAt)}
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
