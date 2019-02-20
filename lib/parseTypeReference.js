const { EDMPrimitivesMapping } = require('./EDMPrimitivesMapping');
const { addNullable } = require('./addNullable');
const { parseFullName } = require('./parseFullName');

function parseTypeReference(typeReference, nullable) {
  const collectionExec = /Collection\((.*)\)/.exec(typeReference);
  if (collectionExec) {
    return {
      type: 'array',
      items: parseTypeReference(collectionExec[1]),
    };
  }
  if (typeReference.startsWith('Edm.')) {
    return addNullable(EDMPrimitivesMapping[typeReference.substr(4)], nullable);
  }
  return addNullable({
    $ref: parseFullName(typeReference),
  }, nullable);
}

exports.parseTypeReference = parseTypeReference;
