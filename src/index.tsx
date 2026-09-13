import { createCliRenderer } from "@opentui/core";
import {
	createRoot,
	useKeyboard,
	useRenderer,
	useTerminalDimensions,
} from "@opentui/react";

function App() {
	const renderer = useRenderer();
	const { width, height } = useTerminalDimensions();

	useKeyboard((key) => {
		if (key.name === "escape") renderer.destroy();
	});

	return (
		<box backgroundColor={"blue"} padding={2}>
			<text>
				Terminal: {width}x{height}
			</text>
			<box style={{ backgroundColor: "red", padding: 5 }}>
				<text>Press ESC to close</text>
			</box>
		</box>
	);
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
