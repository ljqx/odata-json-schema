const fs = require('fs');
const path = require('path');
const util = require('util');
const mkdirp = util.promisify(require('mkdirp'));
const writeFile = util.promisify(fs.writeFile);
const { getMetadata } = require('./lib/getMetadata');
const { parseFullName } = require('./lib/parseFullName');
const { parseSchemas } = require('./lib/parseSchemas');

async function generateJSONSchema(endpoint, {
  dist = '.',
  isByDefaultNullable = (ref) => {
    if (ref === 'Edm/String') {
      return true;
    }
    return !ref.startsWith('Edm');
  },
  withEnumValue = false,
} = {}) {
  const metadata = await getMetadata(endpoint);
  const schemas = parseSchemas(metadata['edmx:Edmx']['edmx:DataServices'][0].Schema, {
    isByDefaultNullable,
    withEnumValue,
  });

  for (const namespace in schemas) {
    if (Object.getOwnPropertyNames(schemas[namespace]).length) {
      const namespacePath = path.join(dist, parseFullName(namespace));
      await mkdirp(namespacePath);
      for (const name in schemas[namespace]) {
        await writeFile(path.join(namespacePath, `${name}.json`), JSON.stringify(schemas[namespace][name], null, 2));
      }
    }
  }
}

module.exports.generateJSONSchema = generateJSONSchema
