import {
	BoxRenderable,
	type CliRenderer,
	DiffRenderable,
	RGBA,
	SyntaxStyle,
} from "@opentui/core";
import { Git } from "../lib/git";
import { useFilename } from "../lib/stores/tui.store";

const git = new Git();

const getFiletype = (filePath: string) => {
	const ext = filePath.split(".").pop()?.toLowerCase();
	switch (ext) {
		case "ts":
		case "tsx":
			return "typescript";
		case "js":
		case "jsx":
			return "javascript";
		case "json":
			return "json";
		case "md":
			return "markdown";
		case "css":
			return "css";
		case "html":
			return "html";
		default:
			return undefined;
	}
};

export const createDiff = (renderer: CliRenderer) => {
	const syntaxStyle = SyntaxStyle.fromStyles({
		default: { fg: RGBA.fromHex("#E6EDF3") },
		string: { fg: RGBA.fromHex("#A5D6FF") },
		keyword: { fg: RGBA.fromHex("#4169E1"), bold: true },
	});

	const diffBox = new BoxRenderable(renderer, {
		title: "",
		border: true,
		borderStyle: "rounded",
		borderColor: "#aaaaaa",
	});

	const diff = new DiffRenderable(renderer, {
		flexGrow: 1,
		height: "100%",
		view: "unified",
		diff: "",
		syntaxStyle,
		showLineNumbers: true,
		padding: 1,
	});

	diff.syncScroll = false;
	diffBox.add(diff);

	let currentFetchId = 0;

	useFilename.subscribe(async (state) => {
		const fileName = state.fileName;
		diffBox.title = fileName || "No file selected";

		const fetchId = ++currentFetchId;

		if (!fileName) {
			diff.diff = "";
			renderer.requestRender();
			return;
		}

		try {
			const patch = await git.diff(fileName);
			if (fetchId === currentFetchId) {
				diff.filetype = getFiletype(fileName);
				diff.diff = patch;
				renderer.requestRender();
			}
		} catch (_error) {
			if (fetchId === currentFetchId) {
				diff.diff = `Error loading diff for ${fileName}`;
				renderer.requestRender();
			}
		}
	});

	return diffBox;
};
