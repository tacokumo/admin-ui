// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../layouts/DashboardLayout";
import LoadingPage from "./LoadingPage";
import StatusPage from "./StatusPage";

export default function DashboardPage() {
	const { isLoading, isAuthenticated, error, user, logout } =
		useAuth0();
    const navigate = useNavigate();

	if (isLoading) {
		return <LoadingPage />;
	}
	if (error) {
		return <div>Oops... {error.message}</div>;
	}

	if (!isAuthenticated || user === undefined) {
        navigate("/login");
        return null; // ナビゲーション後は何も表示しない
	}

	return (
		<DashboardLayout isLoggedIn={isAuthenticated} onLogout={() => logout()}>
            <StatusPage />
		</DashboardLayout>
	);
}
