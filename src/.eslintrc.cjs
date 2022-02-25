module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true, 
        },
        "ecmaVersion": 13,
        "sourceType": "module",
    },
    "plugins": [
        "react",
        "@typescript-eslint",
        "unused-imports",
        "import-newlines",
        "import",
    ],
    "rules": {
        "indent": [
            "error",
            4,
        ],
        "linebreak-style": [
            "error",
            "unix",
        ],
        "quotes": [
            "error",
            "double",
        ],
        "semi": [
            "error",
            "always",
        ],
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 1, "maxEOF": 1, 
            },
        ],
        "eol-last": "error",
        "no-unused-vars": "off",
        "object-curly-newline": ["error", {
            "ObjectExpression": "always",
            "ObjectPattern": {
                "multiline": true, "minProperties": 3, 
            },
            "ImportDeclaration": {
                "multiline": true,
            },
            "ExportDeclaration": {
                "multiline": true, "minProperties": 3, 
            },
        }],
        "import/order": ["error", {
            "newlines-between": "never", "alphabetize": {
                "order": "asc", "caseInsensitive": true, 
            },
        }],
        "import-newlines/enforce": "error",
        "comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "never",
            "functions": "never",
        }],
        "object-curly-spacing": ["error", "always", {
            "objectsInObjects": false, 
        }],
        "comma-spacing": ["error", {
            "before": false, "after": true, 
        }],
        "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
            "warn",
            {
                "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_", 
            },
        ],
        "@typescript-eslint/no-empty-interface": "off",
        "react/jsx-closing-tag-location": [
            "error",
        ],
        "react/jsx-indent": ["error"],
        "react/jsx-closing-bracket-location": ["error", "tag-aligned"],
        "react/self-closing-comp": ["error", {
            "component": true,
            "html": true,
        }],
        "react/jsx-uses-react": "error",
    },
};
