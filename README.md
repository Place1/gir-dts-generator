# GIR DTS Generator (WIP)

This repository contains a CLI tool that uses [node-gir](https://github.com/Place1/node-gir)
to build TypeScript declaration files for GObject annotated libraries.

This project is a WIP. The goal is to provide automatic type declaration files for projects
consuming GObject libraries through [node-gir](https://github.com/Place1/node-gir).

## Usage
```
npm install -g gir-dts-generator
gir-dts-generator --help
```
```
Usage: gir-dts-generator [options] <libraryName> [libraryVersion]


Options:

  -V, --version        output the version number
  -o, --output <path>  A file to write the output to. Defaults to stdout
  -h, --help           output usage information
```

## In Code
_not sure yet_

## Roadmap
* Add support for types that are used from other GObject libraries
  - Currently the declaration files are broken for most libs because
    classes that extend, or functions that use types from another library
    will reference undefined symbols. These symbols will have to be resolved
    and added as extra namespaces in the output declaration file.
* Determine how generated declaration files should be used in code
  - currently the generated declaration file just exports a namespace
    but you can't use a namespace as a type. i.e. the following isn's legal
    typescript: `const GtkLib = load('Gtk', '3.0') as Gtk` where `Gtk`
    is the ambient namespace exported by the generated .d.ts
* Determine the best way to integrate directly with `node-gir`
  - ideally, typescript users consuming `node-gir` should automatically
    get types namespace objects when they `load('library')`. `node-gir`
    could probably be a consumer of this tool and use this feature
    https://github.com/Place1/node-gir/issues/8 to automatically type
    popular libraries.
* Potentially add a flag `--gjs-compat`
  - this flag would make the tool output GJS compatible declarations.
    `node-gir` follow's NodeJS's camelCase naming conventions where
    as GJS uses snake_case.
