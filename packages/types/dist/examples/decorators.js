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
import { ExamplesBase, registerExamples } from "../examples.js";
let DecoratorsExamples = class DecoratorsExamples extends ExamplesBase {
    exampleClassDecorator() {
        const context = this;
        let Decorated = class Decorated {
            constructor() {
                context.log("Decorated initialized.");
            }
        };
        Decorated = __decorate([
            classDecorator("Hello from decorator!"),
            __metadata("design:paramtypes", [])
        ], Decorated);
        function classDecorator(arg) {
            return function (target) {
                context.log(target.toString());
                context.log(arg);
            };
        }
    }
    exampleMethodDecorator() {
        const context = this;
        class Decorated {
            constructor() {
                context.log("Decorated initialized.");
            }
            decorated() {
                context.log("decorated was invoked.");
            }
        }
        __decorate([
            methodDecorator("Hello from decorator again!"),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], Decorated.prototype, "decorated", null);
        function methodDecorator(arg) {
            return function (target, key, desc) {
                context.log(arg);
                context.log(`tgt: ${target}`);
                context.log(`key: ${key}`);
                context.log(desc);
                desc.value?.();
            };
        }
    }
    exampleFieldDecorator() {
        const formatMetadataKey = Symbol("format");
        class Decorated {
            _field = "hey there!";
            getFormattedField() {
                let formatString = getFormat(this, "_field");
                return formatString.replace("{}", this._field);
            }
        }
        __decorate([
            format("This was decorated: {}"),
            __metadata("design:type", String)
        ], Decorated.prototype, "_field", void 0);
        function format(formatString) {
            return Reflect.metadata(formatMetadataKey, formatString);
        }
        function getFormat(target, propertyKey) {
            return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
        }
        const decorated = new Decorated();
        this.log(decorated.getFormattedField());
    }
    exampleParamDecorator() {
        const context = this;
        const requiredMetadataKey = Symbol("required");
        class Decorated {
            manyArgs(first, second, third) {
                context.log(`f: ${first}, s: ${second}, t: ${third}`);
            }
        }
        __decorate([
            validate(),
            __param(0, required()),
            __param(2, required()),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [String, Number, Boolean]),
            __metadata("design:returntype", void 0)
        ], Decorated.prototype, "manyArgs", null);
        function required() {
            return function (target, key, index) {
                let existingRequiredParameters = Reflect.getOwnMetadata(requiredMetadataKey, target, key) ?? [];
                existingRequiredParameters.push(index);
                Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, key);
            };
        }
        function validate() {
            return function (target, key, desc) {
                let method = desc.value;
                desc.value = function () {
                    let requiredParameters = Reflect.getOwnMetadata(requiredMetadataKey, target, key);
                    if (requiredParameters) {
                        for (let parameterIndex of requiredParameters) {
                            if (parameterIndex >= arguments.length ||
                                arguments[parameterIndex] === undefined) {
                                context.log("Missing required argument.");
                                return;
                            }
                        }
                    }
                    return method?.apply(this, arguments);
                };
            };
        }
        const decorated = new Decorated();
        decorated.manyArgs("first", 2, false);
        decorated.manyArgs("first", 2, undefined);
    }
};
DecoratorsExamples = __decorate([
    registerExamples()
], DecoratorsExamples);
export { DecoratorsExamples };
