import { Stack, NavLink, useMantineColorScheme } from "@mantine/core";
import {
	IconSettings,
	IconFolder,
} from "@tabler/icons-react";
import { useState } from "react";
import { PEPABO_BLUE, PEPABO_BLACK } from "../constants/colors";

interface SidebarProps {
	onMenuClick?: (menuItem: string) => void;
}

export function Sidebar({ onMenuClick }: SidebarProps) {
	const [active, setActive] = useState(0);
	const { colorScheme } = useMantineColorScheme();

	const categories = [
		{
			label: "プロジェクト",
			icon: IconFolder,
			subcategories: [
				{ label: "一覧", value: "プロジェクト一覧" },
			],
		},
		{
			label: "その他",
			icon: IconSettings,
			subcategories: [
				{ label: "APIサーバ", value: "APIサーバ" },
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
							onClick={() => {
								setActive(index * 10 + subIndex);
								onMenuClick?.(sub.value);
							}}
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
