// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { Routes,Route } from "react-router";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<LoginPage />} / >
			<Route path="/login" element={<LoginPage />} / >
			<Route path="/dashboard" element={<DashboardPage/>} / >
		</Routes>
	);
}
