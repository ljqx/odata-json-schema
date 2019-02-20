# odata-json-schema

Generate JSON Schemas with OData informations from OData $metadata.

## Example
With [the $metadata of service used in OData Doc](https://services.odata.org/V4/TripPinService/$metadata), check `example` folder for the JSON Schemas generated.

## Usage
```js
const { generateJSONSchema } = require('odata-json-schema')

generateJSONSchema('https://services.odata.org/V4/TripPinService', {
  dist: './dist'
});
```