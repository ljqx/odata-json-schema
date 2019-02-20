const { parseMethod } = require('./parseMethod');

function bindMethod(method, extension, type) {
  extension[type] = extension[type] || {};
  extension[type][`${method.Namespace}.${method.Name}`] = method;
}

function findSchemaByRef(schemas, $ref) {
  const frags = $ref.split('/');
  const name = frags.pop();
  return schemas[frags.join('.')][name];
}

function bindMethods(methods = [], Namespace, schemas, type) {
  for (const method of methods) {
    const metadata = parseMethod(method, Namespace);
    if (metadata.IsBound) {
      const bindingParameter = metadata.Parameter[metadata.BindingParameter];
      if (bindingParameter.type === 'array') {
        const schema = findSchemaByRef(schemas, bindingParameter.items.$ref)
        schema.$$ODataExtension.Collection = schema.$$ODataExtension.Collection || {};
        bindMethod(metadata, schema.$$ODataExtension.Collection, type);
      } else {
        const schema = findSchemaByRef(schemas, bindingParameter.$ref)
        bindMethod(metadata, schema.$$ODataExtension, type);
      }
    }
  }
}

exports.bindMethods = bindMethods;
