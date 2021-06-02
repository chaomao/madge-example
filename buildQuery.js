const fs = require('fs');
var logger = fs.createWriteStream('neo4j.query', {
  flags: 'a' // 'a' means appending (old data will be preserved)
});
var path = require('path');

const existingNodes = {};
let dep = fs.readFileSync('dep.json');
let data = JSON.parse(dep);

const randomId = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);

function findNodeId(filePath) {
  if (existingNodes[filePath]) {
  } else {
    existingNodes[filePath] = randomId();
    const name = path.basename(filePath);
    logger.write(`create (${existingNodes[filePath]}:File {name: "${name}", fullPath: "${filePath}"})\n`);

  }
  return existingNodes[filePath];
}

const buildRelationship = (sourceNode, depNode) => {
  logger.write(`create (${sourceNode}) - [:Import] -> (${depNode})\n`);
};

for (const source in data) {
  console.log('file is', source);

  const sourceNode = findNodeId(source);
  const deps = data[source];
  deps.forEach(dep => {
    const depNode = findNodeId(dep);
    buildRelationship(sourceNode, depNode);
  });
}

logger.close();

