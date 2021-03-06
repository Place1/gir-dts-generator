#!/usr/bin/env node
import ClassDeclaration from './ClassDeclaration';
import ConstantDeclaration from './ConstantDeclaration';
import DeclarationFile from './DeclarationFile';
import EnumDeclaration from './EnumDeclaration';
import FunctionDeclaration from './FunctionDeclaration';
import InterfaceDeclaration from './InterfaceDeclaration';
import StructDeclaration from './StructDeclaration';
import commander = require('commander');
import { writeFile } from './helpers';
require('node-report');

commander
  .version(require('../package.json').version)
  .arguments('<libraryName> [libraryVersion]')
  .option('-o, --output <path>', 'A file to write the output to. Defaults to stdout')
  .action(async (libraryName, libraryVersion, options) => {
    const declarationFile = new DeclarationFile(libraryName, libraryVersion);
    const dts = declarationFile.getContent();
    if (options.output) {
      await writeFile(options.output, dts);
    } else {
      console.log(dts);
    }
  })
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
