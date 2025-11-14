import { Box, Button, Text } from "@mantine/core";
import { PEPABO_BLACK, PEPABO_BLUE, PEPABO_WHITE } from "../constants/colors";

interface LoginButtonProps {
	onClick?: () => void;
}

export function LoginButton({ onClick }: LoginButtonProps) {
	return (
		<Box
			bg={PEPABO_WHITE}
			p="xl"
			style={{
				borderRadius: "8px",
				boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
				textAlign: "center",
				maxWidth: "400px",
				margin: "0 auto",
			}}
		>
			<Text
				size="xl"
				fw={700}
				mb="lg"
				style={{
					fontSize: "1.5rem",
					color: PEPABO_BLACK,
				}}
			>
				TACOKUMO Admin
			</Text>
			<Button
				onClick={onClick}
				size="md"
				style={{
					backgroundColor: PEPABO_BLUE,
					color: PEPABO_WHITE,
					borderRadius: "6px",
					padding: "10px 20px",
					fontSize: "1rem",
				}}
			>
				ログイン
			</Button>
		</Box>
	);
}
