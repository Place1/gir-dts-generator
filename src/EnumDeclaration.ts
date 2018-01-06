import Declaration from "./Declaration";
import { codeBlock } from "common-tags";

const { load } = require('node-gir');
const GIRepository = load('GIRepository');

export default class EnumDeclaration extends Declaration {

  get values() {
    const values = [];
    for (let i = 0; i < GIRepository.enumInfoGetNValues(this.info); i++) {
      const valueInfo = GIRepository.enumInfoGetValue(this.info, i);
      values.push(valueInfo.getName().toUpperCase());
    }
    return values;
  }

  toRepresentation() {
    return codeBlock`
      enum ${this.info.getName()} {
        ${this.values.join(',\n')}
      }
    `;
  }
}
