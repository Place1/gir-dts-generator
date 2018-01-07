import { codeBlock } from 'common-tags';

import Declaration from './Declaration';
import FieldDeclaration from './FieldDeclaration';
import MethodDeclaration from './MethodDeclaration';

const { load } = require('node-gir');
const GIRepository = load('GIRepository');

export default class StructDeclaration extends Declaration {

  get fields() {
    const fields = [];
    for (let i = 0; i < GIRepository.structInfoGetNFields(this.info); i++) {
      const fieldInfo = GIRepository.structInfoGetField(this.info, i);
      fields.push(new FieldDeclaration(fieldInfo).toRepresentation());
    }
    return fields;
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
