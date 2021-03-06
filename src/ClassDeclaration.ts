import { getTypeInfoName } from './helpers';
import MethodDeclaration from './MethodDeclaration';
import { stripIndent, stripIndents, codeBlock } from 'common-tags';

import PropertyDeclaration from './PropertyDeclaration';
import Declaration from './Declaration';

const { load } = require('node-gir');
const GIRepository = load('GIRepository');

export default class ClassDeclaration extends Declaration {

  get properties() {
    const properties = [];
    for (let i = 0; i < GIRepository.objectInfoGetNProperties(this.info); i++) {
      const propertyInfo = GIRepository.objectInfoGetProperty(this.info, i);
      properties.push(new PropertyDeclaration(propertyInfo).toRepresentation());
    }
    return properties;
  }

  get methods() {
    const methods = [];
    for (let i = 0; i < GIRepository.objectInfoGetNMethods(this.info); i++) {
      const methodInfo = GIRepository.objectInfoGetMethod(this.info, i);
      methods.push(new MethodDeclaration(methodInfo).toRepresentation());
    }
    return methods;
  }

  toRepresentation() {
    const parentInfo = GIRepository.objectInfoGetParent(this.info);

    const name = this.info.getName();
    let parent;
    if (parentInfo) {
      parent = parentInfo.getName();
      if (parentInfo.getNamespace() !== this.info.getNamespace()) {
        parent = `${parentInfo.getNamespace()}.${parent}`;
      }
    }

    return codeBlock`
      class ${name}${parent ? ` extends ${parent}` : ''} {
        ${this.properties.join('\n')}
        ${this.methods.join('\n')}
      }
    `;
  }
}
