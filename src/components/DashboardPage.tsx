import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../layouts/DashboardLayout";
import LoadingPage from "./LoadingPage";

export default function DashboardPage() {
	const { isLoading, isAuthenticated, error, logout } = useAuth0();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			navigate("/login");
		}
	}, [isLoading, isAuthenticated, navigate]);

	if (isLoading) {
		return <LoadingPage />;
	}
	if (error) {
		return <div>Oops... {error.message}</div>;
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<DashboardLayout isLoggedIn={isAuthenticated} onLogout={() => logout()} />
	);
}
