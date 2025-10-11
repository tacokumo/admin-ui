import { StrictMode } from "react";
import { MantineProvider } from "@mantine/core";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";

// 環境変数のバリデーション
const auth0Config = {
	domain: import.meta.env.VITE_AUTH0_DOMAIN,
	clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
	audience: import.meta.env.VITE_AUTH0_AUDIENCE,
};

// 必須の環境変数チェック
const requiredEnvVars = [
	{ key: 'VITE_AUTH0_DOMAIN', value: auth0Config.domain },
	{ key: 'VITE_AUTH0_CLIENT_ID', value: auth0Config.clientId },
	{ key: 'VITE_AUTH0_AUDIENCE', value: auth0Config.audience },
];

const missingVars = requiredEnvVars.filter(env => !env.value);
if (missingVars.length > 0) {
	const missing = missingVars.map(env => env.key).join(', ');
	throw new Error(`Missing required environment variables: ${missing}`);
}

createRoot(document.getElementById("root")!).render(
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
