const { parseObjectType } = require('./parseObjectType');

function parseEntityType({
  Key,
  ...rest
}) {
  const schema = parseObjectType(rest);
  // There could be multiple keys
  if (Key) {
    schema.$$ODataExtension.Key = Key.map(({ PropertyRef: [{ $: { Name } }] }) => Name);
  }
  return schema;
}

exports.parseEntityType = parseEntityType;
