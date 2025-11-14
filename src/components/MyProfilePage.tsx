import { useAuth0 } from "@auth0/auth0-react";
import {
	Alert,
	Avatar,
	Badge,
	Card,
	Container,
	Divider,
	Group,
	LoadingOverlay,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import {
	IconAlertCircle,
	IconCalendar,
	IconMail,
	IconShield,
	IconUser,
} from "@tabler/icons-react";
import { PEPABO_BLACK } from "../constants/colors";

export function MyProfilePage() {
	const { user, isLoading, error } = useAuth0();

	if (error) {
		return (
			<Container size="md">
				<Alert
					icon={<IconAlertCircle size={16} />}
					title="エラー"
					color="red"
					mb="md"
				>
					プロファイル情報の取得に失敗しました: {error.message}
				</Alert>
			</Container>
		);
	}

	return (
		<Container size="md" style={{ position: "relative" }}>
			<LoadingOverlay visible={isLoading} />

			<Stack gap="md">
				<Title order={1} size="h2" c={PEPABO_BLACK}>
					自身の情報
				</Title>

				{user && (
					<Card withBorder p="xl" radius="md">
						<Stack gap="lg">
							{/* プロファイル画像とメイン情報 */}
							<Group align="flex-start" gap="xl">
								<Avatar
									src={user.picture}
									size={80}
									radius="md"
									alt={user.name || "User Avatar"}
								>
									<IconUser size={40} />
								</Avatar>
								<Stack gap="xs" style={{ flex: 1 }}>
									<Title order={2} size="h3" c={PEPABO_BLACK}>
										{user.name || "名前未設定"}
									</Title>
									{user.nickname && user.nickname !== user.name && (
										<Text size="lg" c="dimmed">
											@{user.nickname}
										</Text>
									)}
								</Stack>
							</Group>

							<Divider />

							{/* 詳細情報 */}
							<Stack gap="md">
								<Title order={3} size="h4" c={PEPABO_BLACK}>
									詳細情報
								</Title>

								{/* メールアドレス */}
								<Group gap="sm">
									<IconMail
										size={20}
										style={{ color: "var(--mantine-color-gray-6)" }}
									/>
									<Text fw={500}>メールアドレス:</Text>
									<Text>{user.email || "未設定"}</Text>
									{user.email_verified && (
										<Badge color="green" variant="light" size="sm">
											認証済み
										</Badge>
									)}
								</Group>

								{/* ユーザーID */}
								<Group gap="sm">
									<IconUser
										size={20}
										style={{ color: "var(--mantine-color-gray-6)" }}
									/>
									<Text fw={500}>ユーザーID:</Text>
									<Text
										size="sm"
										c="dimmed"
										style={{ fontFamily: "monospace" }}
									>
										{user.sub}
									</Text>
								</Group>

								{/* 最終ログイン */}
								{user.updated_at && (
									<Group gap="sm">
										<IconCalendar
											size={20}
											style={{ color: "var(--mantine-color-gray-6)" }}
										/>
										<Text fw={500}>最終更新:</Text>
										<Text>
											{new Date(user.updated_at).toLocaleDateString("ja-JP", {
												year: "numeric",
												month: "long",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</Text>
									</Group>
								)}

								{/* 認証方法 */}
								<Group gap="sm">
									<IconShield
										size={20}
										style={{ color: "var(--mantine-color-gray-6)" }}
									/>
									<Text fw={500}>認証プロバイダー:</Text>
									<Badge variant="outline">
										{user.sub?.split("|")[0] || "unknown"}
									</Badge>
								</Group>
							</Stack>

							{/* その他のメタデータ */}
							{Object.keys(user).filter(
								(key) =>
									![
										"name",
										"nickname",
										"picture",
										"email",
										"email_verified",
										"sub",
										"updated_at",
									].includes(key) &&
									user[key as keyof typeof user] !== undefined,
							).length > 0 && (
								<>
									<Divider />
									<Stack gap="md">
										<Title order={3} size="h4" c={PEPABO_BLACK}>
											追加情報
										</Title>
										<Card withBorder p="md" bg="gray.0">
											<Text
												size="sm"
												c="dimmed"
												style={{
													fontFamily: "monospace",
													whiteSpace: "pre-wrap",
												}}
											>
												{JSON.stringify(
													Object.fromEntries(
														Object.entries(user).filter(
															([key]) =>
																![
																	"name",
																	"nickname",
																	"picture",
																	"email",
																	"email_verified",
																	"sub",
																	"updated_at",
																].includes(key),
														),
													),
													null,
													2,
												)}
											</Text>
										</Card>
									</Stack>
								</>
							)}
						</Stack>
					</Card>
				)}
			</Stack>
		</Container>
	);
}
