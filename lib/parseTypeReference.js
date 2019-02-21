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
  return addNullable({
    $ref: parseFullName(typeReference),
  }, nullable);
}

exports.parseTypeReference = parseTypeReference;
