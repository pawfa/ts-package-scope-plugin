[![npm version](https://img.shields.io/npm/v/ts-package-scope-plugin.svg)](https://www.npmjs.com/package/ts-package-scope-plugin)
[![Build Status](https://github.com/pawfa/ts-package-scope-plugin/workflows/CI/badge.svg)](https://github.com/pawfa/ts-package-scope-plugin/actions)
[![Build Status](https://snyk.io/test/github/pawfa/ts-package-scope-plugin/badge.svg?targetFile=package.json)](https://snyk.io/test/github/pawfa/ts-package-scope-plugin?targetFile=package.json)

# ts-package-scope-plugin

TypeScript Language Service Plugin for creating package scopes using dir names and JS Docs.

It provides IntelliSense for VS Code and error reporting using TypeScript TSServer.

## Installation and usage

Install package:

`yarn add -D ts-package-scope-plugin` or `npm i --save-dev ts-package-scope-plugin`

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "ts-package-scope-plugin"
      }
    ]
  }
}
```

_VS Code users_

Run command _TypeScript: Select TypeScript version_ and choose _Use workspace version_:

![](docs/typescript-version-vscode.png)

## Configuration

By default, plugin will analyse the same files as the TypeScript compiler in your project. You can override this behavior by using `include` property:

```
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "ts-package-scope-plugin",
        "options": {
          "include": ["./src/**/*"]
        }
      }
    ]
  }
}
```

### Package scope

There are two ways to make module package scoped. Using suffix/prefix in folder name or setting plugin option with specific folder names.

#### 1. `package` prefix/suffix

To make file package scoped using prefix/suffix it needs to be placed in folder with `package` in its name separated with dot ex. `package.<name>` or `<name>.package`:

```
project
│   README.md
│   file001.txt
│
└───package.interface
│   │   api.ts
│
└───package.domain
    │   client.ts
```

#### 2. `packageNames` option

To make file package scoped using specific folder names, they have to be listed as an array in tsconfig.json plugin option:

```
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "ts-package-scope-plugin",
        "options": {
          "packageNames": ["core", "domain"]
        }
      }
    ]
  }
}
```

When you import file from one package into another, IDE will show a TypeScript error.

#### Public scope

To make file available from other packages set its scope to public using JS Doc tag at the top of the file:

```javascript
/** @package-scope public **/
import { Helper } from "./helpers";

export function getClient() {}
```

#### IntelliSense filtering (only for VS Code)

By default, files which are not available for current package will be removed from intellisense suggestions.
To turn on or off this feature you can use `intelliSense` option in tsconfig.json:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "ts-package-scope-plugin",
        "options": {
          "intelliSense": false
        }
      }
    ]
  }
}
```
