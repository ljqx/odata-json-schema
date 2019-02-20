const { parseBoolean } = require('./parseBoolean');
const { parseTypeReference } = require('./parseTypeReference');

function parseEnumType({
  $: { Name, UnderlyingType, IsFlags },
  Member,
}) {
  const memberValues = {};
  for (const { $: { Name, Value } } of Member) {
    memberValues[Name] = Number.parseInt(Value);
  }
  const schema = {
    type: 'string',
    enum: Member.map(({ $: { Name } }) => Name),
    $$ODataExtension: {
      Name,
      Value: memberValues,
    },
  };

  if (UnderlyingType) {
    schema.$$ODataExtension.UnderlyingType = parseTypeReference(UnderlyingType);
  }

  if (IsFlags) {
    schema.$$ODataExtension.IsFlags = parseBoolean(IsFlags);
  }

  return schema;
}

exports.parseEnumType = parseEnumType;
