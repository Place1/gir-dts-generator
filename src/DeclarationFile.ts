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
const repo = new GIRepository.Repository();

export default class DeclarationFile {

  private libraryName: string;
  private libraryVersion: string;
  private declarations = new Array<Declaration>();

  constructor(libraryName: string, libraryVersion?: string) {
    this.libraryName = libraryName;
    this.libraryVersion = libraryVersion;
  }

  build() {
    repo.require(this.libraryName, this.libraryVersion, 0);
    for(let i = 0; i <repo.getNInfos('Gtk'); i++) {
      const info = repo.getInfo('Gtk', i);
      switch (info.getType()) {
        case GIRepository.InfoType.OBJECT:
          this.add(new ClassDeclaration(info));
          break;

        case GIRepository.InfoType.ENUM:
        case GIRepository.InfoType.FLAGS:
          this.add(new EnumDeclaration(info));
          break;

        case GIRepository.InfoType.FUNCTION:
        case GIRepository.InfoType.CALLBACK:
          this.add(new FunctionDeclaration(info));
          break;

        case GIRepository.InfoType.STRUCT:
          this.add(new StructDeclaration(info));
          break;

        case GIRepository.InfoType.CONSTANT:
          this.add(new ConstantDeclaration(info));
          break;

        case GIRepository.InfoType.INTERFACE:
          this.add(new InterfaceDeclaration(info));
          break;

        default:
          console.log(`skipping info '${info.getName()}' with type '${GIRepository.infoTypeToString(info.getType())}'`);
          break;
      }
    }
  }

  private add(declaration: Declaration) {
    this.declarations.push(declaration);
  }

  orderBy(...klasses: Array<any>) {
    this.declarations.sort((a, b) => {
      return klasses.indexOf(a.constructor) < klasses.indexOf(b.constructor) ? -1 : 1;
    });
  }

  toRepresentation() {
    const libraryDeclarations = this.declarations.map((declaration) => {
      return (
        `// ${GIRepository.infoTypeToString(declaration.getInfo().getType())}\n` +
        `export ${declaration.toRepresentation().trim()}`
      );
    });
    const header = `${this.libraryName} ${repo.getVersion(this.libraryName)}`;
    return codeBlock`
      // ${header.trim()}
      declare namespace ${this.libraryName} {
        ${libraryDeclarations.join('\n\n')}
      }
    `;
  }
}


