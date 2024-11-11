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
import "reflect-metadata";
import { container, inject, singleton } from "tsyringe";
import { CLI, ArgsParser } from "./services/cli.js";
import { Loader } from "./services/loader.js";
import { Executor } from "./services/executor.js";
let App = class App {
    _cli;
    _loader;
    _exec;
    constructor(_cli, _loader, _exec) {
        this._cli = _cli;
        this._loader = _loader;
        this._exec = _exec;
    }
    async run(request) {
        request.helloLines.forEach((l) => this._cli.echoTitle(l));
        await this._loader.loadAsync();
        while (true) {
            const line = await this._cli.readAsync(request.promptSymbol);
            const cArgs = ArgsParser.parse(line);
            if (request.quitSelectors.includes(cArgs.selector)) {
                await this._loader.saveAsync();
                request.goodbyLines.forEach((l) => this._cli.echoTitle(l));
                this._cli.close();
                return;
            }
            try {
                await this._exec.execute(cArgs);
            }
            catch (error) {
                this._cli.echoError(error.message);
            }
        }
    }
};
App = __decorate([
    singleton(),
    __param(0, inject(CLI)),
    __param(1, inject(Loader)),
    __param(2, inject(Executor)),
    __metadata("design:paramtypes", [CLI,
        Loader,
        Executor])
], App);
const app = container.resolve(App);
await app.run({
    helloLines: [
        "Princess selector CLI!",
        "Use (help) to see command list, or (q) to exit.",
    ],
    goodbyLines: ["Fallenstar is always watching..."],
    promptSymbol: "->",
    quitSelectors: ["exit", "quit", "q"],
});
//# sourceMappingURL=app.js.map