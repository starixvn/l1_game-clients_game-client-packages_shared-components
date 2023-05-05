export default {
    testEnvironment: "jsdom",
    collectCoverage: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: ["**/assets/**/*.ts", "!**/engine/*.ts"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testPathIgnorePatterns: ["/node_modules/"],
    testResultsProcessor: "jest-sonar-reporter",
    coverageReporters: ["cobertura", "text-summary", "text", "lcov"],
    setupFiles: ["<rootDir>//shared-components/tests/mocks/reflect-metadata.ts"],
    reporters: [
        "default",
        [
            "jest-junit",
            {
                outputDirectory: "coverage",
            },
        ],
    ],
    verbose: true,
    moduleNameMapper: {
        cc: "<rootDir>/shared-components/tests/mocks/cc",
        observer: "<rootDir>/shared-components/tests/mocks/observer",
        mobx: "<rootDir>/shared-components/tests/mocks/mobx",
        inversify: "<rootDir>/shared-components/tests/mocks/inversify",
    },
};
