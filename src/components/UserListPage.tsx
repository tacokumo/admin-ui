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
import { IconAlertCircle, IconCalendar, IconUser } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import type { User } from "../api/@types";
import { PEPABO_BLACK, PEPABO_BLUE } from "../constants/colors";
import { useAdminAPI } from "../hooks/useAdminAPI";

const ITEMS_PER_PAGE = 12;

export function UserListPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalUsers, setTotalUsers] = useState(0);
	const apiClient = useAdminAPI();

	const fetchUsers = useCallback(
		async (page: number) => {
			try {
				setLoading(true);
				setError(null);

				const offset = (page - 1) * ITEMS_PER_PAGE;
				// Note: このAPIは実際のAPI仕様に合わせて調整が必要です
				// mockサーバでは全ユーザを取得する形になります
				const response = await apiClient.v1alpha1.users.$get({
					query: {
						limit: ITEMS_PER_PAGE,
						offset: offset,
					},
				});

				setUsers(response);
				setTotalUsers(
					response.length === ITEMS_PER_PAGE
						? offset + ITEMS_PER_PAGE + 1
						: offset + response.length,
				);
			} catch (err) {
				console.error("Failed to fetch users:", err);
				setError("ユーザの取得に失敗しました。");
			} finally {
				setLoading(false);
			}
		},
		[apiClient],
	);

	useEffect(() => {
		fetchUsers(currentPage);
	}, [currentPage, fetchUsers]);

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

	const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

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
							ユーザ一覧
						</Title>
						<Text size="sm" c="dimmed">
							{totalUsers}件のユーザが見つかりました
						</Text>
					</div>
				</Group>

				{users.length === 0 && !loading ? (
					<Card withBorder p="xl" style={{ textAlign: "center" }}>
						<IconUser
							size={48}
							style={{ color: "var(--mantine-color-gray-5)" }}
						/>
						<Title order={3} mt="md" c="dimmed">
							ユーザが見つかりません
						</Title>
						<Text size="sm" c="dimmed" mt="sm">
							まだユーザが登録されていないか、アクセス権限がない可能性があります。
						</Text>
					</Card>
				) : (
					<>
						<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
							{users.map((user) => (
								<Card key={user.id} shadow="sm" padding="md" withBorder>
									<Stack gap="sm">
										<Group justify="space-between">
											<Group gap="sm">
												<Avatar
													size="md"
													radius="xl"
													color="blue"
													name={user.email}
												>
													{user.email.charAt(0).toUpperCase()}
												</Avatar>
												<div>
													<Text fw={600} size="md" c={PEPABO_BLACK}>
														{user.email}
													</Text>
												</div>
											</Group>
											<Badge color="blue" variant="light" size="sm">
												{user.id}
											</Badge>
										</Group>

										{user.roles && user.roles.length > 0 && (
											<div>
												<Group gap="xs" mb="xs">
													<Text size="xs" c="dimmed" fw={500}>
														ロール ({user.roles.length}件):
													</Text>
												</Group>
												<Group gap={4}>
													{user.roles.map(
														(role: (typeof user.roles)[number]) => (
															<Badge
																key={role.id}
																size="xs"
																variant="outline"
																color="green"
															>
																{role.name}
															</Badge>
														),
													)}
												</Group>
												{user.roles.length > 0 && (
													<Stack gap={2} mt="xs">
														{user.roles.map(
															(role: (typeof user.roles)[number]) => (
																<Group key={role.id} gap="xs">
																	<Text size="xs" c="dimmed">
																		{role.name}
																	</Text>
																	{role.project && (
																		<Text size="xs" c={PEPABO_BLUE}>
																			@{role.project.name}
																		</Text>
																	)}
																</Group>
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
												登録日: {formatDate(user.createdAt)}
											</Text>
										</Group>

										{user.updatedAt && user.updatedAt !== user.createdAt && (
											<Group gap="xs">
												<IconCalendar
													size={14}
													style={{ color: "var(--mantine-color-gray-6)" }}
												/>
												<Text size="xs" c="dimmed">
													更新日: {formatDate(user.updatedAt)}
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
