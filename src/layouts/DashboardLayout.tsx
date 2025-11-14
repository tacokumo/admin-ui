import { AppShell, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { MyProfilePage } from "../components/MyProfilePage";
import { ProjectListPage } from "../components/ProjectListPage";
import { RoleListPage } from "../components/RoleListPage";
import { Sidebar } from "../components/Sidebar";
import { StatusPage } from "../components/StatusPage";
import { UserGroupListPage } from "../components/UserGroupListPage";
import { UserListPage } from "../components/UserListPage";
import { PEPABO_BLACK } from "../constants/colors";

export const DashboardComponent = {
	PROJECT_LIST: "PROJECT_LIST",
	MY_PROFILE: "MY_PROFILE",
	API_SERVER: "API_SERVER",
	ROLE_LIST: "ROLE_LIST",
	USER_GROUP_LIST: "USER_GROUP_LIST",
	USER_LIST: "USER_LIST",
} as const;
export type DashboardComponent =
	(typeof DashboardComponent)[keyof typeof DashboardComponent];

interface DashboardLayoutProps {
	children?: React.ReactNode;
	isLoggedIn?: boolean;
	onLogout?: () => void;
	defaultComponent?: React.ReactNode;
}

export function DashboardLayout({
	children,
	isLoggedIn,
	onLogout,
	defaultComponent,
}: DashboardLayoutProps) {
	const [opened, { toggle }] = useDisclosure();
	const [currentComponent, setCurrentComponent] = useState<DashboardComponent>(
		DashboardComponent.PROJECT_LIST,
	);

	const handleMenuClick = (menuItem: DashboardComponent) => {
		setCurrentComponent(menuItem);
	};

	const renderContent = () => {
		switch (currentComponent) {
			case DashboardComponent.PROJECT_LIST:
				return <ProjectListPage />;
			case DashboardComponent.MY_PROFILE:
				return <MyProfilePage />;
			case DashboardComponent.API_SERVER:
				return <StatusPage />;
			case DashboardComponent.ROLE_LIST:
				return <RoleListPage />;
			case DashboardComponent.USER_GROUP_LIST:
				return <UserGroupListPage />;
			case DashboardComponent.USER_LIST:
				return <UserListPage />;
			default:
				return (
					children ||
					defaultComponent || (
						<div>
							<Text size="xl" fw={700} c={PEPABO_BLACK} mb="md">
								Welcome to TACOKUMO Admin
							</Text>
							<Text c={PEPABO_BLACK}>
								Select a menu item from the sidebar to get started.
							</Text>
						</div>
					)
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

			<AppShell.Main>{renderContent()}</AppShell.Main>

			<AppShell.Footer>
				<Footer />
			</AppShell.Footer>
		</AppShell>
	);
}
