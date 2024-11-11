var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ExamplesBase, registerExamples } from "../examples.js";
let TypingExamples = class TypingExamples extends ExamplesBase {
    exampleInterface() {
        const addPrincess = (req) => {
            this.log(`Added: ${JSON.stringify(req)}`);
        };
        // Compiler will complain if we don't initialize all fields.
        // addPrincess({
        //   name: "Sparkle",
        //   surname: "Twilight",
        // });
        // Interfaces can be extended.
        this.separator();
        addPrincess({
            name: "Shimmer",
            surname: "Sunset",
            powerRank: 12,
            isAwakened: false,
        });
    }
    exampleType() {
        const addPrincess = (req) => {
            this.log(`Added: ${JSON.stringify(req)}`);
        };
        const addPower = (req) => {
            this.log(`Added: ${JSON.stringify(req)}`);
        };
        addPower({ name: "Chrysalis" });
        // addPower({name: "Trixie"}); // Compiler will complain.
    }
    exampleAsConst() {
        const princesses = {
            day: "Celestia",
            night: "Luna",
        };
        const aspects = {
            first: "day",
            second: "night",
        };
        const getPrincess = (aspect) => {
            return princesses[aspect];
        };
        this.log(getPrincess("night")); // Will work.
        // this.log(getPrincess(aspects.first)); // Compiler will complain!
        // Reason:
        // princesses.destruction = "Fallenstar";
        // this.log(getPrincess("destruction"));
        this.separator();
        const aspectsAsConst = {
            first: "day",
            second: "night",
        };
        this.log(getPrincess("night"));
        this.log(getPrincess(aspectsAsConst.first)); // Works fine.
    }
    exampleTypeofKeyof() {
        const princessesAsConst = {
            day: "Celestia",
            night: "Luna",
            love: "Cadance",
            friendship: "Twilight",
        };
        const getPrincessConst = (aspect) => {
            return princessesAsConst[aspect];
        };
        this.log(getPrincessConst("love"));
        this.log(getPrincessConst("friendship"));
    }
};
TypingExamples = __decorate([
    registerExamples()
], TypingExamples);
export { TypingExamples };
