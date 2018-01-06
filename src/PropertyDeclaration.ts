import camelCase = require('camelcase');

import Declaration from './Declaration';
import { getTypeInfoName } from './helpers';

const { load } = require('node-gir');
const GIRepository = load('GIRepository');

export default class PropertyDeclaration extends Declaration {
  toRepresentation() {
    const name = this.info.getName();
    const typeInfo = GIRepository.propertyInfoGetType(this.info);
    const typeName = getTypeInfoName(typeInfo);
    return `${camelCase(name)}: ${typeName};`
  }
}
