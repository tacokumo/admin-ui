import { Center, Text } from "@mantine/core";
import { PEPABO_BLACK } from "../constants/colors";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<Center h="100%" px="md">
			<Text size="sm" c={PEPABO_BLACK} style={{ opacity: 0.7 }}>
				© {currentYear} TACOKUMO Admin. All rights reserved.
			</Text>
		</Center>
	);
}
