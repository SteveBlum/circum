import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintConfigPrettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";

export default [
    {
        ignores: [
            "**/*.bundle.min.js",
            "dist/**/*",
            "**/open-meteo-client/**/*",
            "node_modules/**/*",
            "reports/**/*",
            "docs/**/*",
        ],
    },
    js.configs.recommended,
    eslintConfigPrettier,
    eslintPluginPrettierRecommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
        files: ["**/*.ts"],
        plugins: {
            tseslintPlugin: tseslint.plugin,
            jsdoc: jsdoc,
        },
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
            "prettier/prettier": ["error"],
            "@typescript-eslint/typedef": ["error"],
            "@typescript-eslint/explicit-function-return-type": ["error"],
        },
        languageOptions: {
            parser: tseslint.parser,
            globals: {
                browser: true,
                node: true,
                jest: true,
                es2021: true,
            },
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: "tsconfig.eslint.json",
            },
        },
    },
    {
        files: ["cypress/**/*.ts"],
        plugins: {
            tseslintPlugin: tseslint.plugin,
        },
        languageOptions: {
            parser: tseslint.parser,
            globals: {
                browser: true,
                node: true,
                jest: true,
                es2021: true,
            },
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: "cypress/tsconfig.json",
            },
        },
    },
    {
        files: ["**/*.{js,mjs,cjs}"],
        ...tseslint.configs.disableTypeChecked,
        languageOptions: {
            globals: {
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
    },
    {
        files: ["typedoc.js"],
        languageOptions: {
            globals: {
                module: true,
            },
        },
    },
    {
        files: ["webpack.*.js"],
        languageOptions: {
            globals: {
                require: true,
                module: true,
                __dirname: true,
            },
        },
        rules: {
            "@typescript-eslint/no-var-requires": ["off"],
            "@typescript-eslint/no-require-imports": ["off"],
        },
    },
];
