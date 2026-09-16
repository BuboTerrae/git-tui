import type { FileNameStore } from "../../config/types/store.types";
import { createStore } from "./store";

export const useFilename = createStore<FileNameStore>({ fileName: "" });
