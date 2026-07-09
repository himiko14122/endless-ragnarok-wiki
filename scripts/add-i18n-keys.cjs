const fs = require('fs');
const path = require('path');

function addKeys(filePath, newKeys) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  Object.assign(data, newKeys);
  const sorted = {};
  Object.keys(data).sort().forEach(k => { sorted[k] = data[k]; });
  fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2) + '\n');
}

const keysFile = path.join(__dirname, '..', 'src', 'locales', 'en.json');
const newKeys = JSON.parse(fs.readFileSync(path.join(__dirname, 'new-keys.json'), 'utf8'));
addKeys(keysFile, newKeys);
console.log('Added', Object.keys(newKeys).length, 'keys to en.json');
