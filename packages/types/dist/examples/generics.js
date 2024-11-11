var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ExamplesBase, registerExamples } from "../examples.js";
let GenericExamples = class GenericExamples extends ExamplesBase {
    exampleTemplate() {
        const context = this;
        class Container {
            _internal = [];
            constructor(starter) {
                if (starter instanceof Array)
                    starter.forEach((item) => this._internal.push(item));
                else
                    this._internal.push(starter);
            }
            get(index) {
                return this._internal[index];
            }
            add(item) {
                this._internal.push(item);
            }
            remove(id) {
                let index = id;
                if (!Number.isInteger(id)) {
                    index = this._internal.indexOf(id);
                }
                this._internal.splice(index, 1);
            }
            print() {
                context.log(`[ ${this._internal.join(", ")} ]`);
            }
        }
        const cont0 = new Container(0);
        cont0.add(1);
        cont0.add(2);
        cont0.print();
        this.separator();
        const cont1 = new Container(["first", "second"]);
        cont1.add("third");
        cont1.remove(1);
        cont1.print();
        this.separator();
        const cont2 = new Container([...Array(5).keys()]);
        this.log(`get(2): ${cont2.get(2)}`);
        cont2.print();
    }
    exampleConstraints() {
        const context = this;
        class Constrained {
            print(stuff) {
                context.log(stuff); // This is a workaround.
            }
        }
        class MyString extends String {
            some() { }
        }
        const constrained = new Constrained();
        const myString = new MyString("Hey my string!");
        constrained.print(myString);
        // constrained.print("Normal string.") // Compiler will complain.
        const functionConstrained = (func) => { };
        const functionConstrainedLiteral = (func) => { };
        const literalConstrained = (literal) => { };
        const defaultConstrained = (message) => { };
        const multipleVarConstrained = (first, second) => { };
    }
};
GenericExamples = __decorate([
    registerExamples()
], GenericExamples);
export { GenericExamples };
