import { NavLink, Stack, useMantineColorScheme } from "@mantine/core";
import { IconFolder, IconSettings, IconUser } from "@tabler/icons-react";
import { NavLink as RouterNavLink } from "react-router";
import { PEPABO_BLACK, PEPABO_BLUE } from "../constants/colors";

export function Sidebar() {
	const { colorScheme } = useMantineColorScheme();

	const categories = [
		{
			label: "プロジェクト",
			icon: IconFolder,
			subcategories: [{ label: "一覧", path: "/dashboard/projects" }],
		},
		{
			label: "ユーザー",
			icon: IconUser,
			subcategories: [
				{ label: "一覧", path: "/dashboard/users" },
				{ label: "自身の情報", path: "/dashboard/profile" },
			],
		},
		{
			label: "その他",
			icon: IconSettings,
			subcategories: [{ label: "APIサーバ", path: "/dashboard/api-server" }],
		},
	];

	// テーマに応じた文字色を設定
	const textColor = colorScheme === "dark" ? "#ffffff" : PEPABO_BLACK;

	return (
		<Stack gap="xs" p="md">
			{categories.map((category, index) => (
				<NavLink
					key={category.label}
					label={category.label}
					leftSection={<category.icon size={20} />}
					childrenOffset={28}
					defaultOpened={index === 0}
					style={{ color: textColor }}
				>
					{category.subcategories.map((sub) => (
						<RouterNavLink
							key={sub.path}
							to={sub.path}
							style={{ textDecoration: "none" }}
						>
							{({ isActive }) => (
								<NavLink
									label={sub.label}
									active={isActive}
									style={{
										color: isActive ? PEPABO_BLUE : textColor,
									}}
								/>
							)}
						</RouterNavLink>
					))}
				</NavLink>
			))}
		</Stack>
	);
}
