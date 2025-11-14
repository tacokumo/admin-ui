import { Center, Container } from "@mantine/core";
import DefaultLoader from "./DefaultLoader";

export default function LoadingPage() {
	return (
		<Container fluid h="100vh">
			<Center h="100%">
				<DefaultLoader />
			</Center>
		</Container>
	);
}
