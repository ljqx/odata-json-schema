const fs = require('fs');
const path = require('path');
const util = require('util');
const glob = util.promisify(require('glob'));
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

  await Promise.all([Object.entries(schemas).filter(
    ([namespace, namespaceSchemas]) => !namespace.startsWith('http')
      && Object.getOwnPropertyNames(namespaceSchemas).length,
  ).map(([namespace, namespaceSchemas]) => {
    const namespacePath = path.join(dist, parseFullName(namespace));
    return (async () => {
      await mkdirp(namespacePath);
      await Promise.all(Object.entries(namespaceSchemas).map(
        ([name, schema]) => writeFile(path.join(namespacePath, `${name}.json`), JSON.stringify(schema, null, 2)),
      ));
    })();
  })]);
}

function findNavigableSchemas(root, startingPoint) {
  function loadRawSchema(name) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(`./${root}/${name}`);
  }

  const queue = [startingPoint];
  const visited = new Set(queue);
  const navigableSchemas = [];

  while (queue.length) {
    const first = queue.shift();
    navigableSchemas.push(first);

    const schema = loadRawSchema(first);
    for (const property of schema.$$ODataExtension.NavigationProperty || []) {
      const propertySchema = schema.properties[property];
      const refType = propertySchema.type === 'array'
        ? propertySchema.items.$ref
        : propertySchema.$ref;
      if (typeof refType === 'string' && !visited.has(refType)) {
        queue.push(refType);
        visited.add(refType);
      }
    }
  }

  return navigableSchemas;
}

async function bundle(root, {
  dist = 'schemas.json',
} = {}) {
  const files = await glob('**/*.json', {
    cwd: root,
  });
  const bundled = {};
  for (const file of files) {
    const name = file.substr(0, file.length - '.json'.length);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    bundled[name] = require(path.join(process.cwd(), root, file));
  }
  await writeFile(dist, JSON.stringify(bundled));
}

module.exports.generateJSONSchema = generateJSONSchema;
module.exports.findNavigableSchemas = findNavigableSchemas;
module.exports.bundle = bundle;
