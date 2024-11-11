var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ExamplesBase, registerExamples } from "../examples.js";
let ClassExamples = class ClassExamples extends ExamplesBase {
    exampleConstructor() {
        const context = this;
        class Princess {
            _name;
            _surname;
            constructor(raw) {
                const parts = raw.trim().split(" ");
                this._surname = parts[0];
                this._name = parts[1];
                context.log("Princess was created.");
            }
            fullName() {
                return `${this._surname} ${this._name}`;
            }
        }
        // Create instance.
        const princess = new Princess("Twilight Sparkle");
        this.log(`instance: ${princess}`);
        this.log(`json: ${JSON.stringify(princess)}`);
        this.log(`fullName: ${princess.fullName()}`);
    }
    exampleInheritance() {
        const context = this;
        class Pony {
            _name;
            constructor(name) {
                this._name = name;
            }
            run() {
                context.log(`${this._name}: she runs!`);
            }
        }
        class Pegasus extends Pony {
            constructor(name) {
                super(name);
            }
            fly() {
                context.log(`${this._name}: she flies!`);
            }
        }
        const pinkie = new Pony("Pinkie Pie");
        const rainbow = new Pegasus("Rainbow Dash");
        pinkie.run();
        rainbow.run();
        rainbow.fly();
        // No diamond inheritance.
        this.separator();
        class Unicorn extends Pony {
            constructor(name) {
                super(name);
            }
            magic() {
                context.log(`${this._name}: she magics!`);
            }
        }
        class Alicorn extends Pony {
            constructor(name) {
                super(name);
            }
            fly() {
                context.log(`${this._name}: she breaks sound barrier!`);
            }
            magic() {
                context.log(`${this._name}: she is a cheater!`);
            }
        }
        const fallenstar = new Alicorn("Fallenstar");
        fallenstar.run();
        fallenstar.fly();
        fallenstar.magic();
    }
    examplePolymorphism() {
        const context = this;
        class Flier {
            _name;
            constructor(_name) {
                this._name = _name;
            }
        }
        class Pegasus extends Flier {
            fly() {
                // context.log(`${this._name}: she flies fast!`);
            }
        }
        class Griffon extends Flier {
            fly() {
                context.log(`${this._name}: she flies with agility!`);
            }
        }
        const rainbow = new Pegasus("Rainbow Dash");
        const gabby = new Griffon("Gabriela");
        const fliers = [rainbow, gabby];
        fliers.forEach((fl) => fl.fly());
    }
};
ClassExamples = __decorate([
    registerExamples()
], ClassExamples);
export { ClassExamples };
