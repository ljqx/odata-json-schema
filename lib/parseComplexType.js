const { parseObjectType } = require('./parseObjectType');

function parseComplexType(ComplexType) {
  return parseObjectType(ComplexType);
}

exports.parseComplexType = parseComplexType;
