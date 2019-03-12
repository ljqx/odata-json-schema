const { parseBoolean } = require('./parseBoolean');
const { parseTypeReference } = require('./parseTypeReference');

function parseEnumType({
  $: { Name, UnderlyingType, IsFlags },
  Member,
}, {
  isByDefaultNullable,
  withEnumValue,
}) {
  const schema = {
    type: 'string',
    enum: Member.map(({ $: { Name } }) => Name),
    $$ODataExtension: {
      Name,
    },
  };

  if (withEnumValue) {
    const memberValues = {};
    for (const { $: { Name, Value } } of Member) {
      memberValues[Name] = Number.parseInt(Value);
    }
    schema.$$ODataExtension.Value = memberValues;
  }

  if (UnderlyingType) {
    schema.$$ODataExtension.UnderlyingType = parseTypeReference(UnderlyingType, 'false', {
      isByDefaultNullable,
    });
  }

  if (IsFlags) {
    schema.$$ODataExtension.IsFlags = parseBoolean(IsFlags);
  }

  return schema;
}

exports.parseEnumType = parseEnumType;
