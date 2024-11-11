import chalk from "chalk";

export abstract class ExamplesBase {
  protected log(message: string | unknown): void {
    if (message instanceof String) {
      message.split("\n").forEach((line) => {
        console.log(` | ${line}`);
      });
    } else {
      console.log(` | ${message}`);
    }
  }

  protected separator(): void {
    console.log("=".repeat(20));
  }
}

export function runExamples<T extends typeof ExamplesBase>(classes: Array<T>) {
  for (const cls of classes) {
    const examples: Examples | undefined = Reflect.getMetadata("examples", cls);
    if (examples === undefined || examples.size === 0)
      console.log(
        chalk.yellow(
          `Class [${chalk.underline(cls.name)}] has no examples to run.`
        )
      );
    else {
      console.log(
        chalk.green(
          `Class [${chalk.underline(cls.name)}] has ${
            examples.size
          } examples.\nPerforming sequential run:`
        )
      );
      const context = new (Object.create(cls.prototype).constructor)();
      for (const ex of examples.keys()) {
        const exName = ex.replace("example", "");
        const example = examples.get(ex);
        if (example === null) {
          console.log(chalk.gray(`Example [${exName}] was not run.`));
        } else {
          console.log(chalk.gray(`Example [${exName}] started...`));
          example?.apply(context);
          console.log(chalk.gray("Example finished."));
        }
      }
    }
  }
}

export type Examples = Map<string, (() => void) | null>;

export function registerExamples<T extends typeof ExamplesBase>() {
  return function (target: T) {
    const keys = Reflect.ownKeys(target.prototype);
    const examples: Examples =
      Reflect.getMetadata("examples", target) ?? new Map();
    keys
      .map((k) => k.toString())
      .forEach((key) => {
        if (key.startsWith("example") || key.startsWith("ex")) {
          if (examples.get(key) !== null)
            examples.set(key, (target.prototype as any)[key]);
        }
      });
    Reflect.defineMetadata("examples", examples, target);
  };
}

export function exampleRun(display: boolean = true) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    const examples: Examples =
      Reflect.getMetadata("examples", target.constructor) ?? new Map();
    if (!display) examples.set(key, null);
    else examples.set(key, desc.value);
    Reflect.defineMetadata("examples", examples, target.constructor);
  };
}
