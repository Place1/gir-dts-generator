import { codeBlock } from "common-tags";
import camelCase = require('camelcase');
import Declaration from "./Declaration";
import { getTypeInfoName } from "./helpers";
import ArgumentDeclaration from "./ArgumentDeclaration";

const { load } = require('node-gir');
const GIRepository = load('GIRepository');

export default class FunctionDeclaration extends Declaration {

  get args() {
    const args = [];
    for (let i = 0; i < GIRepository.callableInfoGetNArgs(this.info); i++) {
      const argInfo = GIRepository.callableInfoGetArg(this.info, i);
      args.push(new ArgumentDeclaration(argInfo).toRepresentation());
    }
    return args.filter((i) => i); // filters 'undefined'
  }

  toRepresentation() {
    const name = this.info.getName();
    const returnTypeName = getTypeInfoName(GIRepository.callableInfoGetReturnType(this.info));
    return `function ${camelCase(name)}(${this.args.join(', ')}): ${returnTypeName};`;
  }
}
