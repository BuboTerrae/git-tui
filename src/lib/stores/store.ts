type Listener<T> = (state: T) => void;

export function createStore<T>(initialState: T) {
	let state = initialState;

	const listeners = new Set<Listener<T>>();

	return {
		get(): T {
			return state;
		},

		set(update: T | ((prev: T) => T)) {
			const nextState =
				typeof update === "function"
					? (update as (prev: T) => T)(state)
					: update;

			if (Object.is(state, nextState)) return;
			state = nextState;

			for (const listener of listeners) {
				listener(state);
			}
		},

		subscribe(listener: Listener<T>, fireImmediately = true) {
			listeners.add(listener);
			if (fireImmediately) {
				listener(state);
			}

			return () => {
				listeners.delete(listener);
			};
		},
	};
}
