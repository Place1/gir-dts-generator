import Declaration from "./Declaration";
import { getTypeInfoName } from "./helpers";

const { load } = require('node-gir');
const GIRepository = load('GIRepository');

export default class ConstantDeclaration extends Declaration {
  toRepresentation() {
    const typeInfo = GIRepository.constantInfoGetType(this.info);
    return `const ${this.info.getName()}: ${getTypeInfoName(typeInfo)};`
  }
}
