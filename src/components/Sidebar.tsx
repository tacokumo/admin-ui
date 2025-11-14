import { NavLink, Stack, useMantineColorScheme } from "@mantine/core";
import {
	IconFolder,
	IconSettings,
	IconShield,
	IconUser,
	IconUsers,
} from "@tabler/icons-react";
import { useState } from "react";
import { PEPABO_BLACK, PEPABO_BLUE } from "../constants/colors";
import { DashboardComponent } from "../layouts/DashboardLayout";

interface SidebarProps {
	onMenuClick?: (menuItem: DashboardComponent) => void;
}

export function Sidebar({ onMenuClick }: SidebarProps) {
	const [active, setActive] = useState(0); // プロジェクト一覧を初期選択
	const { colorScheme } = useMantineColorScheme();

	const categories = [
		{
			label: "プロジェクト",
			icon: IconFolder,
			subcategories: [
				{ label: "一覧", value: DashboardComponent.PROJECT_LIST },
			],
		},
		{
			label: "ロール",
			icon: IconShield,
			subcategories: [{ label: "一覧", value: DashboardComponent.ROLE_LIST }],
		},
		{
			label: "ユーザグループ",
			icon: IconUsers,
			subcategories: [
				{ label: "一覧", value: DashboardComponent.USER_GROUP_LIST },
			],
		},
		{
			label: "ユーザー",
			icon: IconUser,
			subcategories: [
				{ label: "一覧", value: DashboardComponent.USER_LIST },
				{ label: "自身の情報", value: DashboardComponent.MY_PROFILE },
			],
		},
		{
			label: "その他",
			icon: IconSettings,
			subcategories: [
				{ label: "APIサーバ", value: DashboardComponent.API_SERVER },
			],
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
					{category.subcategories.map((sub, subIndex) => (
						<NavLink
							key={sub.value}
							label={sub.label}
							active={active === index * 10 + subIndex}
							onClick={() => {
								setActive(index * 10 + subIndex);
								onMenuClick?.(sub.value);
							}}
							style={{
								color:
									active === index * 10 + subIndex ? PEPABO_BLUE : textColor,
							}}
						/>
					))}
				</NavLink>
			))}
		</Stack>
	);
}
