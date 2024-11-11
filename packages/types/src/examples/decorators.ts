import { ExamplesBase, registerExamples } from "../examples.js";

@registerExamples()
export class DecoratorsExamples extends ExamplesBase {
  exampleClassDecorator() {
    const context = this;

    @classDecorator("Hello from decorator!")
    class Decorated {
      constructor() {
        context.log("Decorated initialized.");
      }
    }

    function classDecorator<T extends typeof Decorated>(arg: string) {
      return function (target: T) {
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

      @methodDecorator("Hello from decorator again!")
      public decorated() {
        context.log("decorated was invoked.");
      }
    }

    function methodDecorator<T extends Decorated>(arg: string) {
      return function (target: T, key: string, desc: PropertyDescriptor) {
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
      @format("This was decorated: {}")
      private _field: string = "hey there!";

      public getFormattedField() {
        let formatString = getFormat(this, "_field");
        return formatString.replace("{}", this._field);
      }
    }

    function format(formatString: string) {
      return Reflect.metadata(formatMetadataKey, formatString);
    }

    function getFormat(target: any, propertyKey: string) {
      return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
    }

    const decorated = new Decorated();
    this.log(decorated.getFormattedField());
  }

  exampleParamDecorator() {
    const context = this;
    const requiredMetadataKey = Symbol("required");

    class Decorated {
      @validate()
      public manyArgs(
        @required() first?: string,
        second?: number,
        @required() third?: boolean
      ) {
        context.log(`f: ${first}, s: ${second}, t: ${third}`);
      }
    }

    function required() {
      return function (target: Object, key: string | symbol, index: number) {
        let existingRequiredParameters: number[] =
          Reflect.getOwnMetadata(requiredMetadataKey, target, key) ?? [];
        existingRequiredParameters.push(index);
        Reflect.defineMetadata(
          requiredMetadataKey,
          existingRequiredParameters,
          target,
          key
        );
      };
    }

    function validate() {
      return function (target: any, key: string, desc: PropertyDescriptor) {
        let method = desc.value;

        desc.value = function () {
          let requiredParameters: number[] = Reflect.getOwnMetadata(
            requiredMetadataKey,
            target,
            key
          );
          if (requiredParameters) {
            for (let parameterIndex of requiredParameters) {
              if (
                parameterIndex >= arguments.length ||
                arguments[parameterIndex] === undefined
              ) {
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
}
