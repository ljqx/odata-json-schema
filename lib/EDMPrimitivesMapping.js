const EDMPrimitivesMapping = {
  Boolean: { type: 'boolean' },
  Byte: { type: 'integer' },
  DateTimeOffset: { type: 'string', format: 'date-time' },
  Decimal: { type: 'number' },
  Double: { type: 'number' },
  Int16: { type: 'integer' },
  Int32: { type: 'integer' },
  Int64: { type: 'integer' },
  String: { type: 'string' },
};

exports.EDMPrimitivesMapping = EDMPrimitivesMapping;
