// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { useAuth0 } from "@auth0/auth0-react";
import { LoginLayout } from "../layouts/LoginLayout";
import { LoginButton } from "./LoginButton";
import { useNavigate } from "react-router";
import LoadingPage from "./LoadingPage";

export default function LoginPage() {
	const { isLoading, isAuthenticated, error, user, loginWithRedirect } =
		useAuth0();
    const navigate = useNavigate();

	if (isLoading) {
		return <LoadingPage/>;
	}
	if (error) {
		return <div>Oops... {error.message}</div>;
	}

	if (isAuthenticated && user) {
        navigate("/dashboard");
        return null; // ナビゲーション後は何も表示しない
	}

	return (
		<LoginLayout>
			<LoginButton onClick={() => loginWithRedirect()} />
		</LoginLayout>
	);
}
