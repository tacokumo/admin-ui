import { AppShell, Box, Container } from "@mantine/core";
import { Footer } from "../components/Footer";

interface LoginLayoutProps {
	children?: React.ReactNode;
}

export function LoginLayout({ children }: LoginLayoutProps) {
	return (
		<AppShell header={{ height: 60 }} footer={{ height: 60 }} padding="md">
			<AppShell.Main>
				<Container
					size="lg"
					px="md"
					style={{ minHeight: "calc(100vh - 120px)" }}
				>
					<Box
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							minHeight: "100%",
						}}
					>
						<Box style={{ width: "80%", maxWidth: "600px" }}>{children}</Box>
					</Box>
				</Container>
			</AppShell.Main>

			<AppShell.Footer>
				<Footer />
			</AppShell.Footer>
		</AppShell>
	);
}
