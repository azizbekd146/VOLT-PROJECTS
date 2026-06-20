import js from "@eslint/js";
import react from "eslint-plugin-react";
import prettier from "eslint-config-prettier";

export default [
    js.configs.recommended,
    prettier,
    {
        files: ["src/**/*.{js,jsx}"],
        languageOptions: {
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                React: "readonly",
                JSX: "readonly",
                console: "readonly",
                import: "readonly",
                window: "readonly",
                document: "readonly",
                localStorage: "readonly",
                process: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly",
                fetch: "readonly",
            },
        },
        plugins: {
            react,
        },
        rules: {
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "no-unused-vars": "off",
