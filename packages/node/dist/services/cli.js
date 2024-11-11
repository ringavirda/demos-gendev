var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import * as readline from "readline/promises";
import chalk from "chalk";
import { singleton } from "tsyringe";
export class ArgsParser {
    static parse(rawArgs) {
        const args = rawArgs
            .split(" ")
            .map((s) => s.trim())
            .filter((s) => s != "");
        if (args.length === 0)
            throw new Error("Nothing was provided!");
        return {
            raw: args,
            selector: args[0],
            category: args.length >= 2 ? args[1] : "",
            princess: args.length >= 3 ? args[2] : "",
        };
    }
}
let CLI = class CLI {
    _cli;
    constructor() {
        this._cli = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true,
        });
        this._cli.setPrompt("");
    }
    close() {
        this._cli.close();
    }
    async readAsync(prompt) {
        return await this._cli.question(`${prompt} `);
    }
    echoInline(message) {
        this._cli.write(message);
    }
    echo(message) {
        this.echoInline(message);
        this.echoInline("\n");
    }
    echoSuccess(message) {
        this.echo(chalk.green(message));
    }
    echoWarn(message) {
        this.echo(chalk.yellow(`${chalk.underline("Warn:")} ${message}`));
    }
    echoError(message) {
        this.echo(chalk.red(`${chalk.underline("Err:")} ${message}`));
    }
    echoTitle(message) {
        this.echo(chalk.bold.red(message));
    }
    echoPrincess(pr) {
        this.echo(pr.commonName !== pr.oldName
            ? `${chalk.magenta(pr.commonName)} (${chalk.grey(pr.oldName)}):`
            : `${chalk.magenta(pr.commonName)}:`);
        this.echo(`\t${chalk.italic(pr.titles.join(", "))}`);
    }
};
CLI = __decorate([
    singleton(),
    __metadata("design:paramtypes", [])
], CLI);
export { CLI };
//# sourceMappingURL=cli.js.map