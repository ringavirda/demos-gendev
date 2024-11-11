import "reflect-metadata";

import { runExamples } from "./examples.js";
import { ClassExamples } from "./examples/classes.js";
import { GenericExamples } from "./examples/generics.js";
import { TypingExamples } from "./examples/typing.js";
import { DecoratorsExamples } from "./examples/decorators.js";

runExamples([
  ClassExamples,
  TypingExamples,
  GenericExamples,
  DecoratorsExamples,
]);
