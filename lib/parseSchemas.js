const { parseEntityType } = require('./parseEntityType');
const { parseComplexType } = require('./parseComplexType');
const { parseEnumType } = require('./parseEnumType');
const { bindMethods } = require('./bindMethods');
const { EDMPrimitivesMapping } = require('./EDMPrimitivesMapping');

function parseSchemas(schemas) {
  const ans = {
    Edm: {}
  };
  for (const EDMType in EDMPrimitivesMapping) {
    ans.Edm[EDMType] = EDMPrimitivesMapping[EDMType];
  }
  for (const { $: { Namespace }, ComplexType = [], EntityType = [], EnumType = [] } of schemas) {
    ans[Namespace] = {};
    for (const et of EntityType) {
      const etSchema = parseEntityType(et);
      ans[Namespace][etSchema.$$ODataExtension.Name] = etSchema;
    }
    for (const ct of ComplexType) {
      const ctSchema = parseComplexType(ct);
      ans[Namespace][ctSchema.$$ODataExtension.Name] = ctSchema;
    }
    for (const et of EnumType) {
      const etSchema = parseEnumType(et);
      ans[Namespace][etSchema.$$ODataExtension.Name] = etSchema;
    }
  }

  for (const { $: { Namespace }, Action, Function } of schemas) {
    bindMethods(Action, Namespace, ans, 'Action');
    bindMethods(Function, Namespace, ans, 'Function');
  }

  return ans;
}

exports.parseSchemas = parseSchemas;
