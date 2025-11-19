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
	Tabs,
	Text,
	Title,
} from "@mantine/core";
import {
	IconAlertCircle,
	IconCalendar,
	IconShield,
	IconUsers,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Project, Role, UserGroup } from "../api/@types";
import { PEPABO_BLACK, PEPABO_BLUE } from "../constants/colors";
import { useAdminAPI } from "../hooks/useAdminAPI";

const ITEMS_PER_PAGE = 12;

export function ProjectDetailPage() {
	const { projectId } = useParams<{ projectId: string }>();
	const [project, setProject] = useState<Project | null>(null);
	const [roles, setRoles] = useState<Role[]>([]);
	const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentRolePage, setCurrentRolePage] = useState(1);
	const [currentUserGroupPage, setCurrentUserGroupPage] = useState(1);
	const [totalRoles, setTotalRoles] = useState(0);
	const [totalUserGroups, setTotalUserGroups] = useState(0);
	const [activeTab, setActiveTab] = useState<string | null>("roles");
	const apiClient = useAdminAPI();

	const fetchProject = useCallback(async () => {
		if (!projectId) return;

		try {
			setLoading(true);
			setError(null);

			const response = await apiClient.v1alpha1.projects
				._projectId(projectId)
				.$get();
			setProject(response);
		} catch (err) {
			console.error("Failed to fetch project:", err);
			setError("プロジェクトの取得に失敗しました。");
		} finally {
			setLoading(false);
		}
	}, [apiClient, projectId]);

	const fetchRoles = useCallback(
		async (page: number) => {
			if (!projectId) return;

			try {
				setLoading(true);
				setError(null);

				const offset = (page - 1) * ITEMS_PER_PAGE;
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
		[apiClient, projectId],
	);

	const fetchUserGroups = useCallback(
		async (page: number) => {
			if (!projectId) return;

			try {
				setLoading(true);
				setError(null);

				const offset = (page - 1) * ITEMS_PER_PAGE;
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
		[apiClient, projectId],
	);

	useEffect(() => {
		void fetchProject();
	}, [fetchProject]);

	useEffect(() => {
		if (activeTab === "roles") {
			void fetchRoles(currentRolePage);
		}
	}, [currentRolePage, activeTab, fetchRoles]);

	useEffect(() => {
		if (activeTab === "user-groups") {
			void fetchUserGroups(currentUserGroupPage);
		}
	}, [currentUserGroupPage, activeTab, fetchUserGroups]);

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

	const totalRolePages = Math.ceil(totalRoles / ITEMS_PER_PAGE);
	const totalUserGroupPages = Math.ceil(totalUserGroups / ITEMS_PER_PAGE);

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
				{project && (
					<div>
						<Title order={1} size="h2" c={PEPABO_BLACK}>
							{project.name}
						</Title>
						{project.description && (
							<Text size="sm" c="dimmed" mt="xs">
								{project.description}
							</Text>
						)}
					</div>
				)}

				<Tabs value={activeTab} onChange={setActiveTab} color={PEPABO_BLUE}>
					<Tabs.List>
						<Tabs.Tab value="roles" leftSection={<IconShield size={16} />}>
							ロール ({totalRoles})
						</Tabs.Tab>
						<Tabs.Tab value="user-groups" leftSection={<IconUsers size={16} />}>
							ユーザグループ ({totalUserGroups})
						</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value="roles" pt="md">
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

												{role.attributes && role.attributes.length > 0 && (
													<Group gap="xs">
														<Text size="xs" c="dimmed" fw={500}>
															権限:
														</Text>
														<Group gap={4}>
															{role.attributes.map(
																(attr: (typeof role.attributes)[number]) => (
																	<Badge
																		key={attr.id}
																		size="xs"
																		variant="outline"
																	>
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

												{role.updatedAt &&
													role.updatedAt !== role.createdAt && (
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

								{totalRolePages > 1 && (
									<Group justify="center" mt="xl">
										<Pagination
											value={currentRolePage}
											onChange={setCurrentRolePage}
											total={totalRolePages}
											size="md"
											color={PEPABO_BLUE}
										/>
									</Group>
								)}
							</>
						)}
					</Tabs.Panel>

					<Tabs.Panel value="user-groups" pt="md">
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
																	.map(
																		(
																			member: (typeof group.members)[number],
																		) => (
																			<Avatar
																				key={member.id}
																				size="sm"
																				radius="xl"
																				color="blue"
																				name={member.email}
																			>
																				{member.email.charAt(0).toUpperCase()}
																			</Avatar>
																		),
																	)}
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

												{group.updatedAt &&
													group.updatedAt !== group.createdAt && (
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

								{totalUserGroupPages > 1 && (
									<Group justify="center" mt="xl">
										<Pagination
											value={currentUserGroupPage}
											onChange={setCurrentUserGroupPage}
											total={totalUserGroupPages}
											size="md"
											color={PEPABO_BLUE}
										/>
									</Group>
								)}
							</>
						)}
					</Tabs.Panel>
				</Tabs>
			</Stack>
		</Container>
	);
}
