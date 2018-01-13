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

export default class Namespace {

  private declarations = new Array<Declaration>();
  private libraryName: string;
  private libraryVersion: string;
  private repository: any;

  constructor(repository: any, libraryName: string, libraryVersion: string) {
    this.repository = repository;
    this.libraryName = libraryName;
    this.libraryVersion = libraryVersion;
  }

  build() {
    const num_infos = this.repository.getNInfos(this.libraryName);
    console.info(`namespace ${this.libraryName} contains ${num_infos} infos`);
    const startTime = Date.now();
    for (let i = 0; i < num_infos; i++) {
      const info = this.repository.getInfo(this.libraryName, i);
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
    const durationMS = Date.now() - startTime;
    console.info(`namespace ${this.libraryName} finished (${durationMS}ms)`);
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
    const header = `${this.libraryName} ${this.libraryVersion}`;
    return codeBlock`
      // ${header.trim()}
      declare namespace ${this.libraryName} {
        ${libraryDeclarations.join('\n\n')}
      }
    `;
  }

  private add(declaration: Declaration) {
    this.declarations.push(declaration);
  }
}
