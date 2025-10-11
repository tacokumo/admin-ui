import {
	Group,
	Switch,
	Text,
	useMantineColorScheme,
	Burger,
	Button,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { PEPABO_BLUE } from "../constants/colors";

interface HeaderProps {
	opened?: boolean;
	toggle?: () => void;
	isLoggedIn?: boolean;
	onLogout?: () => void;
}

export function Header({ opened, toggle, isLoggedIn = false, onLogout }: HeaderProps) {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();

	return (
		<Group justify="space-between" h="100%" px="md">
			<Group>
				{toggle && (
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
				)}
				<Text size="xl" fw={700} c={PEPABO_BLUE}>
					TACOKUMO Admin
				</Text>
			</Group>

			<Group gap="md">
				{isLoggedIn && (
					<Button variant="outline" onClick={onLogout}>
						ログアウト
					</Button>
				)}

				<Switch
					checked={colorScheme === "dark"}
					onChange={toggleColorScheme}
					onLabel={<IconMoon size={16} />}
					offLabel={<IconSun size={16} />}
				/>
			</Group>
		</Group>
	);
}
