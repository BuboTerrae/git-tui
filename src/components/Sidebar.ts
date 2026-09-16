import {
	BoxRenderable,
	bold,
	type CliRenderer,
	InputRenderable,
	SelectRenderable,
	SelectRenderableEvents,
	TextareaRenderable,
	TextRenderable,
	t,
} from "@opentui/core";
import { Git } from "../lib/git";
import { useFilename } from "../lib/stores/tui.store";

const git = new Git();
const changes = await git.status();

export const createSidebar = (renderer: CliRenderer) => {
	const sidebar = new BoxRenderable(renderer, {
		width: 30,
		height: "100%",
		backgroundColor: "#333333",
		flexDirection: "column",
		gap: "3%",
		padding: 1,
	});

	const menu = new SelectRenderable(renderer, {
		id: "menu",
		height: "100%",
		options: changes
			.map((change) => {
				return {
					name: change?.path ?? "[NO_NAME]",
					description: change?.status ?? "[NO_STATUS]",
				};
			})
			.sort((a, b) => b.description.localeCompare(a.description)),
	});

	const updateFileName = (opt: { name: string } | null) => {
		if (opt?.name) {
			useFilename.set((state) => ({
				...state,
				fileName: opt.name,
			}));
		}
	};

	if (changes.length > 0) {
		updateFileName(menu.getSelectedOption());
	}

	menu.on(SelectRenderableEvents.SELECTION_CHANGED, (_idx, opt) => {
		updateFileName(opt);
	});

	menu.on(SelectRenderableEvents.ITEM_SELECTED, (_idx, opt) => {
		updateFileName(opt);
	});

	menu.focus();

	const commitBox = new BoxRenderable(renderer, {
		height: 7,
		backgroundColor: "#888888",
		flexDirection: "column",
		gap: "3%",
	});

	const msgInput = new InputRenderable(renderer, {
		placeholder: "Commit Message",
		focusedBackgroundColor: "#0B1215",
		onContentChange(_e) {},
	});

	const descInput = new TextareaRenderable(renderer, {
		placeholder: "Commit Description",
		focusedBackgroundColor: "#0B1215",
		height: 3,
		onContentChange(_e) {},
	});

	const commitBtn = new BoxRenderable(renderer, {
		backgroundColor: "#238636",
		borderStyle: "rounded",
		alignItems: "center",
		justifyContent: "center",
		flexGrow: 2,
	});
	commitBtn.add(
		new TextRenderable(renderer, { content: t`${bold(`Commit`)}` }),
	);

	const aiCommitBtn = new BoxRenderable(renderer, {
		backgroundColor: "#8957E5",
		borderStyle: "rounded",
		alignItems: "center",
		justifyContent: "center",
		flexGrow: 1,
	});
	aiCommitBtn.add(new TextRenderable(renderer, { content: t`${bold(`AI`)}` }));
	const btnHolder = new BoxRenderable(renderer, {
		flexDirection: "row",
		gap: 1,
	});
	btnHolder.add(commitBtn);
	btnHolder.add(aiCommitBtn);

	commitBox.add(msgInput);
	commitBox.add(descInput);
	commitBox.add(btnHolder);

	const executeCommit = async () => {
		const message = msgInput.value?.trim();
		const description = descInput.plainText?.trim();

		if (!message) {
			renderer.triggerNotification("Commit message required", "Error");
			return;
		}

		commitBtn.backgroundColor = "#FFA657";
		commitBtn.add(
			new TextRenderable(renderer, { content: t`${bold(`Committing...`)}` }),
		);
		renderer.requestRender();

		try {
			await git.commit(message, description || undefined);
			await git.push();
			renderer.triggerNotification("Committed & pushed!", "Success");
			msgInput.value = "";
			renderer.requestRender();
		} catch (error) {
			renderer.triggerNotification(
				`Commit failed: ${error instanceof Error ? error.message : String(error)}`,
				"Error",
			);
		} finally {
			commitBtn.backgroundColor = "#238636";
			commitBtn.add(
				new TextRenderable(renderer, { content: t`${bold(`Commit`)}` }),
			);
			renderer.requestRender();
		}
	};

	commitBtn.on("click", executeCommit);
	commitBtn.on("mouseup", executeCommit);

	sidebar.add(menu);
	sidebar.add(commitBox);

	return sidebar;
};
