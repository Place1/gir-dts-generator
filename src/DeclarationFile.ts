import Namespace from './Namespace';
import { codeBlock } from 'common-tags';

import ClassDeclaration from './ClassDeclaration';
import ConstantDeclaration from './ConstantDeclaration';
import Declaration from './Declaration';
import EnumDeclaration from './EnumDeclaration';
import FunctionDeclaration from './FunctionDeclaration';
import InterfaceDeclaration from './InterfaceDeclaration';
import StructDeclaration from './StructDeclaration';

const { load } = require('node-gir');
const GIRepository = load('GIRepository');

export default class DeclarationFile {

  private libraryName: string;
  private libraryVersion?: string;
  private repository = new GIRepository.Repository();
  private namespaces = new Array<Namespace>();

  constructor(libraryName: string, libraryVersion?: string) {
    this.libraryName = libraryName;
    this.libraryVersion = libraryVersion;
  }

  getContent() {
    this.repository.require(this.libraryName, this.libraryVersion, 0);

    const dependencies = this.repository.getDependencies(this.libraryName);
    const dependentLibraries = dependencies.map((dependency) => dependency.split('-'));
    console.info(`${this.libraryName} depends on: ${dependentLibraries.map((tuple) => tuple[0]).join(', ')}`);
    const allLibraries = [[this.libraryName, this.libraryVersion], ...dependentLibraries];
    const namespaceRepresentations = allLibraries.map(([name, version]) => {
      const libVersion = version || this.repository.getVersion(name);
      const libraryNamespace = new Namespace(this.repository, name, libVersion);
      libraryNamespace.build();
      libraryNamespace.orderBy(
        ConstantDeclaration,
        FunctionDeclaration,
        ClassDeclaration,
        InterfaceDeclaration,
        StructDeclaration,
        EnumDeclaration,
      );
      return libraryNamespace.toRepresentation();
    });
    return namespaceRepresentations.join('\n\n');
  }
}
