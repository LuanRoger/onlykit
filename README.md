# onlykit

> Because is the only dependency you need.

onlykit is a meta-package that aggregates essential dependencies to build CLI and web applications with Node.

Install onlykit already gives you the main dependencies to run, build, develop, lint your application. On top of that, it also provides a CLI that wraps common commands to make your life easier, providing good defaults and sensible options.

onlykit also provide a custom transformation on the builder to give you the possibility to build and compile WAMS module via directive to easily use in your codebase.

## Packages by export

- 🚀 `onlykit/benchmark`: A set of packages related to benchmarking
  - [mitada](https://www.npmjs.com/package/mitata)
- ⚙️ `onlykit/cli`: A set of packages to create CLI applications
  - [chalk](https://www.npmjs.com/package/chalk)
  - [commander](https://www.npmjs.com/package/commander)
  - [execa](https://www.npmjs.com/package/execa)
  - [figlet](https://www.npmjs.com/package/figlet)
  - [ora](https://www.npmjs.com/package/ora)
- 🌐 `onlykit/client`: HTTP client utilities
  - [ky](https://www.npmjs.com/package/ky)
- 🛠️ `onlykit/dev`: Base configuration and tools for development and building
  - [TypeScript](https://www.npmjs.com/package/typescript)
  - [Biome](https://www.npmjs.com/package/@biomejs/biome)
  - [tsdown](https://www.npmjs.com/package/tsdown)
  - [Rolldown](https://www.npmjs.com/package/rolldown)
- 🌍 `onlykit/server`: A set of packages to create web server applications
  - [Hono](https://www.npmjs.com/package/hono)
  - [@hono/zod-validator](https://www.npmjs.com/package/@hono/zod-validator)
- ✅ `onlykit/validation`: A set of packages for data validation
  - [Zod](https://www.npmjs.com/package/zod)
- 🧩 `onlykit/wasm`: WASM compilation and transformation
  - [AssemblyScript](https://www.npmjs.com/package/assemblyscript)
  - [Rolldown](https://www.npmjs.com/package/rolldown) (custom plugin to compile AssemblyScript files)

## Install

It's highly recommended to use [pnpm](https://pnpm.io) as package manager, due to it's disk space efficiency ([see more here](https://pnpm.io/motivation#saving-disk-space)), since onlykit depends on a lot of packages. So for this documentation, we will assume you are using pnpm, but you can use any package manager you want.

```bash
pnpm install onlykit
```

### Scaffolding a new project

First, initialize a new project with:

```bash
pnpm init
```

Then, install onlykit as a dependency:

```bash
pnpm install onlykit
```

Now, you can use `onlykit` to scaffold a new project with the following command:

```bash
pnpx onlykit init .
```

If `pnpx` do not found the command, you can also run it with `npx`, event if you installed onlykit with pnpm:

```bash
npx onlykit init .
```

onlykit provides a few templates to start from. You can specify the template with the `--template` option:

```bash
pnpx onlykit init my-app --template cli
```

## Usage

Once you have installed onlykit, you can use the CLI to run common commands. You can see the available commands by running:

```bash
pnpx onlykit --help
```

If you scaffolded a new project, you already have some scripts in your `package.json` to start developing your application. You can run them with:

```bash
pnpm run dev
```

### Using the exports

The dependencies are grouped by functionality and can be imported from the corresponding path. They interface are transparent, whitch means you can use them as if you installed them directly.

```typescript
import { chalk } from "onlykit/cli";
import { Hono } from "onlykit/server";
impo;
```

## WASM Support (`use wasm`)

onlykit provides built-in support for WebAssembly (WASM) through AssemblyScript. You can easily integrate and compile WASM modules in your project using a special directive.

The following example shows how to use the `use wasm` directive:

```typescript
"use wasm";

export function add(a: i32, b: i32): i32 {
  return a + b;
}
```

By adding the `"use wasm";` directive at the top of your AssemblyScript file, onlykit will automatically handle the compilation and integration of the WASM module into your project.

You can then import and use the compiled WASM module in your TypeScript code as follows:

```typescript
import { chalk } from "onlykit/cli";
import { add } from "./wasm-module";

export function main() {
  const result = add(2, 3);

  console.log(chalk.blue(`2 + 3 = ${result}`));
}

main();
```

As said before, the compilation is made by AssemblyScript, so you need to know their concepts, syntax and limitations. You can find more information in the [AssemblyScript documentation](https://www.assemblyscript.org/concepts.html).

## Philosophy

onlykit is designed to be the only dependency you need to build modern Node.js applications. It aggregates essential packages and provides a streamlined development experience, allowing you to focus on writing code rather than managing dependencies and configurations.

The packages was selected following these principles:

- **Essential**: Only include packages that are widely used and essential for building applications.
- **Open Source**: Prefer open-source packages with active communities and good maintenance.
- **License**: Ensure all packages have permissive licenses suitable for commercial use.
- **Performance**: Choose packages that are performant and efficient.
- **Developer Experience**: Focus on packages that enhance the developer experience with good documentation and ease of use.
- **Good Defaults**: Provide sensible defaults and configurations to minimize setup time.

## Contributing

Contributions are welcome! If you have suggestions for new packages to include, improvements to the CLI, or any other ideas, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/LuanRoger/onlykit/blob/main/LICENSE) file for details.
