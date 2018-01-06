import camelCase = require('camelcase');
import Declaration from './Declaration';
import { getTypeInfoName } from './helpers';

const { load } = require('node-gir');
const GIRepository = load('GIRepository');

export default class ArgumentDeclaration extends Declaration {
  toRepresentation() {
    const direction = GIRepository.argInfoGetDirection(this.info);
    const typeInfo = GIRepository.argInfoGetType(this.info)
    const optional = GIRepository.argInfoIsOptional(this.info);
    const nullable = GIRepository.argInfoMayBeNull(this.info);
    const skip = GIRepository.argInfoIsSkip(this.info);
    const name = this.info.getName();
    if (!skip && direction === GIRepository.Direction.IN) {
      return `${camelCase(name)}: ${getTypeInfoName(typeInfo)}`
    }
  }
}
