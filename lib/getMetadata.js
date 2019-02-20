const util = require('util');
const request = require('request-promise-native');
const parseXMLString = util.promisify(require('xml2js').parseString);

async function getMetadata(endpoint) {
  const xmlString = await request(`${endpoint}/$metadata`);
  return await parseXMLString(xmlString);
}

exports.getMetadata = getMetadata;
