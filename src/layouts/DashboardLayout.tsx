import { AppShell, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/Footer";
import { StatusPage } from "../components/StatusPage";
import { ProjectListPage } from "../components/ProjectListPage";
import { PEPABO_BLACK } from "../constants/colors";

interface DashboardLayoutProps {
	children?: React.ReactNode;
	isLoggedIn?: boolean;
	onLogout?: () => void;
}

export function DashboardLayout({ children, isLoggedIn, onLogout }: DashboardLayoutProps) {
	const [opened, { toggle }] = useDisclosure();
	const [currentComponent, setCurrentComponent] = useState<string>("");

	const handleMenuClick = (menuItem: string) => {
		setCurrentComponent(menuItem);
	};

	const renderContent = () => {
		switch (currentComponent) {
			case "プロジェクト一覧":
				return <ProjectListPage />;
			case "APIサーバ":
				return <StatusPage />;
			default:
				return children || (
					<div>
						<Text size="xl" fw={700} c={PEPABO_BLACK} mb="md">
							Welcome to TACOKUMO Admin
						</Text>
						<Text c={PEPABO_BLACK}>
							Select a menu item from the sidebar to get started.
						</Text>
					</div>
				);
		}
	};

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
				<Sidebar onMenuClick={handleMenuClick} />
			</AppShell.Navbar>

			<AppShell.Main>
				{renderContent()}
			</AppShell.Main>

			<AppShell.Footer>
				<Footer />
			</AppShell.Footer>
		</AppShell>
	);
}
