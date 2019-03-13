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
    return !ref.startsWith('Edm')
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
      const namespacePath = path.join(dist, parseFullName(namespace))
      await mkdirp(namespacePath)
      for (const name in schemas[namespace]) {
        await writeFile(path.join(namespacePath, `${name}.json`), JSON.stringify(schemas[namespace][name], null, 2));
      }
    }
  }
}

function findNavigableSchemas(root, startingPoint) {
  function loadRawSchema(name) {
    return require(`./dist/${name}`)
  }

  const queue = [startingPoint]
  const visited = new Set(queue)
  const navigableSchemas = []

  while (queue.length) {
    const first = queue.shift()
    navigableSchemas.push(first)

    const schema = loadRawSchema(first)
    for (let property of schema.$$ODataExtension.NavigationProperty || []) {
      const propertySchema = schema.properties[property];
      const refType = propertySchema.type == 'array' ?
        propertySchema.items.$ref :
        propertySchema.$ref
      if (typeof refType === 'string' && !visited.has(refType)) {
        queue.push(refType)
        visited.add(refType)
      }
    }
  }

  return navigableSchemas;
}

async function bundle(root, {
  dist = 'schemas.json',
} = {}) {
  const files = await glob('**/*.json', {
    cwd: root
  })
  const bundled = {}
  for (const file of files) {
    bundled[file.substr(0, file.length - '.json'.length)] = require(`./${root}/${file}`);
  }
  await writeFile(dist, JSON.stringify(bundled))
}

module.exports.generateJSONSchema = generateJSONSchema
module.exports.findNavigableSchemas = findNavigableSchemas
module.exports.bundle = bundle