import MethodDeclaration from './MethodDeclaration';
import Declaration from "./Declaration";
import { codeBlock } from "common-tags";

const { load } = require('node-gir');
const GIRepository = load('GIRepository');

export default class StructDeclaration extends Declaration {

  get fields() {
    return [];
  }

  get methods() {
    const methods = [];
    for (let i = 0; i < GIRepository.structInfoGetNMethods(this.info); i++) {
      const methodInfo = GIRepository.structInfoGetMethod(this.info, i);
      methods.push(new MethodDeclaration(methodInfo).toRepresentation());
    }
    return methods;
  }

  toRepresentation() {
    const name = this.info.getName();
    return codeBlock`
      class ${name} {
        ${this.fields.join('\n')}
        ${this.methods.join('\n')}
      }
    `;
  }
}
