## [0.2.0-1] - 2025-09-02

### 🚀 Features

- *(bin)* Create tsdown config template
- *(bin)* Generate default tsdown config on init
- *(bin)* Use root tsconfig if exists in run command
- *(bin)* Use root tsconfig if exists in dev command

### 🐛 Bug Fixes

- *(bin)* Add typeRoots in tsconfig constant template

### ⚙️ Miscellaneous Tasks

- Update CHANGELOG
- *(dev)* Add DOM lib
- Update peerDeps
## [0.2.0-0] - 2025-09-01

### 🚀 Features

- *(wasm)* Create tsdown plugin to compile to wasm
- *(dev)* Update tsconfig types
- *(dev)* Add wasm plugin in the tsdown base config
- *(dev)* Add assembly types to base config
- *(wasm)* Emit files in the dist folder
- *(wasm)* Compile to virtual module
- *(bin)* Support tsdown config fle in build
- *(benchmark)* Export mitata as benchmark lib

### 🐛 Bug Fixes

- *(wasm)* Write temp files in to standalone environment

### 🚜 Refactor

- *(wasm)* Remove unescessary calls
- *(wasm)* Remove binding cache and transform JS binding
- *(wasm)* Remove unescessary consts

### ⚡ Performance

- *(wasm)* Use async in fs

### 🎨 Styling

- Run Biome

### ⚙️ Miscellaneous Tasks

- Update CHANGELOG
- *(dev)* Extends AssemblyScript types
- Add wasm keyword
## [0.1.0] - 2025-08-30

### 🚀 Features

- *(dev)* Add the exclude in the base tsconfig
- Create standalone environment manager
- Create the run command
- *(bin)* Create tsconfig file for standalone mode
- *(bin)* Create Node executor
- *(server)* Export Hono jsx, quick and tiny
- *(package)* Add main entrypoint

### 🐛 Bug Fixes

- *(bin)* Deamon watch path
- *(bin)* Remove colors from nodemon output
- *(bin)* Add proper args to Biome check
- *(package)* Update script path

### 🚜 Refactor

- *(bin)* Extract file create and update into module
- *(bin)* Create command executors

### 🎨 Styling

- Run Biome check

### ⚙️ Miscellaneous Tasks

- Update CHANGELOG
- *(bin)* Create generic transformer
- *(bin)* Use new executors in build, check and dev commands
- *(bin)* Remove watch flag from run command
- *(build)* Build new Hono exports
## [0.0.2] - 2025-08-29

### 🐛 Bug Fixes

- Show chalk child process colors
- *(bin)* Nodemon ignore and direct exec node

### 🎨 Styling

- *(bin)* Format and call main in templates
- Run Biome check

### ⚙️ Miscellaneous Tasks

- Add Github Packages registry
- Add CHANGELOG
- Add MIT License to the project
- Add release:all script
- Add LICENSE and CHANGELOG in package
## [0.0.1] - 2025-08-29

### 🚀 Features

- Add project
- Multi entrypoints
- Add node serve for node
- Update example
- Create script to auto generate exports
- Update server exports
- Create default Biome and TS config in JSON
- Create hook to Rolldown to copy the JSONs to bundle
- Add biome to root project
- Create CLI
- Change Vite to Rollup
- Update example
- Remove example
- Change rollup to tsdown
- Remove unused files
- Create tsdown default config
- Create dev command for CLI
- Create abstraction to process metadata
- Create tsdown transformer
- Add build command
- Create templates for init with
- Create init command
- Use onlykit in server template
- Add CLI packages
- Add execute path optin for dev
- Add check command

### 🐛 Bug Fixes

- Config files path and simplify Biome config
- Write Biome config and export CLI types
- Update path for init command and maintain styles for the nodemon
- Add main to CLI template and array for Biome template
- *(init)* Update the package.json instead of create

### 🚜 Refactor

- Rename CLI to bin
- Better modularization and reusability
- Move schemas to command folder

### 🎨 Styling

- Format with Biome

### ⚙️ Miscellaneous Tasks

- Add Biome
- Install more CLI packages and update tsdown config
- Ignore noControlCharactersInRegex
- Install type-fest
- Change npm to pnpm
- Install and init cliff
- Add more informations to package
- No tests for NP
