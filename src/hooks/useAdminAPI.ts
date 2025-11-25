import aspida from "@aspida/axios";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useMemo } from "react";
import api from "../api/$api";

/**
 * Admin API client hook that automatically includes Auth0 access token in requests
 *
 * @returns API client instance with authentication headers
 */
export const useAdminAPI = () => {
	const { getAccessTokenSilently, isAuthenticated } = useAuth0();

	const apiClient = useMemo(() => {
		// Base URL for the API - 実行時環境変数（本番）またはビルド時環境変数（開発）から取得
		const baseURL =
			window.ENV?.VITE_API_BASE_URL ||
			import.meta.env.VITE_API_BASE_URL ||
			"http://admin.example.com/";

		// Create axios instance with interceptor for auth headers
		const axiosInstance = axios.create({
			baseURL,
		});

		// Add request interceptor to include auth headers
		axiosInstance.interceptors.request.use(async (config) => {
			if (isAuthenticated) {
				try {
					const token = await getAccessTokenSilently();
					config.headers.Authorization = `Bearer ${token}`;
				} catch (error) {
					console.error("Failed to get access token:", error);
				}
			}
			return config;
		});

		// Create aspida client with the configured axios instance
		const client = aspida(axiosInstance);

		return api(client);
	}, [getAccessTokenSilently, isAuthenticated]);

	return apiClient;
};

export default useAdminAPI;
