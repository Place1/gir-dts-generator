import * as fs from 'fs';

const { load } = require('node-gir');
const GIRepository = load('GIRepository');

const basicNativeTypes = {
  gboolean: 'boolean',
  utf8: 'string',
  gunichar: 'string',
  filename: 'string',
  gint8: 'number',
  guint8: 'number', // byte
  gint16: 'number',
  guint16: 'number',
  gint32: 'number',
  guint32: 'number',
  gint64: 'number',
  guint64: 'number',
  gfloat: 'number',
  gdouble: 'number',
  GType: 'number',
  void: 'void',
  error: 'Error',

  // the following container types probably need
  // something more fancy to type the inner element types.
  array: 'Array<any>',
  glist: 'Array<any>',
  gslist: 'Array<any>',
  ghash: 'any',
}

function isBasicType(typeName: string) {
  return typeName !== 'interface';
}

function toJsBasicType(typeName: string) {
  if (!(typeName in basicNativeTypes)) {
    console.error(`missing basic type mapping for '${typeName}'`);
  }
  return basicNativeTypes[typeName];
}

// TypeInfo is the type of a runtime value
// i.e. number, string, Array, ...
export function getTypeInfoName(typeInfo) {
  const typeTag = GIRepository.typeInfoGetTag(typeInfo);
  const typeTagName = GIRepository.typeTagToString(typeTag);
  if (isBasicType(typeTagName)) {
    return toJsBasicType(typeTagName);
  } else {
    const interfaceInfo = GIRepository.typeInfoGetInterface(typeInfo);
    if (interfaceInfo.getNamespace() !== typeInfo.getNamespace()) {
      return `${interfaceInfo.getNamespace()}.${interfaceInfo.getName()}`;
    }
    return interfaceInfo.getName();
  }
}

export async function writeFile(file: string, content: string) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
