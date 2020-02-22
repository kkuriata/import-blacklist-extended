[![Build Status](https://travis-ci.com/kkuriata/import-blacklist-extended.svg?branch=master)](https://travis-ci.com/kkuriata/import-blacklist-extended)

# Import blacklist extended

This is a simple TSLint rule that extends functionality of the original `import-blacklist`.

## Instalation

```shell
npm install --save-dev import-blacklist-extended
```

Edit your global `tslint.json` and add the following:

```json
{
    "extends": [
        "import-blacklist-extended"
    ]
}
```

Configure rules within chosen `tslint.json` files:

```json
{
    "rules": {
        "import-blacklist-extended": [
            true,
            {
                "tsLintDirectory": "path/to/tslint/directory",
                "imports": [
                    "@some-scope/path",
                    "./relative/path"
                ]
            }
        ]
    }
}
```

- `tsLintDirectory` - is a path from root to the dicrectory where `tslint.json` file is placed. The rule will work for each `*.ts` file inside selected folder and its subfolders.
- `imports` - an array of blacklisted paths. It supports `tsconfig's` and relative paths (they are relative to the `tsLintDirectory`).
