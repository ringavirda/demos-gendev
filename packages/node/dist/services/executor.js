var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { randomInt } from "crypto";
import { CLI } from "./cli.js";
import { Loader } from "./loader.js";
import { inject, singleton } from "tsyringe";
let Executor = class Executor {
    _cli;
    _loader;
    constructor(_cli, _loader) {
        this._cli = _cli;
        this._loader = _loader;
    }
    async execute(cArgs) {
        const command = this._commands.find((c) => c.selectors.includes(cArgs.selector));
        if (command === undefined)
            throw new Error(`Unknown command: ${cArgs.selector}`);
        await command.actionAsync(cArgs);
    }
    async princessDialogueAsync(commonName) {
        if (commonName === "") {
            this._cli.echoWarn("Please provide necessary information:");
            commonName = await this._cli.readAsync("Common Name:");
            if (commonName == "")
                throw new Error("Cannot create new princess without a name.");
        }
        else
            this._cli.echoWarn("Please provide additional information:");
        const oldName = await this._cli.readAsync("Old Name (optional):");
        const titlesRaw = await this._cli.readAsync("Titles (optional, comma separated):");
        const titles = titlesRaw
            .replace(" ", "")
            .split(",")
            .filter((s) => s != "");
        return {
            commonName: commonName,
            oldName: oldName,
            titles: titles,
        };
    }
    _commands = [
        {
            selectors: ["list", "ls"],
            actionAsync: async (cArgs) => {
                const categories = this._loader.getCategoryNames();
                if (cArgs.category === "") {
                    this._cli.echoSuccess("Displaying available categories:");
                    categories.forEach((cat) => this._cli.echo(` - ${cat}`));
                }
                else {
                    const category = this._loader.getCategory(cArgs.category);
                    const fullName = this._loader.getCategoryFullName(cArgs.category);
                    this._cli.echoSuccess(`Displaying category [${fullName}]:`);
                    category.forEach((pr, i) => {
                        this._cli.echoInline(`  ${i} - `);
                        this._cli.echoPrincess(pr);
                    });
                }
            },
        },
        {
            selectors: ["get", "g"],
            actionAsync: async (cArgs) => {
                this.argsHaveCategoryAndPrincess(cArgs);
                const princess = this._loader.getPrincess(cArgs.category, cArgs.princess);
                this._cli.echoInline(`Yay! You've selected: `);
                this._cli.echoPrincess(princess);
            },
        },
        {
            selectors: ["getrnd", "gr"],
            actionAsync: async (cArgs) => {
                this.argsHaveCategory(cArgs);
                const category = this._loader.getCategory(cArgs.category);
                this._cli.echoWarn("You prey to the RNG powers...");
                this._cli.echoInline("Someone suddenly appeared: ");
                this._cli.echoSuccess(category[randomInt(category.length)].oldName);
            },
        },
        {
            selectors: ["add", "a"],
            actionAsync: async (cArgs) => {
                this.argsHaveCategory(cArgs);
                const category = this._loader.getCategory(cArgs.category);
                const newPrincess = await this.princessDialogueAsync(cArgs.princess);
                if (category.find((pr) => pr.commonName === newPrincess.commonName))
                    throw new Error(`Princess [${newPrincess.commonName}] already exists.`);
                this._loader.addPrincess(cArgs.category, newPrincess);
            },
        },
        {
            selectors: ["remove", "rm"],
            actionAsync: async (cArgs) => {
                this.argsHaveCategoryAndPrincess(cArgs);
                this._loader.removePrincess(cArgs.category, cArgs.princess);
            },
        },
        {
            selectors: ["change", "ch"],
            actionAsync: async (cArgs) => {
                this.argsHaveCategoryAndPrincess(cArgs);
                const princess = this._loader.getPrincess(cArgs.category, cArgs.princess);
                const newPrincess = await this.princessDialogueAsync(princess.commonName);
                let noChanges = false;
                if (newPrincess.oldName == "") {
                    newPrincess.oldName = princess.oldName;
                    console.log("Using original [Old Name]");
                    noChanges = true;
                }
                if (newPrincess.titles.length === 0) {
                    newPrincess.titles = princess.titles;
                    console.log("Using original [Titles]");
                    if (noChanges) {
                        this._cli.echoWarn("No changes, skipping.");
                        return;
                    }
                }
                this._loader.changePrincess(cArgs.category, princess.commonName, newPrincess);
            },
        },
        {
            selectors: ["help", "h"],
            actionAsync: async (_) => {
                this._cli.echoSuccess("Supported command signatures:");
                this._commands
                    .map((c) => c.selectors.join(", "))
                    .forEach((s) => this._cli.echo(` - ${s}`));
            },
        },
    ];
    argsHaveCategory(cArgs) {
        if (cArgs.category == "")
            throw new Error(`Command (${cArgs.selector}) requires princess category as first argument.`);
    }
    argsHavePrincess(cArgs) {
        if (cArgs.princess == "")
            throw new Error(`Command (${cArgs.selector}) requires princess name or id as second argument.`);
    }
    argsHaveCategoryAndPrincess(cArgs) {
        this.argsHaveCategory(cArgs);
        this.argsHavePrincess(cArgs);
    }
};
Executor = __decorate([
    singleton(),
    __param(0, inject(CLI)),
    __param(1, inject(Loader)),
    __metadata("design:paramtypes", [CLI,
        Loader])
], Executor);
export { Executor };
//# sourceMappingURL=executor.js.map