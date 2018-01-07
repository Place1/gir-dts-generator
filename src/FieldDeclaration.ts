import camelCase = require('camelcase');

import Declaration from './Declaration';
import { getTypeInfoName } from './helpers';

const { load } = require('node-gir');
const GIRepository = load('GIRepository');

export default class FieldDeclaration extends Declaration {
  toRepresentation() {
    const name = this.info.getName();
    const typeInfo = GIRepository.fieldInfoGetType(this.info);
    const typeName = getTypeInfoName(typeInfo);
    const flags = GIRepository.fieldInfoGetFlags(this.info);
    const isReadOnly = !(flags & GIRepository.FieldInfoFlags.WRITABLE);
    return `${isReadOnly ? 'readonly ' : ''}${camelCase(name)}: ${typeName};`
  }
}
