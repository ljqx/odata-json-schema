const { parseBoolean } = require('./parseBoolean');

function addNullable(schema, nullable) {
  if (nullable && parseBoolean(nullable)) {
    return {
      oneOf: [schema, {
        type: 'null',
      }],
    }
  }
  return schema;
}

exports.addNullable = addNullable;
