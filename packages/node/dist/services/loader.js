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
import { access, constants, mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { KnownPrincesses } from "../models/princess.js";
import { CLI } from "./cli.js";
import { inject, singleton } from "tsyringe";
class MapFixes {
    static replacer(key, value) {
        if (value instanceof Map) {
            return {
                dataType: "Map",
                value: [...value],
            };
        }
        return value;
    }
    static reviver(key, value) {
        if (typeof value === "object" && value !== null) {
            if (value.dataType === "Map") {
                return new Map(value.value);
            }
        }
        return value;
    }
}
let Loader = class Loader {
    _cli;
    _dirName = "data";
    _fileName = "princesses.json";
    _path = join(import.meta.dirname, "..", this._dirName, this._fileName);
    constructor(_cli) {
        this._cli = _cli;
        this._state = KnownPrincesses;
    }
    _state;
    async loadAsync() {
        try {
            await access(this._path, constants.F_OK);
            const data = await readFile(this._path);
            this._state = JSON.parse(data.toString(), MapFixes.reviver);
        }
        catch (_) {
            this._cli.echoWarn("Princess repo is uninitialized. Populating with default values...");
            await this.saveAsync();
        }
    }
    async saveAsync() {
        const dirPath = join(import.meta.dirname, "..", this._dirName);
        try {
            await access(dirPath);
        }
        catch {
            await mkdir(dirPath);
        }
        await writeFile(this._path, JSON.stringify(this._state, MapFixes.replacer));
    }
    getCategoryFullName(cat) {
        const category = Array.from(this._state).find((category) => category[0].startsWith(cat));
        if (category === undefined)
            throw new Error(`Unknown category [${cat}].`);
        return category[0];
    }
    getCategoryNames() {
        return [...this._state.keys()];
    }
    getCategory(cat) {
        const fullName = this.getCategoryFullName(cat);
        return this._state.get(fullName);
    }
    // Other category methods may be added here.
    getPrincess(cat, name) {
        const category = this.getCategory(cat);
        const index = parseInt(name);
        // Name route.
        if (isNaN(index)) {
            const princess = category.find((pr) => pr.commonName.toLowerCase() === name.toLowerCase());
            if (princess === undefined)
                throw new Error(`Unknown princess [${name}].`);
            return princess;
        }
        // Id route.
        else {
            if (index < 0 || index >= category.length)
                throw new Error(`Id [${index}] is invalid for category [${cat}].`);
            return category[index];
        }
    }
    addPrincess(cat, pr) {
        const category = this.getCategory(cat);
        const fullName = this.getCategoryFullName(cat);
        category.push(pr);
        this._cli.echoSuccess(`Successfully added [${pr.commonName}] to category [${fullName}]`);
    }
    removePrincess(cat, name) {
        const category = this.getCategory(cat);
        const fullName = this.getCategoryFullName(cat);
        const princess = this.getPrincess(cat, name);
        const index = category.indexOf(princess);
        category.splice(index, 1);
        this._cli.echoWarn(`[${category[index].commonName}] is removed from category [${fullName}]`);
    }
    changePrincess(cat, name, newPr) {
        const category = this.getCategory(cat);
        const princess = this.getPrincess(cat, name);
        category[category.indexOf(princess)] = newPr;
        this._cli.echoWarn(`[${newPr.commonName}] is changed to:`);
        this._cli.echoPrincess(newPr);
    }
};
Loader = __decorate([
    singleton(),
    __param(0, inject(CLI)),
    __metadata("design:paramtypes", [CLI])
], Loader);
export { Loader };
//# sourceMappingURL=loader.js.map