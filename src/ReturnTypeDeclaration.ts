import { getTypeInfoName } from './helpers';
import Declaration from './Declaration';

const { load } = require('node-gir');
const GIRepository = load('GIRepository');

export default class ReturnTypeDeclaration extends Declaration {

  get argsInfos() {
    const args = [];
    for (let i = 0; i < GIRepository.callableInfoGetNArgs(this.info); i++) {
      const argInfo = GIRepository.callableInfoGetArg(this.info, i);
      args.push(argInfo);
    }
    return args;
  }


  toRepresentation() {
    const infoType = this.info.getType();
    const { FUNCTION, CALLBACK } = GIRepository.InfoType;
    if (![FUNCTION, CALLBACK].includes(infoType)) {
      throw Error('ReturnTypeDeclaration requires a FUNCTION or CALLBACK GIInfoType');
    }

    const returnTypeInfo = GIRepository.callableInfoGetReturnType(this.info);
    const args = this.argsInfos;

    // if the function has no 'out' arguments then the JS return
    // type is just the native functions return type
    const outArgs = args.filter((arg) => {
      if (GIRepository.argInfoIsSkip(arg)) {
        return false;
      }
      const direction = GIRepository.argInfoGetDirection(arg);
      return [GIRepository.Direction.OUT, GIRepository.Direction.INOUT].includes(direction);
    });

    let returnTypeName;
    if (outArgs.length === 0) {
      // if there are no out args then we just use the function's return type
      returnTypeName = getTypeInfoName(returnTypeInfo);
    } else if (outArgs.length === 1 && getTypeInfoName(returnTypeInfo) === 'void') {
      // if there is 1 out arg and NO function return type (void) then the
      // out arg is the only value being returned
      returnTypeName = getTypeInfoName(GIRepository.argInfoGetType(outArgs[0]));
    } else if (outArgs.length > 1 && getTypeInfoName(returnTypeInfo) === 'void') {
      const argTypeNames = args.map((arg) => {
        return getTypeInfoName(GIRepository.argInfoGetType(arg));
      });
      returnTypeName = `[${argTypeNames.join(', ')}]`;
    } else {
      // else we must have 1 or more out values AND a return type so our
      // type signature will be a tuple of [return_type, out_arg_1_type, out_arg_2_type, ...]
      const functionReturnTypeName = getTypeInfoName(returnTypeInfo);
      const argTypeNames = args.map((arg) => {
        return getTypeInfoName(GIRepository.argInfoGetType(arg));
      });
      returnTypeName = `[${functionReturnTypeName}, ${argTypeNames.join(', ')}]`;
    }

    return returnTypeName;
  }
}
