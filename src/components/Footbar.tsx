import {
	BoxRenderable,
	bold,
	type CliRenderer,
	fg,
	TextRenderable,
	t,
} from "@opentui/core";

const branch = await Bun.$`git branch --show-current`.text();
const path = await Bun.$`pwd`.text();

export const createFootBar = (renderer: CliRenderer) => {
	const statusBar = new BoxRenderable(renderer, {
		bottom: 0,
		width: "100%",
		height: 1,
		backgroundColor: "#333333",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingX: 2,
	});

	statusBar.add(
		new TextRenderable(renderer, {
			content: t`${bold(`${path}`)}`,
		}),
	);

	statusBar.add(
		new TextRenderable(renderer, {
			content: t`${bold(`Branch`)}: ${fg("#888888")(`${branch}`)}`,
		}),
	);

	statusBar.add(
		new TextRenderable(renderer, {
			content: t`${fg(`#888888`)(`0.0.1`)}`,
		}),
	);

	return statusBar;
};
