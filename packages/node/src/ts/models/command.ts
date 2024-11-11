import { CArgs } from "./cargs.js";

export interface Command {
  selectors: Array<string>;
  actionAsync: (args: CArgs) => Promise<void>;
}
