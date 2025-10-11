import { Stack, NavLink, useMantineColorScheme } from "@mantine/core";
import {
	IconDashboard,
	IconSettings,
	IconUsers,
	IconDatabase,
} from "@tabler/icons-react";
import { useState } from "react";
import { PEPABO_BLUE, PEPABO_BLACK } from "../constants/colors";

export function Sidebar() {
	const [active, setActive] = useState(0);
	const { colorScheme } = useMantineColorScheme();

	const categories = [
		{
			label: "ダッシュボード",
			icon: IconDashboard,
			subcategories: [
				{ label: "概要", value: "概要" },
				{ label: "統計", value: "統計" },
			],
		},
		{
			label: "ユーザー管理",
			icon: IconUsers,
			subcategories: [
				{ label: "ユーザー一覧", value: "ユーザー一覧" },
				{ label: "ロール設定", value: "ロール設定" },
			],
		},
		{
			label: "データ管理",
			icon: IconDatabase,
			subcategories: [
				{ label: "データベース", value: "データベース" },
				{ label: "バックアップ", value: "バックアップ" },
			],
		},
		{
			label: "設定",
			icon: IconSettings,
			subcategories: [
				{ label: "システム設定", value: "システム設定" },
				{ label: "セキュリティ", value: "セキュリティ" },
			],
		},
	];

	// テーマに応じた文字色を設定
	const textColor = colorScheme === 'dark' ? '#ffffff' : PEPABO_BLACK;

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
							onClick={() => setActive(index * 10 + subIndex)}
							style={{
								color: active === index * 10 + subIndex ? PEPABO_BLUE : textColor,
							}}
						/>
					))}
				</NavLink>
			))}
		</Stack>
	);
}
