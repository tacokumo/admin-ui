import { Auth0Provider } from "@auth0/auth0-react";
import { MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";

// 実行時環境変数を取得（本番環境）またはビルド時環境変数を取得（開発環境）
const getEnvVar = (key: keyof NonNullable<typeof window.ENV>): string => {
	// 本番環境: window.ENVから取得
	if (window.ENV?.[key]) {
		return window.ENV[key];
	}
	// 開発環境: import.meta.envから取得
	const devValue = import.meta.env[key];
	if (devValue) {
		return devValue;
	}
	throw new Error(`Missing required environment variable: ${key}`);
};

// 環境変数のバリデーション
const auth0Config = {
	domain: getEnvVar("VITE_AUTH0_DOMAIN"),
	clientId: getEnvVar("VITE_AUTH0_CLIENT_ID"),
	audience: getEnvVar("VITE_AUTH0_AUDIENCE"),
};

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}

createRoot(rootElement).render(
	<StrictMode>
		<Auth0Provider
			domain={auth0Config.domain}
			clientId={auth0Config.clientId}
			authorizationParams={{
				audience: auth0Config.audience,
				redirect_uri: window.location.origin,
			}}
		>
			<MantineProvider defaultColorScheme="light">
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</MantineProvider>
		</Auth0Provider>
	</StrictMode>,
);
