import type {Config} from "jest";
// TO-DO: Make this work
// import {pathsToModuleNameMapper} from "ts-jest";
import {compilerOptions} from "./tsconfig.json";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  roots: ["<rootDir>"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    "^@generated/(.*)$": "<rootDir>/@generated/$1"
  },
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig.test.json"
      }
    ]
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "node"
};

export default config;
