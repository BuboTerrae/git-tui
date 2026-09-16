export class Git {
	async status() {
		const rawChanges = await Bun.$`git status --porcelain=v1 -z`.text();

		return rawChanges
			.split(`\0`)
			.filter(Boolean)
			.map((line) => {
				const trimmed = line.trimStart();

				return { status: trimmed.split(` `)[0], path: trimmed.split(` `)[1] };
			});
	}

	async diff(file: string) {
		return await Bun.$`git diff ${file}`.text();
	}

	async commit(message: string, description?: string) {
		const args = ["commit"];
		if (message) {
			args.push("-m", message);
		}
		if (description) {
			args.push("-m", description);
		}
		return await Bun.$`git ${args}`.text();
	}

	async push() {
		return await Bun.$`git push`.text();
	}
}
