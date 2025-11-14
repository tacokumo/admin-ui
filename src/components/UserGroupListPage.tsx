import {
	Alert,
	Avatar,
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
import { IconAlertCircle, IconCalendar, IconUsers } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import type { UserGroup } from "../api/@types";
import { PEPABO_BLACK, PEPABO_BLUE } from "../constants/colors";
import { useAdminAPI } from "../hooks/useAdminAPI";
import { useDefaultProjectId } from "../hooks/useDefaultProjectId";
import { ProjectSelector } from "./ProjectSelector";

const ITEMS_PER_PAGE = 12;

export function UserGroupListPage() {
	const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalUserGroups, setTotalUserGroups] = useState(0);
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

	const fetchUserGroups = useCallback(
		async (page: number, projectId: string) => {
			try {
				setLoading(true);
				setError(null);

				const offset = (page - 1) * ITEMS_PER_PAGE;
				// Note: このAPIは実際のAPI仕様に合わせて調整が必要です
				// mockサーバでは全ユーザグループを取得する形になります
				const response = await apiClient.v1alpha1.projects
					._projectId(projectId)
					.usergroups.$get({
						query: {
							limit: ITEMS_PER_PAGE,
							offset: offset,
						},
					});

				setUserGroups(response);
				setTotalUserGroups(
					response.length === ITEMS_PER_PAGE
						? offset + ITEMS_PER_PAGE + 1
						: offset + response.length,
				);
			} catch (err) {
				console.error("Failed to fetch user groups:", err);
				setError("ユーザグループの取得に失敗しました。");
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

		void fetchUserGroups(currentPage, selectedProjectId);
	}, [currentPage, selectedProjectId, fetchUserGroups]);

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

	const totalPages = Math.ceil(totalUserGroups / ITEMS_PER_PAGE);

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
							ユーザグループ一覧
						</Title>
						<Text size="sm" c="dimmed">
							{totalUserGroups}件のユーザグループが見つかりました
						</Text>
					</div>
				</Group>

				<ProjectSelector
					value={selectedProjectId}
					onChange={handleProjectChange}
					label="プロジェクトを選択"
					placeholder="プロジェクト名を入力して選択してください"
				/>

				{userGroups.length === 0 && !loading ? (
					<Card withBorder p="xl" style={{ textAlign: "center" }}>
						<IconUsers
							size={48}
							style={{ color: "var(--mantine-color-gray-5)" }}
						/>
						<Title order={3} mt="md" c="dimmed">
							ユーザグループが見つかりません
						</Title>
						<Text size="sm" c="dimmed" mt="sm">
							まだユーザグループが作成されていないか、アクセス権限がない可能性があります。
						</Text>
					</Card>
				) : (
					<>
						<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
							{userGroups.map((group) => (
								<Card key={group.id} shadow="sm" padding="md" withBorder>
									<Stack gap="sm">
										<Group justify="space-between">
											<Text fw={600} size="lg" c={PEPABO_BLACK}>
												{group.name}
											</Text>
											<Badge color="blue" variant="light" size="sm">
												{group.id}
											</Badge>
										</Group>

										{group.description && (
											<Text size="sm" c="dimmed" lineClamp={2}>
												{group.description}
											</Text>
										)}

										{group.project && (
											<Group gap="xs">
												<Text size="xs" c="dimmed" fw={500}>
													プロジェクト:
												</Text>
												<Text size="xs" c={PEPABO_BLUE}>
													{group.project.name}
												</Text>
											</Group>
										)}

										{group.members && group.members.length > 0 && (
											<div>
												<Group gap="xs" mb="xs">
													<Text size="xs" c="dimmed" fw={500}>
														メンバー ({group.members.length}名):
													</Text>
												</Group>
												<Group gap="xs">
													<Avatar.Group spacing="sm">
														{group.members
															.slice(0, 3)
															.map((member: (typeof group.members)[number]) => (
																<Avatar
																	key={member.id}
																	size="sm"
																	radius="xl"
																	color="blue"
																	name={member.email}
																>
																	{member.email.charAt(0).toUpperCase()}
																</Avatar>
															))}
														{group.members.length > 3 && (
															<Avatar size="sm" radius="xl">
																+{group.members.length - 3}
															</Avatar>
														)}
													</Avatar.Group>
												</Group>
												{group.members.length <= 3 && (
													<Stack gap={2} mt="xs">
														{group.members.map(
															(member: (typeof group.members)[number]) => (
																<Text key={member.id} size="xs" c="dimmed">
																	{member.email}
																</Text>
															),
														)}
													</Stack>
												)}
											</div>
										)}

										<Group gap="xs" mt="auto">
											<IconCalendar
												size={14}
												style={{ color: "var(--mantine-color-gray-6)" }}
											/>
											<Text size="xs" c="dimmed">
												作成日: {formatDate(group.createdAt)}
											</Text>
										</Group>

										{group.updatedAt && group.updatedAt !== group.createdAt && (
											<Group gap="xs">
												<IconCalendar
													size={14}
													style={{ color: "var(--mantine-color-gray-6)" }}
												/>
												<Text size="xs" c="dimmed">
													更新日: {formatDate(group.updatedAt)}
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
