const EDMPrimitivesMapping = {
  Binary: {},
  Boolean: { type: 'boolean' },
  Byte: { type: 'integer' },
  DateTime: {},
  DateTimeOffset: { type: 'string', format: 'date-time' },
  Decimal: { type: 'number' },
  Double: { type: 'number' },
  Float: { type: 'number' },
  GeographyPoint: {},
  Int16: { type: 'integer' },
  Int32: { type: 'integer' },
  Int64: { type: 'integer' },
  SByte: { type: 'integer' },
  Single: { type: 'number' },
  String: { type: 'string' },
  Time: { type: 'string', format: 'time' },
};

Object.entries(EDMPrimitivesMapping).forEach(([EDMType, schema]) => {
  // eslint-disable-next-line no-param-reassign
  schema.$$ODataExtension = {
    Name: EDMType,
  };
});

exports.EDMPrimitivesMapping = EDMPrimitivesMapping;
