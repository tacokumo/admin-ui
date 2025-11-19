// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { Route, Routes } from "react-router";
import DashboardPage from "./components/DashboardPage";
import LoginPage from "./components/LoginPage";
import { MyProfilePage } from "./components/MyProfilePage";
import { ProjectDetailPage } from "./components/ProjectDetailPage";
import { ProjectListPage } from "./components/ProjectListPage";
import { StatusPage } from "./components/StatusPage";
import { UserListPage } from "./components/UserListPage";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<LoginPage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/dashboard" element={<DashboardPage />}>
				<Route index element={<ProjectListPage />} />
				<Route path="projects" element={<ProjectListPage />} />
				<Route path="projects/:projectId" element={<ProjectDetailPage />} />
				<Route path="users" element={<UserListPage />} />
				<Route path="profile" element={<MyProfilePage />} />
				<Route path="api-server" element={<StatusPage />} />
			</Route>
		</Routes>
	);
}
