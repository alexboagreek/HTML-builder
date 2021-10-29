const fs = require('fs');
const path = require('path');

const pathRead = path.join(__dirname, 'text.txt');
const readable = fs.createReadStream(pathRead, 'utf8');

readable.on('data', (chunk) => {
  process.stdout.write(chunk);
});