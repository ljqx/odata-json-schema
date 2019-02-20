const { parseBoolean } = require('./parseBoolean');

function addNullable(schema, nullable) {
  if (nullable) {
    return Object.assign({
      nullable: parseBoolean(nullable),
    }, schema);
  }
  return schema;
}

exports.addNullable = addNullable;
