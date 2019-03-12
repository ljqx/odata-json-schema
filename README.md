# odata-json-schema

Generate JSON Schemas with OData informations from OData $metadata.

## Example
With [the $metadata of service used in OData Doc](https://services.odata.org/V4/TripPinService/$metadata), check `example` folder for the JSON Schemas generated.

## Usage
```js
const { generateJSONSchema } = require('odata-json-schema')

generateJSONSchema('https://services.odata.org/V4/TripPinService', {
  dist: './dist',
  // most types are nullable, you may want to limit generated schema size by considering some of the types are by default nullable
  isByDefaultNullable(ref) {
    if (ref === 'Edm/String') {
      return true;
    }
    return !ref.startsWith('Edm');
  },
  // by default enum value is not generated into the schema, if you need it set this value to true
  withEnumValue: true,
});
```