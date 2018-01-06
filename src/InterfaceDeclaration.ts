import PropertyDeclaration from './PropertyDeclaration';
import Declaration from "./Declaration";
import { codeBlock } from "common-tags";
import MethodDeclaration from './MethodDeclaration';

const { load } = require('node-gir');
const GIRepository = load('GIRepository');

export default class InterfaceDeclaration extends Declaration {

  get properties() {
    const properties = [];
    for (let i = 0; i < GIRepository.interfaceInfoGetNProperties(this.info); i++) {
      const propertyInfo = GIRepository.interfaceInfoGetProperty(this.info, i);
      properties.push(new PropertyDeclaration(propertyInfo).toRepresentation());
    }
    return properties;
  }

  get methods() {
    const methods = [];
    for (let i = 0; i < GIRepository.interfaceInfoGetNMethods(this.info); i++) {
      const methodInfo = GIRepository.interfaceInfoGetMethod(this.info, i);
      methods.push(new MethodDeclaration(methodInfo).toRepresentation());
    }
    return methods;
  }


  toRepresentation() {
    const name = this.info.getName();
    return codeBlock`
      interface ${name} {
        ${this.properties.join('\n')}
        ${this.methods.join('\n')}
      }
    `;
  }
}
