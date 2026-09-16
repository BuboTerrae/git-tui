import { BoxRenderable, createCliRenderer } from "@opentui/core";
import { createDiff } from "./components/Diff";
import { createFootBar } from "./components/Footbar";
import { createSidebar } from "./components/Sidebar";

const renderer = await createCliRenderer({
	exitOnCtrlC: true,
	backgroundColor: "#1131E9",
});

const sidebar = createSidebar(renderer);
const diff = createDiff(renderer);
const footbar = createFootBar(renderer);

const app = new BoxRenderable(renderer, {
	flexDirection: "column",
	gap: 1,
	height: "100%",
	width: "100%",
	backgroundColor: "#0B1215",
});

const appBox = new BoxRenderable(renderer, {
	flexDirection: "row",
	gap: 1,
	height: "100%",
	width: "100%",
});

appBox.add(sidebar);
appBox.add(diff);

app.add(appBox);
app.add(footbar);

renderer.root.add(app);

renderer.keyInput.on("keypress", (key) => {
	if (key.name === "q") {
		renderer.destroy();
		process.exit(0);
	}
});
