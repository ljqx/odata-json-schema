const { parseBoolean } = require('./parseBoolean');
const { parseTypeReference } = require('./parseTypeReference');

function parseObjectType({
  $: { Name, Abstract, BaseType, OpenType },
  NavigationProperty,
  Property,
}) {
  const schema = {
    type: 'object',
    properties: {},
    $$ODataExtension: {
      Name,
    }
  };
  if (Abstract) {
    schema.$$ODataExtension.Abstract = parseBoolean(Abstract);
  }
  if (BaseType) {
    schema.$$ODataExtension.BaseType = parseTypeReference(BaseType);
  }
  if (OpenType) {
    schema.$$ODataExtension.OpenType = parseBoolean(OpenType);
  }
  if (NavigationProperty) {
    schema.$$ODataExtension.NavigationProperty = NavigationProperty.map(({ $: { Name } }) => Name);
    for (const { $: { Name, Type, Nullable } } of NavigationProperty) {
      schema.properties[Name] = parseTypeReference(Type, Nullable);
    }
  }
  if (Property) {
    for (const { $: { Name, Type, Nullable } } of Property) {
      schema.properties[Name] = parseTypeReference(Type, Nullable);
    }
  }
  return schema;
}

exports.parseObjectType = parseObjectType;
