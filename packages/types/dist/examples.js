import chalk from "chalk";
export class ExamplesBase {
    log(message) {
        if (message instanceof String) {
            message.split("\n").forEach((line) => {
                console.log(` | ${line}`);
            });
        }
        else {
            console.log(` | ${message}`);
        }
    }
    separator() {
        console.log("=".repeat(20));
    }
}
export function runExamples(classes) {
    for (const cls of classes) {
        const examples = Reflect.getMetadata("examples", cls);
        if (examples === undefined || examples.size === 0)
            console.log(chalk.yellow(`Class [${chalk.underline(cls.name)}] has no examples to run.`));
        else {
            console.log(chalk.green(`Class [${chalk.underline(cls.name)}] has ${examples.size} examples.\nPerforming sequential run:`));
            const context = new (Object.create(cls.prototype).constructor)();
            for (const ex of examples.keys()) {
                const exName = ex.replace("example", "");
                const example = examples.get(ex);
                if (example === null) {
                    console.log(chalk.gray(`Example [${exName}] was not run.`));
                }
                else {
                    console.log(chalk.gray(`Example [${exName}] started...`));
                    example?.apply(context);
                    console.log(chalk.gray("Example finished."));
                }
            }
        }
    }
}
export function registerExamples() {
    return function (target) {
        const keys = Reflect.ownKeys(target.prototype);
        const examples = Reflect.getMetadata("examples", target) ?? new Map();
        keys
            .map((k) => k.toString())
            .forEach((key) => {
            if (key.startsWith("example") || key.startsWith("ex")) {
                if (examples.get(key) !== null)
                    examples.set(key, target.prototype[key]);
            }
        });
        Reflect.defineMetadata("examples", examples, target);
    };
}
export function exampleRun(display = true) {
    return function (target, key, desc) {
        const examples = Reflect.getMetadata("examples", target.constructor) ?? new Map();
        if (!display)
            examples.set(key, null);
        else
            examples.set(key, desc.value);
        Reflect.defineMetadata("examples", examples, target.constructor);
    };
}
