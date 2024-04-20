module.exports = {
    ignorePatterns: [
        "**/*.bundle.min.js",
        "dist/**/*",
        "**/open-meteo-client/**/*",
        "node_modules/**/*",
        "reports/**/*",
        "docs/**/*",
    ],
    overrides: [
        {
            files: ["**/*.ts"],
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/strict-type-checked",
                "plugin:@typescript-eslint/stylistic-type-checked",
                "prettier",
            ],
            parser: "@typescript-eslint/parser",
            plugins: ["@typescript-eslint", "prettier", "eslint-plugin-jsdoc"],
            rules: {
                "jsdoc/require-jsdoc": [
                    "error",
                    {
                        publicOnly: {
                            cjs: true,
                            esm: true,
                            window: true,
                        },
                        require: {
                            ArrowFunctionExpression: true,
                            ClassDeclaration: true,
                            ClassExpression: true,
                            FunctionDeclaration: true,
                            FunctionExpression: true,
                            MethodDefinition: true,
                        },
                        contexts: [
                            "TSInterfaceDeclaration",
                            "TSTypeAliasDeclaration",
                            "TSEnumDeclaration",
                            "TSPropertySignature",
                        ],
                    },
                ],
                "@typescript-eslint/use-unknown-in-catch-callback-variable": ["off"],
            },
            env: {
                browser: true,
                node: true,
                jest: true,
                es2021: true,
            },
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: ["tsconfig.eslint.json"],
            },
        },
        {
            files: ["cypress/**/*.ts"],
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/strict-type-checked",
                "plugin:@typescript-eslint/stylistic-type-checked",
                "prettier",
            ],
            parser: "@typescript-eslint/parser",
            plugins: ["@typescript-eslint", "prettier"],
            env: {
                browser: true,
                node: true,
                jest: true,
                es2021: true,
            },
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: ["cypress/tsconfig.json"],
            },
        },
        {
            files: ["**/*.js"],
            extends: ["eslint:recommended", "prettier"],
            plugins: ["prettier"],
            env: {
                browser: true,
                node: true,
                jest: true,
                es2021: true,
            },
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
    ],
    rules: {
        "prettier/prettier": ["error"],
        "@typescript-eslint/typedef": ["error"],
        "@typescript-eslint/explicit-function-return-type": ["error"],
    },
    root: true,
};
