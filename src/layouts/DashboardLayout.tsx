import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

interface DashboardLayoutProps {
	isLoggedIn?: boolean;
	onLogout?: () => void;
}

export function DashboardLayout({
	isLoggedIn,
	onLogout,
}: DashboardLayoutProps) {
	const [opened, { toggle }] = useDisclosure();

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 300,
				breakpoint: "sm",
				collapsed: { mobile: !opened },
			}}
			footer={{ height: 60 }}
			padding="md"
		>
			<AppShell.Header>
				<Header
					opened={opened}
					toggle={toggle}
					isLoggedIn={isLoggedIn}
					onLogout={onLogout}
				/>
			</AppShell.Header>

			<AppShell.Navbar>
				<Sidebar />
			</AppShell.Navbar>

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>

			<AppShell.Footer>
				<Footer />
			</AppShell.Footer>
		</AppShell>
	);
}
